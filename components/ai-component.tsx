"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { generateArticle } from "@/lib/ai";

interface AiComponentProps {
  content: (() => string) | undefined;
  title: string | undefined;
  onContentGenerated: (content: string) => void;
}

export default function AiComponent({
  content,
  title,
  onContentGenerated,
}: AiComponentProps) {
  const prompt = `Either complete/add to the content based on the title:${title ? title : "no title availible"} and the content unless no content is availible. Content: ${content ? content() : "no content availible"}`;
  const [isLoading, setIsLoading] = useState(false);
  if (content) {
    console.log(content());
  }
  console.log(title);
  return (
    <div className="flex flex-col gap-4">
      <Button
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          const text = await generateArticle(prompt);
          if (text) {
            onContentGenerated(text);
          }
          setIsLoading(false);
        }}
      >
        {isLoading ? "Generating..." : "Generate Article"}
      </Button>
    </div>
  );
}
