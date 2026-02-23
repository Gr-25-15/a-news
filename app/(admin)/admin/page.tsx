"use server";

import { getAllArticles } from "@/app/actions/getArticles";
import { getAllUsers } from "@/app/actions/manageUsers";
import AdminOverview from "@/components/admin-dashboard/admin-overview";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const user = session.user;
  if (!user) return <p>User not found.</p>;

  const userList = await getAllUsers();
  const articleList = await getAllArticles();

  return (
    <div>
      <p>Hello {user.name}</p>
      <AdminOverview
        user={user}
        userList={userList}
        articleList={articleList}
      />
    </div>
  );
}
