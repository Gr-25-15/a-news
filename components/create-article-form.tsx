"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ShadcnTemplate,
  type ShadcnTemplateRef,
} from "./ui/richTextEditor/shadcnTemplate";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createArticle } from "@/app/actions/createArticle";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const editorRef = useRef<ShadcnTemplateRef>(null);

  const handleSave = () => {
    const markdownContent = editorRef.current?.getMarkdown();
    console.log("Title:", title);
    console.log("Markdown Content:", markdownContent);
    // We will call the server action here
    createArticle(
      title,
      "seed-user-id",
      "seed-user-id",
      "sweden",
      "news",
      markdownContent,
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Article</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 mb-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <ShadcnTemplate ref={editorRef} />
        <Button onClick={handleSave} className="mt-4">
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
