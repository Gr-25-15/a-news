"use client";

import * as React from "react";
import { Example, ExampleWrapper } from "@/components/example";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusIcon,
  BluetoothIcon,
  DotsThreeVerticalIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  CodeIcon,
  DotsThreeOutlineIcon,
  MagnifyingGlassIcon,
  FloppyDiskIcon,
  DownloadIcon,
  EyeIcon,
  LayoutIcon,
  PaletteIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  UserIcon,
  CreditCardIcon,
  GearIcon,
  KeyboardIcon,
  TranslateIcon,
  BellIcon,
  EnvelopeIcon,
  ShieldIcon,
  QuestionIcon,
  FileTextIcon,
  SignOutIcon,
} from "@phosphor-icons/react";

export function ComponentExample() {
  return (
    // STEP 1: Wrapped in background color to stop the 'black' feel
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-foreground">
            Design System Preview
          </h1>
          <p className="text-muted-foreground">
            Unified palette: Coral, Stone, and Navy.
          </p>
        </header>

        <ExampleWrapper className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <CardExample />
          <FormExample />
        </ExampleWrapper>
      </div>
    </div>
  );
}

function CardExample() {
  return (
    <Example title="Article Preview" className="items-center justify-center">
      <Card className="relative w-full max-w-sm overflow-hidden border-border bg-card shadow-sm">
        {/* STEP 2: Removed filters and overlays that caused the 'wrong color' look */}
        <img
          src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop"
          alt="Theme Preview"
          className="aspect-video w-full object-cover"
        />
        <CardHeader>
          <CardTitle className="text-foreground">
            Modern News Architecture
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Switching to an improved data exploration method. Our new system
            uses primary variables for consistent branding across all
            components.
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default">
                <PlusIcon className="mr-2" />
                Actions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <BluetoothIcon size={32} className="text-primary" />
                </AlertDialogMedia>
                <AlertDialogTitle>Apply Theme Settings?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will finalize the new color schema across your local
                  environment.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-primary text-primary-foreground">
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Badge
            variant="secondary"
            className="ml-auto bg-accent text-accent-foreground border-none"
          >
            Live Preview
          </Badge>
        </CardFooter>
      </Card>
    </Example>
  );
}

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const;

function FormExample() {
  const [theme, setTheme] = React.useState("light");

  return (
    <Example title="System Controls">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="text-foreground">Settings</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your interface preferences
              </CardDescription>
            </div>
            <CardAction>
              {/* Dropdown Menu cleanup */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <DotsThreeVerticalIcon size={24} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-card border-border"
                >
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      <SunIcon className="mr-2" /> Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <MoonIcon className="mr-2" /> Dark
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-foreground">
                    Display Name
                  </FieldLabel>
                  <Input
                    placeholder="John Doe"
                    className="border-border bg-background"
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-foreground">Role</FieldLabel>
                  <Select>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Developer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Developer</SelectItem>
                      <SelectItem value="design">Designer</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel className="text-foreground">
                  Project Category
                </FieldLabel>
                <Combobox items={frameworks}>
                  <ComboboxInput
                    placeholder="Select framework..."
                    className="bg-background border-border"
                  />
                </Combobox>
              </Field>
              <div className="flex gap-3 pt-4">
                <Button className="bg-primary text-primary-foreground flex-1">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="border-border text-foreground flex-1"
                >
                  Reset
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </Example>
  );
}
