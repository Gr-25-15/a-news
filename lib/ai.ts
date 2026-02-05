"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const ARTICLE_PROMPT = (topic: string) =>
  `
Write a professional news article about the following topic: {{topic}}.
The content should be relevant to Sweden.

The output must be strictly in the following format:
TITLE: [The Title]
CONTENT:
# [The Title]
[Lead Paragraph in **bold**]

## [Sub-header]
[Article body with at least two sections, using markdown for *emphasis* and list items if relevant.]
`.trim();

export async function generateArticle(topic: string) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    prompt: ARTICLE_PROMPT(topic),
  });
  return text;
}

export async function getLatestNewsTopics(count: number = 5) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    tools: {
      google_search: google.tools.googleSearch({}),
    },
    prompt: `Find ${count} current, real news headlines or topics from Sweden for today, February 5, 2026. 
    Return them as a simple list with one topic per line. 
    Do not include any other text.`,
  });

  return text
    .split("\n")
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0)
    .slice(0, count);
}
