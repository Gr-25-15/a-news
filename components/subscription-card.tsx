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

  if (!session.data) {
    return null;
  }

  const isPremium = subscription
    ? subscription.plan.toLowerCase() === "premium"
    : false;

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
          <p>Expires at: {subscription?.periodEnd?.toLocaleDateString()}</p>
        )}
        {!isPremium && (
          <div className="mt-4">
            <p>If you want to upgrade your plan, you can do it below.</p>
            <Button
              className="mt-2"
              onClick={handleUpgrade}
              disabled={loading || isPremium}
            >
              {loading && <Spinner className="mr-2" />}
              Upgrade Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
