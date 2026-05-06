import { z } from "zod";

import type { CreateArtInput, UpdateArtInput } from "@/types/art";

function normalizeOptionalText(value: unknown): unknown {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

function normalizeBoolean(value: unknown): unknown {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim().toLowerCase();

  if (["true", "1", "on", "yes"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "off", "no"].includes(normalized)) {
    return false;
  }

  return value;
}

const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters long.")
  .max(100, "Slug must be 100 characters or fewer.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and single hyphens.",
  );

const titleSchema = z
  .string()
  .trim()
  .min(2, "Title must be at least 2 characters long.")
  .max(120, "Title must be 120 characters or fewer.");

const descriptionSchema = z.preprocess(
  normalizeOptionalText,
  z
    .string()
    .max(2000, "Description must be 2000 characters or fewer.")
    .nullable()
    .optional(),
);

const isPublicSchema = z.preprocess(normalizeBoolean, z.boolean());

const optionalUrlSchema = z.preprocess(
  normalizeOptionalText,
  z
    .string()
    .url("Must be a valid URL.")
    .max(2048, "URL must be 2048 characters or fewer.")
    .nullable()
    .optional(),
);

const instagramUrlSchema = z.preprocess(
  normalizeOptionalText,
  z
    .string()
    .url("Instagram URL must be a valid URL.")
    .regex(
      /^https:\/\/(www\.)?instagram\.com\//,
      "URL must be an Instagram link.",
    )
    .nullable()
    .optional(),
);

export const createArtSchema: z.ZodType<CreateArtInput> = z.object({
  slug: slugSchema,
  title: titleSchema,
  description: descriptionSchema,
  is_public: isPublicSchema.optional().default(false),
  instagram_url: instagramUrlSchema,
  etsy_url: optionalUrlSchema,
});

export const updateArtSchema: z.ZodType<UpdateArtInput> = z
  .object({
    slug: slugSchema.optional(),
    title: titleSchema.optional(),
    description: descriptionSchema,
    is_public: isPublicSchema.optional(),
    instagram_url: instagramUrlSchema,
    etsy_url: optionalUrlSchema,
  })
  .refine(
    (value) =>
      Object.values(value).some((fieldValue) => fieldValue !== undefined),
    {
      message: "At least one field must be provided for update.",
    },
  );

export function validateCreateArtInput(input: unknown): CreateArtInput {
  return createArtSchema.parse(input);
}

export function validateUpdateArtInput(input: unknown): UpdateArtInput {
  return updateArtSchema.parse(input);
}

export function safeValidateCreateArtInput(input: unknown) {
  return createArtSchema.safeParse(input);
}

export function safeValidateUpdateArtInput(input: unknown) {
  return updateArtSchema.safeParse(input);
}
