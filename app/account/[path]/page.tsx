import SubscriptionCard from "@/components/subscription-card";
import { AccountView } from "@daveyplate/better-auth-ui";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="container p-4 md:p-6 flex flex-col gap-4">
      <SubscriptionCard />
      <AccountView
        path={path}
        classNames={{
          base: "gap-2 md:gap-6",
          sidebar: { base: "w-36 lg:w-36" },
        }}
      />
    </main>
  );
}
