"use server";

import { getUserById } from "@/app/actions/getSession";
import { getAllUsers } from "@/app/actions/manageUsers";
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

  if (!session?.user?.id) return <p>You must be logged in.</p>;

  const userList = await getAllUsers();

  if (userList.error) {
    return <p>{userList.error}</p>;
  }

  const userId = session.user.id;
  const user = await getUserById(userId);
  if (!user) return <p>User not found.</p>;

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
