"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateArticle(prompt: string) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt,
  });
  return text;
}
