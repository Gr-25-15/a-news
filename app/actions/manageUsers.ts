"use server";

import { auth } from "@/lib/auth";
import { UserWithRoles } from "@/types/usertype";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function getUserById(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  return await prisma.user.findUnique({
    where: { id: id },
  });
}

export async function getAllUsers(): Promise<{
  users: UserWithRoles[];
  total: number;
  error: string | null;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return { users: [], total: 0, error: "Unauthorized" };
  }

  try {
    const result = await auth.api.listUsers({
      headers: await headers(),
      query: {
        limit: 100,
      },
    });

    const users: UserWithRoles[] = result.users.map((user) => ({
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      role: (user.role as "admin" | "editor" | "user") ?? "user",
      createdAt: user.createdAt.toISOString(),
    }));

    return {
      users,
      total: result.total,
      error: null,
    };
  } catch (error) {
    console.error("Error listing users:", error);
    return { users: [], total: 0, error: "Failed to fetch users" };
  }
}

export async function setUserRole(
  userId: string,
  role: "admin" | "editor" | "user",
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    await auth.api.setRole({
      body: {
        userId,
        role,
      },
      headers: await headers(),
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "Failed to update user role" };
  }
}
