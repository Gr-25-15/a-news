"use client";

/**
 * HEY ISAAC! 
 * Here is the news component. It handles BOTH the locked and unlocked 
 * states from the PDF in this one file. 
 * - Built by Alex.
 */



import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LockKeyholeIcon, StarIcon, ArrowRightIcon } from "lucide-react";

// Component is named IsaacCard 
export function IsaacCard({
  title,
  description,
  isLocked,
}: {
  title: string;
  description: string;
  isLocked: boolean;
}) {
  return (
    <Card className="w-full max-w-sm overflow-hidden border border-gray-200 shadow-sm bg-white">
      <CardHeader className="flex flex-row justify-between items-start pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold uppercase">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-500 leading-tight">
            {description}
          </CardDescription>
        </div>
        {/* Star Icon from Page 1 of PDF */}
        <div className="bg-orange-50 p-2 rounded-full">
          <StarIcon className="h-5 w-5 fill-orange-500 text-orange-500" />
        </div>
      </CardHeader>

      <CardContent className="p-0 relative h-60 bg-gray-100">
        {isLocked ? (
          // The "Locked" state logic [cite: 5]
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <LockKeyholeIcon className="mb-2 h-8 w-8 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900">
              Subscribe to read
            </h3>
            <Button className="mt-4 bg-[#FF5733] hover:bg-[#E64A19] text-white px-8 rounded-md">
              Upgrade to Pro
            </Button>
          </div>
        ) : (
          // The "Public" state logic [cite: 6]
          <div className="absolute bottom-4 right-4 flex items-center gap-1 text-sm font-semibold text-gray-900 cursor-pointer">
            Go to article <ArrowRightIcon size={16} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
