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
import { useForm, FormProvider, Controller } from "react-hook-form";
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
  content: z.string().min(1),
});

interface CreateOrEditArticleProps {
  categories?: Option[];
  articleId?: string;
}

export default function CreateOrEditArticle({
  categories,
  articleId,
}: CreateOrEditArticleProps) {
  const editorRef = useRef<ShadcnTemplateRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession(); // Get session internally

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      isPublished: false,
      isSubscriberOnly: false,
      thumbnailUrl: "test",
      content: "test",
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    console.log("handleSave called with data:", data);
    setIsLoading(true);
    console.log(data);
    const markdownContent = editorRef.current?.getMarkdown();
    form.setValue("content", markdownContent || "test");
    console.log("Title:", form.getValues("title"));
    console.log("Markdown Content:", markdownContent);
    // We will call the server action here
    try {
      if (!session.data) {
        throw new Error("Session not found");
      }
      createArticle(
        form.getValues("title"),
        form.getValues("categoryId"),
        form.getValues("isPublished"),
        form.getValues("isSubscriberOnly"),
        form.getValues("thumbnailUrl"),
        form.getValues("description"),
        markdownContent,
      );
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
      console.log(
        "handleSave finished. isLoading:",
        false,
        "isSubmitting:",
        form.formState.isSubmitting,
      );
    }
  }

  console.log(
    "Component re-rendered. isLoading:",
    isLoading,
    "isSubmitting:",
    form.formState.isSubmitting,
  );
  console.log(form.formState.errors);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Article</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-article" onSubmit={form.handleSubmit(onSubmit)}>
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

          {categories ? (
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-categories">
                    Category
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[form.formState.errors.categoryId]}>
                    Please select a category.
                  </FieldError>
                </Field>
              )}
            />
          ) : (
            ""
          )}

          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="isPublished">Publish on save:</FieldLabel>
            <Switch {...form.register("isPublished")} id="isPublished" />
          </Field>

          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="isSubscriberOnly">Subscriber only:</FieldLabel>
            <Switch
              {...form.register("isSubscriberOnly")}
              id="isSubscriberOnly"
            />
          </Field>

          <Field>
            <FieldLabel>Content</FieldLabel>
            <FieldContent>
              <ShadcnTemplate ref={editorRef} />
              <FieldError errors={[form.formState.errors.description]} />
            </FieldContent>
          </Field>
        </form>

        <Field>
          <Button type="submit" disabled={isLoading} form="form-rhf-article">
            Create Movie
          </Button>
        </Field>
      </CardContent>
    </Card>
  );
}
