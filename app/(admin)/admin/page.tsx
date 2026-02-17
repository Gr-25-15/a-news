"use server";

import { getAllUsers, getUserById } from "@/app/actions/manageUsers";
import {
  SignInButton,
  SignUpButton,
} from "@/components/admin-dashboard/admin-account-button";
import { UserManagementTable } from "@/components/admin-dashboard/user-management";
import { auth } from "@/lib/auth";

import { ShieldUser } from "lucide-react";
import { headers } from "next/headers";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const user = session.user;
  if (!user) return <p>User not found.</p>;

  const userList = await getAllUsers();

  if (userList.error) {
    return <p>{userList.error}</p>;
  }

  return (
    <>
      <SignUpButton />
      <SignInButton />

      <ShieldUser />
      <p>Hello {user.name}</p>
      <UserManagementTable userList={userList.users} />
    </>
  );
}
