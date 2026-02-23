"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "trialing"
  | "unpaid";

export interface ActiveSubscription {
  id: string;
  plan: string;
  referenceId: string;
  status: SubscriptionStatus;
  limits?: Record<string, unknown>;
  priceId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialStart?: Date;
  trialEnd?: Date;
  periodStart?: Date;
  periodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  cancelAt?: Date;
  canceledAt?: Date;
  endedAt?: Date;
  groupId?: string;
  seats?: number;
}

export type ActivePlanResponse = ActiveSubscription | "Free" | undefined;

export async function getActiveSubscription(): Promise<
  ActiveSubscription | undefined
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return undefined;

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

  if (activeSubscription) {
    console.log("Active Subscription Found:", {
      activeSubscription,
    });
  }

  return activeSubscription;
}
