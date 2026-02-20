"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { CategoryLink } from "@/app/actions/getCategories";
import { useSession } from "@/lib/auth-client";
import { set } from "zod/v3";

/* const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]; */

export default function Navigation({
  categories,
}: {
  categories: CategoryLink[];
}) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const session = useSession();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // TODO: Limit category count if we add more than 5

  return (
    <header className="flex bg-popover items-center justify-between">
      <div className="w-full max-w-md m-auto py-12 px-8">
        <h1 className="font-sans text-7xl text-center mb-3 font-semibold">
          A-News
        </h1>
        {mounted ? (
          <>
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-4">
                {categories.map((cat) => (
                  <NavigationMenuItem key={cat.title}>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href={cat.href}>{cat.title}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                {session.data ? (
                  <NavigationMenuItem className="ml-4 flex items-center gap-4">
                    <p className="text-xs whitespace-nowrap">
                      Hey, {session.data.user.name}
                    </p>
                    <NavigationMenuLink asChild>
                      <Button variant={"ghost"} size="sm" asChild>
                        <Link href={"/auth/sign-out"}>Sign Out</Link>
                      </Button>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ) : (
                  <>
                    <NavigationMenuItem className="ml-4">
                      <NavigationMenuLink asChild>
                        <Button variant={"ghost"} size="sm" asChild>
                          <Link href={"/auth/sign-in"}>Sign In</Link>
                        </Button>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Button size="sm" asChild>
                          <Link href={"/auth/sign-up"}>Sign Up</Link>
                        </Button>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden w-fit">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>A-News</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 p-6">
                  {categories.map((cat) => (
                    <Link
                      key={cat.title}
                      href={cat.href}
                      onClick={() => setOpen(false)}
                    >
                      {cat.title}
                    </Link>
                  ))}
                  <div className="border-t pt-4 flex flex-col gap-4">
                    {session.data ? (
                      <>
                        <p className="text-sm font-medium">
                          Hey, {session.data.user.name}
                        </p>
                        <Button
                          variant={"ghost"}
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link href={"/auth/sign-out"}>Sign Out</Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant={"ghost"}
                          asChild
                          onClick={() => setOpen(false)}
                        >
                          <Link href={"/auth/sign-in"}>Sign In</Link>
                        </Button>
                        <Button asChild onClick={() => setOpen(false)}>
                          <Link href={"/auth/sign-up"}>Sign Up</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <div className="h-10" /> // Placeholder to prevent layout shift
        )}
      </div>
    </header>
  );
}
