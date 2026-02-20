"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { TrendingUp, CloudSun } from "lucide-react";

interface SidebarSheetsProps {
  marketContent: React.ReactNode;
  weatherContent: React.ReactNode;
}

export function SidebarSheets({
  marketContent,
  weatherContent,
}: SidebarSheetsProps) {
  return (
    <>
      {/* Market Trigger - Left side */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-8 rounded-l-none border-l-0 shadow-md bg-background/80 backdrop-blur-sm hover:w-10 transition-all group"
            >
              <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="sr-only">Open Market</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full sm:max-w-[320px] p-0 overflow-y-auto"
          >
            <div className="p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Market Watch
                </SheetTitle>
              </SheetHeader>
              {marketContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Weather Trigger - Right side */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-8 rounded-r-none border-r-0 shadow-md bg-background/80 backdrop-blur-sm hover:w-10 transition-all group"
            >
              <CloudSun className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="sr-only">Open Weather</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-87.5 p-0 overflow-y-auto"
          >
            <div className="p-6">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Weather Forecast
                </SheetTitle>
              </SheetHeader>
              {weatherContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
