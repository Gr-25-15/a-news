import { config } from "dotenv";
config();

import prisma from "@/lib/prisma";
import { generateArticle } from "@/lib/ai";
import { s3Client, S3_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const CATEGORIES = ["Sweden", "World", "Technology", "Sports", "Culture"];

async function main() {
  console.log("Starting seed with Gemini generation and S3 uploads...");

  const cleanEndpoint = process.env.S3_ENDPOINT?.replace(/\/$/, "");
  console.log(`Using S3 Endpoint: ${cleanEndpoint}`);
  console.log(`Using S3 Bucket: ${S3_BUCKET}`);

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
  const topics = [
    "Sweden's new recycling initiative for 2026",
    "Stockholm tech week: The rise of AI in Scandinavia",
    "Local sports team wins championship in Malmö",
    "Traditional Swedish culinary trends for the next season",
    "Major archaeological discovery of Viking artifacts in Uppsala",
  ];

  console.log("Generating articles...");
  for (const topic of topics) {
    console.log(`\nProcessing topic: ${topic}`);
    try {
      const prompt = `Write a short news article about "${topic}".
      The content should be relevant to Sweden.
      The output must be strictly in the following format:
      TITLE: [The Title]
      CONTENT:
      [The Article Content in Markdown]`;

      let generatedText;
      try {
        generatedText = await generateArticle(prompt);
      } catch (aiErr) {
        console.warn(
          `AI Generation failed for "${topic}", using fallback content. (Reason: ${aiErr instanceof Error ? aiErr.message : "Unknown"})`,
        );
        generatedText = `TITLE: ${topic}
CONTENT:
This is a fallback article about ${topic}. The AI generation was unavailable at the time of seeding. 
        
Sweden continues to be a leader in this area, and further developments are expected soon.`;
      }

      // Parse
      const titleMatch = generatedText.match(/TITLE:\s*(.+)/);
      const contentMatch = generatedText.match(/CONTENT:\s*([\s\S]*)/);

      if (!titleMatch || !contentMatch) {
        console.warn(`Failed to parse generated text for topic: ${topic}`);
        continue;
      }

      const title = titleMatch[1].trim();
      const content = contentMatch[1].trim();

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
