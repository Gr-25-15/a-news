"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import {
  ActiveSubscription,
  getActiveSubscription,
} from "@/app/actions/getSubscription";
import { Button } from "./ui/button";
import { upgradeSubscription } from "@/app/actions/upgradeSubscription";
import { cancelSubscription } from "@/app/actions/cancelSubscription";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export default function SubscriptionCard() {
  const session = useSession();
  const [subscription, setSubscription] = useState<
    ActiveSubscription | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session.data) {
      getActiveSubscription().then((sub) => setSubscription(sub));
    }
  }, [session.data]);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const result = await upgradeSubscription();
      if (result.url) {
        window.location.href = result.url;
      } else if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPlan = async () => {
    setLoading(true);
    if (!subscription || !subscription.stripeSubscriptionId) {
      toast.error("No active Stripe subscription found.");
      setLoading(false);
      return;
    }
    const result = await cancelSubscription(subscription.stripeSubscriptionId);
    if (result.error) {
      toast.error(result.error);
    } else if (result.data?.url) {
      window.location.href = result.data.url;
    } else {
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  if (!session.data) {
    return null;
  }

  const isPremium = subscription
    ? subscription.plan.toLowerCase() === "premium"
    : false;

  const isCanceled = !!(
    subscription?.cancelAtPeriodEnd || subscription?.cancelAt
  );
  const expiryDate = subscription?.cancelAt || subscription?.periodEnd;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {session.data.user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Your current subscription plan is:{" "}
          <strong>{subscription?.plan ?? "Free"}</strong>
        </p>
        {isPremium && (
          <p className="text-sm text-muted-foreground">
            <strong>{isCanceled ? "Access ends on:" : "Renews on:"}</strong>{" "}
            {expiryDate ? new Date(expiryDate).toLocaleDateString() : "N/A"}
          </p>
        )}

        {isCanceled && (
          <div className="mt-4 p-3 bg-muted/50 border border-border rounded-md text-sm">
            <p className="font-medium text-primary">
              Scheduled for Cancellation
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You will still have access to Premium features until the end of
              your billing cycle.
            </p>
          </div>
        )}

        {!isPremium ? (
          <div className="mt-4">
            <p>If you want to upgrade your plan, you can do it below.</p>
            <Button className="mt-2" onClick={handleUpgrade} disabled={loading}>
              {loading && <Spinner className="mr-2" />}
              Upgrade Plan
            </Button>
          </div>
        ) : (
          !isCanceled && (
            <Button
              variant={"ghost"}
              className="mt-2 text-destructive hover:text-destructive"
              onClick={handleCancelPlan}
              disabled={loading}
            >
              {loading && <Spinner className="mr-2" />}
              Cancel Plan
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
}
