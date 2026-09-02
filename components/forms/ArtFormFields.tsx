"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  mode: "create" | "edit";
  submitAction: (...args: any[]) => Promise<{ error: string | null }>;
  pageTitle: string;
  pageDescription: string;
  submitLabel: string;
  successMessage: string | null;
  defaultTitle: string;
  defaultDescription: string;
  defaultIsPublic: boolean;
  defaultInstagramUrl: string;
  defaultEtsyUrl: string;
  defaultRedbubbleUrl: string;
  currentImageUrl: string | null;
  currentImagePath: string | null;
};

export default function ArtFormFields(props: Props) {
  const {
    mode,
    submitAction,
    pageTitle,
    pageDescription,
    submitLabel,
    successMessage,
    defaultTitle,
    defaultDescription,
    defaultIsPublic,
    defaultInstagramUrl,
    defaultEtsyUrl,
    defaultRedbubbleUrl,
    currentImageUrl,
    currentImagePath,
  } = props;

  const [state, action, isPending] = useActionState(submitAction, {
    error: null,
  });

  // Controlled state so form values survive a resolved action that returns an error
  const [title, setTitle] = useState<string>(defaultTitle);
  const [description, setDescription] = useState<string>(defaultDescription);
  const [isPublic, setIsPublic] = useState<boolean>(defaultIsPublic);
  const [instagramUrl, setInstagramUrl] = useState<string>(defaultInstagramUrl);
  const [etsyUrl, setEtsyUrl] = useState<string>(defaultEtsyUrl);
  const [redbubbleUrl, setRedbubbleUrl] = useState<string>(defaultRedbubbleUrl);
  const [removeImage, setRemoveImage] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pageTitle}</CardTitle>
        <CardDescription>{pageDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          {state?.error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="title">
              Title
              <span aria-hidden className="text-destructive ml-1">
                *
              </span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Aurora Study"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">
              Description
              <span aria-hidden className="text-destructive ml-1">
                *
              </span>
            </Label>
            <textarea
              id="description"
              name="description"
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-36 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Describe the materials, process, story, or inspiration behind this piece."
              required
            />
          </div>

          <label className="flex items-start gap-3 rounded-md border p-4 text-sm">
            <input
              type="checkbox"
              name="is_public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-input"
            />
            <span>
              <span className="block font-medium text-foreground">
                Public artwork
              </span>
              <span className="block text-muted-foreground">
                Allow this artwork to appear in public listings and profile
                views.
              </span>
            </span>
          </label>

          <div className="grid gap-2">
            <Label htmlFor="instagram_url">Instagram post URL</Label>
            <Input
              id="instagram_url"
              name="instagram_url"
              type="url"
              placeholder="https://www.instagram.com/p/..."
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="etsy_url">Etsy listing URL</Label>
            <Input
              id="etsy_url"
              name="etsy_url"
              type="url"
              placeholder="https://www.etsy.com/listing/..."
              value={etsyUrl}
              onChange={(e) => setEtsyUrl(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="redbubble_url">Redbubble listing URL</Label>
            <Input
              id="redbubble_url"
              name="redbubble_url"
              type="url"
              placeholder="https://www.redbubble.com/people/.../works/..."
              value={redbubbleUrl}
              onChange={(e) => setRedbubbleUrl(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">
              Artwork image
              {mode === "create" ? (
                <span aria-hidden className="text-destructive ml-1">
                  *
                </span>
              ) : null}
            </Label>
            {mode === "edit" && currentImageUrl ? (
              <div className="relative aspect-square w-64 max-w-full sm:w-72 md:w-96 overflow-hidden rounded-xl">
                <Image
                  src={currentImageUrl}
                  alt={`${defaultTitle || "Artwork"} image`}
                  fill
                  className="object-contain bg-background/80"
                  sizes="(min-width: 768px) 28rem, 18rem"
                />
              </div>
            ) : null}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required={mode === "create"}
            />
            {mode === "edit" && currentImagePath ? (
              <>
                <p className="text-xs text-muted-foreground">
                  A new upload will replace the current artwork image.
                </p>
                <label className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    name="remove_image"
                    checked={removeImage}
                    onChange={(e) => setRemoveImage(e.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  Remove current image
                </label>
              </>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending}
            >
              {isPending ? "Saving..." : submitLabel}
            </Button>
            <CancelButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
