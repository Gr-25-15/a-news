import { mdxComponents } from "@prose-ui/next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom components that match your Shadcn UI theme
export const customMdxComponents = {
  ...mdxComponents,
  
  // Overriding standard HTML tags with styled versions
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
        className
      )}
      {...props}
    />
  ),
  
  // Custom "Callout" or "Alert" component for use in MDX
  Alert: ({ title, children, variant = "default" }: any) => {
    const Icon = {
      default: Info,
      warning: AlertTriangle,
      success: CheckCircle,
      destructive: XCircle,
    }[variant as "default" | "warning" | "success" | "destructive"] || Info;

    return (
      <Alert variant={variant} className="my-6">
        <Icon className="h-4 w-4" />
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    );
  },

  Callout: ({ title, children, variant = "default" }: any) => {
    const Icon = {
      info: Info,
      warning: AlertTriangle,
      success: CheckCircle,
      error: XCircle,
      default: Info,
    }[variant as "info" | "warning" | "success" | "error" | "default"] || Info;

    const variantStyles = {
      info: "border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/50 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
      warning: "border-yellow-200 bg-yellow-50/50 dark:border-yellow-900/50 dark:bg-yellow-950/50 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
      success: "border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/50 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
      error: "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/50 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
      default: "bg-muted/50",
    }[variant as "info" | "warning" | "success" | "error" | "default"] || "";

    return (
      <Alert className={cn("my-6", variantStyles)}>
        <Icon className="h-4 w-4" />
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{children}</AlertDescription>
      </Alert>
    );
  },

  Frame: ({ align = "center", children }: any) => (
    <figure className={cn(
      "my-8 flex flex-col items-center",
      align === "left" && "items-start",
      align === "right" && "items-end"
    )}>
      {children}
    </figure>
  ),

  Image: ({ src, alt }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="rounded-lg border shadow-md max-w-full" />
  ),

  Caption: ({ children }: any) => (
    <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
      {children}
    </figcaption>
  ),

  BlockMath: ({ children }: any) => (
    <div className="my-6 overflow-x-auto py-4 text-center text-xl font-serif italic bg-muted/30 rounded-lg">
      {children}
    </div>
  ),

  // Aliases for lowercase tags to prevent browser/parser errors
  alert: (props: any) => customMdxComponents.Alert(props),
  callout: (props: any) => customMdxComponents.Callout(props),
  frame: (props: any) => customMdxComponents.Frame(props),
  image: (props: any) => customMdxComponents.Image(props),
  caption: (props: any) => customMdxComponents.Caption(props),
  blockmath: (props: any) => customMdxComponents.BlockMath(props),

  // Add more custom components here (e.g., Tabs, Accordion, etc.)
};
