"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import type { articleList } from "@/app/actions/getArticles";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon } from "lucide-react"; // Added import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  deleteArticle,
  updateArticleStatus,
} from "@/app/actions/manage-article";
import { toast } from "sonner";

async function handleDeleteArticle(articleId: string) {
  const result = await deleteArticle(articleId);
  if (result.success) {
    toast("Deletion successful");
  } else {
    toast("evil.txt");
  }
}

export function ArticleManagementTable({
  ArticleList,
}: {
  ArticleList: articleList;
}) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Editor</TableHead>
          <TableHead>Ispublished</TableHead>
          <TableHead>IsSubscriberOnly</TableHead>
          <TableHead>Actions</TableHead> {/* Edit, delete*/}
        </TableRow>
      </TableHeader>
      <TableBody>
        {ArticleList?.map((article) => (
          <TableRow key={article.id}>
            <TableCell>{article.title}</TableCell>
            <TableCell>{article.Author.name}</TableCell>
            <TableCell>{article.Editor?.name ?? "No editor"}</TableCell>
            <TableCell>
              <Switch
                name={"IsPublished"}
                checked={article.isPublished}
                onCheckedChange={async (checked) => {
                  await updateArticleStatus(article.id, checked, "isPublished");
                  router.refresh();
                }}
              />
            </TableCell>
            <TableCell>
              <Switch
                name={"IsSubscriberOnly"}
                checked={article.isSubscriberOnly}
                onCheckedChange={async (checked) => {
                  await updateArticleStatus(
                    article.id,
                    checked,
                    "isSubscriberOnly",
                  );
                  router.refresh();
                }}
              />
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontalIcon />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => router.push(`/articles/${article.id}`)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={async () => await handleDeleteArticle(article.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
