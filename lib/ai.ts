"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateArticle(prompt: string) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash-lite"),
    prompt,
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
