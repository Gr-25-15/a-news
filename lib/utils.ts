import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseArticleResponse(text: string) {
  const titleMatch = text.match(/TITLE:\s*(.+)/);
  const contentMatch = text.match(/CONTENT:\s*([\s\S]*)/);

  return {
    title: titleMatch ? titleMatch[1].trim() : "Untitled Article",
    content: contentMatch ? contentMatch[1].trim() : text,
  };
}
