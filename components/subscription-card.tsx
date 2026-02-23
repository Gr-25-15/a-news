"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getActivePlan } from "@/app/actions/getSubscription";
import { Button } from "./ui/button";

export default function SubscriptionCard() {
  const session = useSession();
  const [plan, setPlan] = useState<string>("Loading...");

  useEffect(() => {
    if (session.data) {
      getActivePlan().then((plan) => setPlan(plan));
    }
  }, [session.data]);

  if (!session.data) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {session.data.user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Your current subscription plan is: <strong>{plan}</strong>
        </p>
        <div className="mt-4">
          <p>If you want to upgrade your plan, you can do it below.</p>
          <Button className="mt-2">Upgrade Plan</Button>
        </div>
      </CardContent>
    </Card>
  );
}
