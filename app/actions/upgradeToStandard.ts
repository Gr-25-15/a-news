// app/actions/upgradeToStandard.ts
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // your Better Auth instance

interface UpgradeResult {
  url?: string;
  error?: Error;
}

/**
 * Server Action to upgrade the current user to the "standard" plan.
 * Returns a Checkout URL if disableRedirect is true.
 */
export async function upgradeToStandard(): Promise<UpgradeResult> {
  // These URLs should be pages in your app
  const successUrl = "/";
  const cancelUrl = "/";

  try {
    const data = await auth.api.upgradeSubscription({
      headers: await headers(),
      body: {
        plan: "standard", // the plan name / unique id
        successUrl,
        cancelUrl,
        disableRedirect: true, // true so you can redirect manually from client
      },
    });

    return {
      url: data.url!,
    };
  } catch (err: unknown) {
    console.error("Failed to upgrade subscription:", err);
    return {
      error: {
        message: err instanceof Error ? err.message : "Upgrade failed",
        name: "402",
      },
    };
  }
}
