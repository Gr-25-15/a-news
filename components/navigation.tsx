"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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
import { CategoryLink, getCategoryLinks } from "@/app/actions/getCategories";

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

  // TODO: Limit category count if we add more than 5

  return (
    <header className="flex items-center justify-between">
      <div className="w-full max-w-md m-auto py-12 px-8">
        <h1 className="font-sans text-7xl text-center mb-3 font-semibold">
          A-News
        </h1>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-4">
            {categories.map((cat) => (
              <NavigationMenuItem key={cat.title}>
                <NavigationMenuTrigger>{cat.title}</NavigationMenuTrigger>
                {/* 
                <NavigationMenuContent>
                  <ul className="w-96">
                    <ListItem href="/docs" title="Introduction">
                      Each subcategory will go here
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
                */}
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem className="ml-15">
              <Button variant={"ghost"}>
                <Link href={"/auth/sign-in"}>Sign In</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button>
                <Link href={"/auth/sign-up"}>Sign Up</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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
              <Button variant={"ghost"}>
                <Link href={"/auth/sign-in"}>Sign In</Link>
              </Button>
              <Button>
                <Link href={"/auth/sign-up"}>Sign Up</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="text-muted-foreground line-clamp-2">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
