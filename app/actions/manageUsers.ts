"use server";

import { auth } from "@/lib/auth";
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

export async function getAllUsers() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  const users = await prisma.user.findMany();
  return users;
}

export type userListType = Awaited<ReturnType<typeof getAllUsers>>;

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
