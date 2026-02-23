"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function cancelSubscription(
  subscriptionId: string | undefined,
): Promise<{
  error: string | null;
  data: { url: string; redirect: boolean } | null;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "No session found", data: null };

  try {
    const data = await auth.api.cancelSubscription({
      headers: await headers(),
      body: {
        referenceId: session.user.id,
        returnUrl: "/account/settings",
        subscriptionId,
      },
    });

    return { error: null, data };
  } catch (error) {
    console.error("Cancel subscription failed:", error);
    return { error: "Failed to cancel subscription", data: null };
  }
}
