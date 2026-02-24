import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockKeyholeIcon, StarIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function NewsCard({
  id,
  title,
  description,
  isLocked,
  articleThumbnail,
  isSubscriberOnly,
}: {
  id: string;
  title: string;
  description: string;
  isLocked: boolean;
  articleThumbnail: string | null;
  isSubscriberOnly: boolean;
}) {
  return (
    <Card className="w-full flex flex-col justify-between overflow-hidden border border-muted shadow-sm pb-0">
      <CardHeader className="flex flex-row justify-between items-start pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold uppercase">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground leading-tight">
            {description === ""
              ? "This article doesn't have a description."
              : description}
          </CardDescription>
        </div>
        {/* Star Icon from Page 1 of PDF */}
        {isSubscriberOnly && (
          <div className="bg-orange-50 p-2 rounded-full">
            <StarIcon className="h-5 w-5 fill-orange-500 text-orange-500" />
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 relative h-full bg-accent aspect-video">
        {isLocked ? (
          // The "Locked" state logic [cite: 5]
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <LockKeyholeIcon className="mb-2 h-8 w-8 text-muted-foreground" />
            <h3 className="text-2xl font-bold">Subscribe to read</h3>
            <Button
              asChild
              className="mt-4 bg-accent/60 hover:bg-accent text-white px-8 rounded-md"
            >
              <Link href={"/"}>Upgrade to Pro</Link>
            </Button>
          </div>
        ) : (
          <div className="relative h-full w-full">
            {articleThumbnail && (
              <Image
                src={articleThumbnail}
                alt={title}
                fill
                className="object-cover"
              />
            )}

            <Link
              href={`/articles/${id}`}
              className="absolute bottom-4 right-4 flex items-center gap-1 text-sm font-semibold text-white bg-black/50 p-2 rounded-md"
            >
              Go to article
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
