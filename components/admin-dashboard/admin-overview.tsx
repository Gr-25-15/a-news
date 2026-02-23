"use client";

import { UserManagementTable } from "@/components/admin-dashboard/user-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { userListType } from "@/app/actions/manageUsers";
import { ArticleManagementTable } from "./article-management";
import { articleList } from "@/app/actions/getArticles";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { auth } from "@/lib/auth"; // Import auth

export default function AdminOverview({
  user,
  userList,
  articleList,
}: {
  user: typeof auth.$Infer.Session.user; // Use inferred type from better-auth
  userList: userListType;
  articleList: articleList;
}) {
  return (
    <div>
      <p>Hello {user.name}</p>
      <Tabs defaultValue="articles">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <ArticleManagementTable ArticleList={articleList} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagementTable userList={userList} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
