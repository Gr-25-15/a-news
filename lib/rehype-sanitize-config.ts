import { defaultSchema } from "rehype-sanitize";

/**
 * Custom sanitization schema to allow Prose UI components and other custom elements.
 * This extends the default GitHub-style sanitization schema.
 */
export const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "alert",
    "callout",
    "frame",
    "image",
    "caption",
    "blockmath",
    "Alert",
    "Callout",
    "Frame",
    "Image",
    "Caption",
    "BlockMath",
  ],
  attributes: {
    ...defaultSchema.attributes,
    alert: ["title", "variant"],
    Alert: ["title", "variant"],
    callout: ["title", "variant"],
    Callout: ["title", "variant"],
    frame: ["align"],
    Frame: ["align"],
    image: ["src", "alt"],
    Image: ["src", "alt"],
    caption: [],
    Caption: [],
    blockmath: [],
    BlockMath: [],
  },
};
