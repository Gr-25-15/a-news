"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { generateArticle } from "@/lib/ai";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AiComponent() {
  const [prompt, setPrompt] = useState("");
  const [article, setArticle] = useState("There is no article");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading ? (
        "Loading.."
      ) : (
        <div className="prose">
          <Markdown remarkPlugins={[remarkGfm]}>{article}</Markdown>
        </div>
      )}
      <Input
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      />
      <Button
        onClick={async () => {
          setIsLoading(true);
          setArticle(await generateArticle(prompt));
          setIsLoading(false);
        }}
      >
        Generate Article
      </Button>
    </>
  );
}
