"user client";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id: id },
  });
}

export async function getUserSession() {
    const session = await auth.api.getSession({ headers: await headers() })
  return session;
}