import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ShadcnTemplate,
  type ShadcnTemplateRef,
} from "./ui/richTextEditor/shadcnTemplate";
import { useRef, useState } from "react";
import { Button } from "./ui/button";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<boolean>(false);
  const editorRef = useRef<ShadcnTemplateRef>(null);

  const handleGetContent = () => {
    console.log(editorRef.current?.getMarkdown());
    if (editorRef.current) {
      const markdown = editorRef.current.getMarkdown();
      setContent(markdown);
      console.log("Markdown content:", content);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Article</CardTitle>
      </CardHeader>
      <CardContent>
        <ShadcnTemplate ref={editorRef} />
        <Button onClick={handleGetContent} className="mt-4">
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
