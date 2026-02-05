import { config } from "dotenv";
config();

import prisma from "@/lib/prisma";
import { generateArticle, getLatestNewsTopics } from "@/lib/ai";
import { parseArticleResponse } from "@/lib/utils";
import { s3Client, S3_BUCKET } from "@/lib/s3";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const CATEGORIES = ["Sweden", "World", "Technology", "Sports", "Culture"];

async function main() {
  console.log("Starting seed with Gemini generation and S3 uploads...");

  const cleanEndpoint = process.env.S3_ENDPOINT?.replace(/\/$/, "");
  console.log(`Using S3 Endpoint: ${cleanEndpoint}`);
  console.log(`Using S3 Bucket: ${S3_BUCKET}`);

  // 0. Clear existing Articles
  const articleCount = await prisma.article.count();
  if (articleCount > 0) {
    console.log(`Clearing ${articleCount} existing articles...`);
    await prisma.article.deleteMany({});

    // Properly clear S3 "folder" by listing and deleting all objects
    const listedObjects = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: "articles/",
      }),
    );

    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: S3_BUCKET,
          Delete: {
            Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
          },
        }),
      );
      console.log(`Cleared ${listedObjects.Contents.length} files from S3.`);
    }
  } else {
    console.log("No existing articles found, skipping cleanup.");
  }

  // 1. Upsert Categories
  console.log("Seeding categories...");
  const categoriesMap = new Map();
  for (const catName of CATEGORIES) {
    const catId = catName.toLowerCase();
    const category = await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: {
        id: catId,
        name: catName,
      },
    });
    categoriesMap.set(catName, category.id);
    console.log(`- Category: ${catName}`);
  }

  // 2. Ensure User (Author)
  console.log("Seeding user...");
  const userEmail = "seed_editor@example.com";
  const userId = "seed-user-id";

  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      id: userId,
      email: userEmail,
      name: "Seed Editor",
      role: "admin",
    },
  });
  console.log(`- User: ${user.name} (${user.email})`);

  // 3. Topics for Swedish news
  console.log("Fetching latest news topics...");
  const topics = await getLatestNewsTopics(5);
  console.log(`Found ${topics.length} topics:`);
  topics.forEach((t) => console.log(` - ${t}`));

  console.log("\nGenerating articles...");
  // Batch processing to save on API requests
  const BATCH_SIZE = 3;
  for (let i = 0; i < topics.length; i += BATCH_SIZE) {
    const batch = topics.slice(i, i + BATCH_SIZE);
    console.log(`\nProcessing batch of ${batch.length} topics...`);

    for (const topic of batch) {
      console.log(`- ${topic}`);
      try {
        let generatedText;
        try {
          generatedText = await generateArticle(topic);
          // Small delay to respect rate limits even with batching
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (aiErr) {
          console.warn(
            `AI Generation failed for "${topic}", using fallback content. (Reason: ${aiErr instanceof Error ? aiErr.message : "Unknown"})`,
          );
          generatedText = `TITLE: ${topic}
CONTENT:
# ${topic}
**This is a fallback article about ${topic}.** The AI generation was unavailable at the time of seeding. 
        
## Background
Sweden continues to be a leader in this area, and further developments are expected soon.`;
        }

        const { title, content } = parseArticleResponse(generatedText);

        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const filename = `${slug}-${Date.now()}.md`;
        const s3Key = `articles/${filename}`;

        // Upload to S3
        console.log(`Uploading content to S3: ${s3Key}`);
        await s3Client.send(
          new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: s3Key,
            Body: content,
            ContentType: "text/markdown",
          }),
        );

        const contentUrl = `${process.env.S3_ENDPOINT}/${S3_BUCKET}/${s3Key}`;

        // Select random category
        const randomCat =
          CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        const categoryId = categoriesMap.get(randomCat);

        // Create Article in DB
        await prisma.article.create({
          data: {
            id: slug + "-" + Math.floor(Math.random() * 100000),
            title: title,
            contentUrl: contentUrl,
            categoryId: categoryId!,
            authorId: user.id,
            userId: user.id,
            type: "news",
          },
        });
        console.log(`Successfully created article: ${title}`);
      } catch (e) {
        console.error(`Error processing topic "${topic}":`, e);
      }
    }
  }

  console.log("\nSeed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
