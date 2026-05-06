import { z } from "zod";

import type { CreateArtistInput, UpdateArtistInput } from "@/types/artist";

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

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long.")
  .max(120, "Name must be 120 characters or fewer.");

const bioSchema = z.preprocess(
  normalizeOptionalText,
  z
    .string()
    .max(4000, "Bio must be 4000 characters or fewer.")
    .nullable()
    .optional(),
);

const locationSchema = z.preprocess(
  normalizeOptionalText,
  z
    .string()
    .max(120, "Location must be 120 characters or fewer.")
    .nullable()
    .optional(),
);

const optionalUrlSchema = z.preprocess(
  normalizeOptionalText,
  z
    .url("Must be a valid URL.")
    .max(2048, "URL must be 2048 characters or fewer.")
    .nullable()
    .optional(),
);

const isPublicSchema = z.preprocess(normalizeBoolean, z.boolean());

export const createArtistSchema: z.ZodType<CreateArtistInput> = z.object({
  slug: slugSchema,
  name: nameSchema,
  bio: bioSchema,
  etsy_link: optionalUrlSchema,
  instagram_link: optionalUrlSchema,
  redbubble_link: optionalUrlSchema,
  website: optionalUrlSchema,
  location: locationSchema,
  is_public: isPublicSchema.optional().default(false),
});

export const updateArtistSchema: z.ZodType<UpdateArtistInput> = z
  .object({
    slug: slugSchema.optional(),
    name: nameSchema.optional(),
    bio: bioSchema,
    etsy_link: optionalUrlSchema,
    instagram_link: optionalUrlSchema,
    redbubble_link: optionalUrlSchema,
    website: optionalUrlSchema,
    location: locationSchema,
    is_public: isPublicSchema.optional(),
  })
  .refine(
    (value) =>
      Object.values(value).some((fieldValue) => fieldValue !== undefined),
    {
      message: "At least one field must be provided for update.",
    },
  );

export function validateCreateArtistInput(input: unknown): CreateArtistInput {
  return createArtistSchema.parse(input);
}

export function validateUpdateArtistInput(input: unknown): UpdateArtistInput {
  return updateArtistSchema.parse(input);
}

export function safeValidateCreateArtistInput(input: unknown) {
  return createArtistSchema.safeParse(input);
}

export function safeValidateUpdateArtistInput(input: unknown) {
  return updateArtistSchema.safeParse(input);
}
