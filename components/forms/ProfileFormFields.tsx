"use client";

import React, { useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  submitAction: (
    prev: { error: string | null },
    formData: FormData,
  ) => Promise<{ error: string | null }>;
  pageTitle: string;
  pageDescription: string;
  submitLabel: string;
  successMessage: string | null;
  defaultName: string;
  defaultBio: string;
  defaultLocation: string;
  defaultWebsite: string;
  defaultInstagramLink: string;
  defaultEtsyLink: string;
  defaultRedbubbleLink: string;
  defaultIsPublic: boolean;
};

export default function ProfileFormFields({
  submitAction,
  pageTitle,
  pageDescription,
  submitLabel,
  successMessage,
  defaultName,
  defaultBio,
  defaultLocation,
  defaultWebsite,
  defaultInstagramLink,
  defaultEtsyLink,
  defaultRedbubbleLink,
  defaultIsPublic,
}: Props) {
  const [state, action, isPending] = useActionState(submitAction, {
    error: null,
  });

  const [name, setName] = useState(defaultName);
  const [bio, setBio] = useState(defaultBio);
  const [location, setLocation] = useState(defaultLocation);
  const [website, setWebsite] = useState(defaultWebsite);
  const [instagramLink, setInstagramLink] = useState(defaultInstagramLink);
  const [etsyLink, setEtsyLink] = useState(defaultEtsyLink);
  const [redbubbleLink, setRedbubbleLink] = useState(defaultRedbubbleLink);
  const [isPublic, setIsPublic] = useState(defaultIsPublic);

  const error = state?.error ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pageTitle}</CardTitle>
        <CardDescription>{pageDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          {error ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="name">
              Name
              <span aria-hidden className="text-destructive ml-1">
                *
              </span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Aurora Studio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">
              Bio
              <span aria-hidden className="text-destructive ml-1">
                *
              </span>
            </Label>
            <textarea
              id="bio"
              name="bio"
              rows={6}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="flex min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Write a short introduction about your work and practice."
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="location">
                Location
                <span aria-hidden className="text-destructive ml-1">
                  *
                </span>
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Detroit, MI"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourstudio.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instagram_link">Instagram</Label>
              <Input
                id="instagram_link"
                name="instagram_link"
                type="url"
                placeholder="https://instagram.com/yourhandle"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="etsy_link">Etsy</Label>
              <Input
                id="etsy_link"
                name="etsy_link"
                type="url"
                placeholder="https://etsy.com/shop/yourshop"
                value={etsyLink}
                onChange={(e) => setEtsyLink(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="redbubble_link">Redbubble</Label>
              <Input
                id="redbubble_link"
                name="redbubble_link"
                type="url"
                placeholder="https://redbubble.com/people/yourshop"
                value={redbubbleLink}
                onChange={(e) => setRedbubbleLink(e.target.value)}
              />
            </div>
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
                Public profile
              </span>
              <span className="block text-muted-foreground">
                Allow your artist page to appear in public listings.
              </span>
            </span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={!!isPending}
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
