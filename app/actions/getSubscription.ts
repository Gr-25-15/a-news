"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getActivePlan() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return "Free";

  const subscriptions = await auth.api.listActiveSubscriptions({
    headers: await headers(),
    query: {
      referenceId: session.user.id,
      customerType: "user",
    },
  });

  const activeSubscription = subscriptions.find(
    (sub) => sub.status === "active" || sub.status === "trialing",
  );

  return activeSubscription ? activeSubscription.plan : "Free";
}
