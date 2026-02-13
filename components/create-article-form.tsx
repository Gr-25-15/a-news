"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ShadcnTemplate,
  type ShadcnTemplateRef,
} from "./ui/richTextEditor/shadcnTemplate";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession } from "@/lib/auth-client";
import { createArticle } from "@/app/actions/manage-article";
import z from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldContent, FieldError, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Option } from "@/app/actions/getCategories";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1),
  isPublished: z.boolean(),
  isSubscriberOnly: z.boolean(),
  thumbnailUrl: z.string().min(1),
});

export type createArticleFormData = z.infer<typeof schema>;

export default function CreateOrEditArticle(
  session: ReturnType<typeof useSession>,
  categories: Option[],
  articleId?: string,
) {
  const editorRef = useRef<ShadcnTemplateRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      isPublished: false,
      isSubscriberOnly: false,
      thumbnailUrl: "",
    },
  });
  const handleSave = () => {
    setIsLoading(true);
    const markdownContent = editorRef.current?.getMarkdown();
    console.log("Title:", title);
    console.log("Markdown Content:", markdownContent);
    // We will call the server action here
    try {
      if (!session.data) {
        throw new Error("Session not found");
      }
      createArticle(
        title,
        "categoryId(fix)",
        isPublished,
        isSubscriberOnly,
        "thumbnail-image-url",
        description,
        markdownContent,
      );
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Article</CardTitle>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <FieldContent>
                <Input {...form.register("title")} disabled={isLoading} />
                <FieldError errors={[form.formState.errors.title]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldContent>
                <Input {...form.register("description")} disabled={isLoading} />
                <FieldError errors={[form.formState.errors.description]} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field orientation="horizontal" className="w-fit">
              <FieldLabel htmlFor="isPublished">Publish on save:</FieldLabel>
              <Switch id="isPublished" />
            </Field>

            <Field orientation="horizontal" className="w-fit">
              <FieldLabel htmlFor="isSubscriberOnly">
                Subscriber only:
              </FieldLabel>
              <Switch id="isPublished" />
            </Field>

            <Button type="submit" disabled={isLoading}>
              Create Movie
            </Button>
          </form>
        </FormProvider>
        <ShadcnTemplate ref={editorRef} />
      </CardContent>
    </Card>
  );
}
