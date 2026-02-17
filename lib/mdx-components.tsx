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

  // Add more custom components here (e.g., Tabs, Accordion, etc.)
};
