"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { generateArticle } from "@/lib/ai";

export default function AiComponent() {
  const [prompt, setPrompt] = useState("");
  const [article, setArticle] = useState("There is no article");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading ? "Loading.." : article}
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
