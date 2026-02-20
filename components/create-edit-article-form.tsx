"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  ShadcnTemplate,
  type ShadcnTemplateRef,
} from "./ui/richTextEditor/shadcnTemplate";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession } from "@/lib/auth-client";
import { createArticle, editArticle } from "@/app/actions/manage-article";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "./ui/field";
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
import { SingleFile, SingleFileRef } from "./ui/single-file-upload";
import { getArticleById } from "@/app/actions/getArticles";
import { useRouter } from "next/navigation";
import AiComponent from "./ai-component";

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
  isEditing: boolean;
  onSubmissionSuccess?: () => void;
}

export default function CreateOrEditArticle({
  categories,
  articleId,
  isEditing,
  onSubmissionSuccess,
}: CreateOrEditArticleProps) {
  const editorRef = useRef<ShadcnTemplateRef>(null);
  const fileUploadRef = useRef<SingleFileRef>(null);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession(); // Get session internally
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      isPublished: false,
      isSubscriberOnly: false,
      thumbnailUrl: "", // Initialize thumbnailUrl here
    },
  });

  useEffect(() => {
    async function fetchArticleData() {
      if (!articleId) return;

      setIsLoading(true);
      try {
        const article = await getArticleById(articleId);
        if (article) {
          form.reset({
            title: article.title,
            description: article.description ?? "",
            categoryId: article.categoryId,
            isPublished: article.isPublished,
            isSubscriberOnly: article.isSubscriberOnly,
            thumbnailUrl: article.thumbnailUrl ?? "",
            content: article.content,
          });
          editorRef.current?.injectMarkdown(article.content);
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchArticleData();
  }, [articleId, form]);

  async function onSubmit(data: z.infer<typeof schema>) {
    console.log("handleSave called with data:", data);
    setIsLoading(true);
    console.log(data);
    const markdownContent = editorRef.current?.getMarkdown();
    const thumbnailUrl = fileUploadRef.current?.uploadedImageUrl;

    form.setValue("content", markdownContent || "");
    form.setValue("thumbnailUrl", thumbnailUrl || ""); //TODO: fix the singlefile component to retrive it's value
    console.log("Title:", form.getValues("title"));
    console.log("Markdown Content:", markdownContent);
    // We will call the server action here
    try {
      if (!session.data) {
        throw new Error("Session not found");
      }
      if (isEditing && articleId) {
        await editArticle(
          form.getValues("title"),
          form.getValues("categoryId"),
          form.getValues("isPublished"),
          form.getValues("isSubscriberOnly"),
          articleId,
          form.getValues("thumbnailUrl"),
          form.getValues("description"),
          form.getValues("content"),
        );
      } else {
        await createArticle(
          form.getValues("title"),
          form.getValues("categoryId"),
          form.getValues("isPublished"),
          form.getValues("isSubscriberOnly"),
          form.getValues("thumbnailUrl"),
          form.getValues("description"),
          form.getValues("content"),
        );
      }
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
      onSubmissionSuccess?.(); // Notify parent of submission success
      if (isEditing) {
        router.push(`/articles/${articleId}`);
      } else {
        router.push("/");
      }
    }
  }

  console.log(
    "Component re-rendered. isLoading:",
    isLoading,
    "isSubmitting:",
    form.formState.isSubmitting,
    form.getValues("thumbnailUrl"),
  );
  console.log(form.formState.errors);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Article</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="form-rhf-article"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <Field className="mb-4">
            <FieldLabel>Title</FieldLabel>
            <FieldContent>
              <Input {...form.register("title")} disabled={isLoading} />
              <FieldError errors={[form.formState.errors.title]} />
            </FieldContent>
          </Field>
          <Field className="mb-4">
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
                <Field data-invalid={fieldState.invalid} className="mb-4">
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
          <Controller
            name="isPublished"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className="mb-4"
              >
                <FieldContent>
                  <FieldLabel htmlFor="form-rhf-switch-ispublished">
                    Publish Article
                  </FieldLabel>
                  <FieldDescription>
                    Do you want to publish article? (uncheck if you want to save
                    as draft)
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Switch
                  id="form-rhf-switch-published"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
          <Controller
            name="isSubscriberOnly"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className="mb-4"
              >
                <FieldContent>
                  <FieldLabel htmlFor="form-rhf-switch-issubscriberonly">
                    Article only for subscribers
                  </FieldLabel>
                  <FieldDescription>
                    Do you want to make this post for paying subscribers only?
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Switch
                  id="form-rhf-switch-subscriber"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
          <Field className="mb-4">
            <FieldLabel>Thumbnail</FieldLabel>
            <FieldContent>
              <SingleFile
                initialImageUrl={form.getValues("thumbnailUrl")}
                ref={fileUploadRef}
              />
              <FieldError errors={[form.formState.errors.thumbnailUrl]} />
            </FieldContent>
          </Field>

          <AiComponent
            content={editorRef.current?.getMarkdown}
            title={form.watch("title")}
            onContentGenerated={(newContent) => {
              form.setValue("content", newContent);
              editorRef.current?.injectMarkdown(newContent);
            }}
          />
          {/*Button to generate content with Ai*/}

          <Field className="mb-4">
            <FieldContent>
              <ShadcnTemplate ref={editorRef} />
              <FieldError errors={[form.formState.errors.content]} />
            </FieldContent>
          </Field>
        </form>

        <Field>
          <Button
            className="rounded"
            type="submit"
            disabled={isLoading}
            form="form-rhf-article"
          >
            Save article
          </Button>
        </Field>
      </CardContent>
    </Card>
  );
}
