"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getAllUsers() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return { users: [], total: 0, error: "Unauthorized" };
  }

  try {
    const users = await auth.api.listUsers({
      headers: await headers(),
      query: {
        limit: 100,
      },
    });

    return { ...users, error: null };
  } catch (error) {
    console.error("Error listing users:", error);
    return { users: [], total: 0, error: "Failed to fetch users" };
  }
}
