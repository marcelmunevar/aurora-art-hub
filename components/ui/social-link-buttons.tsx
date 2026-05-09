import * as React from "react";
import Link from "next/link";
import {
  ExternalLink,
  Globe,
  Instagram,
  Pencil,
  Plus,
  Sparkles,
  Store,
} from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SocialLinkButtonProps = {
  href: string;
  children?: React.ReactNode;
  className?: string;
  size?: ButtonProps["size"];
};

type SharedButtonProps = SocialLinkButtonProps & {
  icon: React.ReactNode;
  buttonClassName: string;
};

export type SocialProfileLink = {
  label: string;
  href: string;
};

export type ActionLink = {
  label: string;
  href: string;
  kind:
    | "view-profile"
    | "edit-profile"
    | "view-artwork"
    | "edit-artwork"
    | "add-artwork";
};

function SharedSocialLinkButton({
  href,
  children,
  className,
  size,
  icon,
  buttonClassName,
}: SharedButtonProps) {
  return (
    <Button asChild size={size} className={cn(buttonClassName, className)}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {icon}
        {children}
        <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  );
}

export function InstagramButton({
  href,
  children = "View on Instagram",
  className,
  size,
}: SocialLinkButtonProps) {
  return (
    <SharedSocialLinkButton
      href={href}
      className={className}
      size={size}
      icon={<Instagram className="h-4 w-4" />}
      buttonClassName="rounded-full border-0 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-orange-400 text-white hover:opacity-90"
    >
      {children}
    </SharedSocialLinkButton>
  );
}

export function EtsyButton({
  href,
  children = "Buy on Etsy",
  className,
  size,
}: SocialLinkButtonProps) {
  return (
    <SharedSocialLinkButton
      href={href}
      className={className}
      size={size}
      icon={<Sparkles className="h-4 w-4" />}
      buttonClassName="rounded-full bg-orange-600 text-white hover:bg-orange-700"
    >
      {children}
    </SharedSocialLinkButton>
  );
}

export function WebsiteButton({
  href,
  children = "Visit website",
  className,
  size,
}: SocialLinkButtonProps) {
  return (
    <SharedSocialLinkButton
      href={href}
      className={className}
      size={size}
      icon={<Globe className="h-4 w-4" />}
      buttonClassName="rounded-full border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </SharedSocialLinkButton>
  );
}

export function RedbubbleButton({
  href,
  children = "Shop on Redbubble",
  className,
  size,
}: SocialLinkButtonProps) {
  return (
    <SharedSocialLinkButton
      href={href}
      className={className}
      size={size}
      icon={<Store className="h-4 w-4" />}
      buttonClassName="rounded-full border-0 bg-[#e41321] text-white hover:bg-[#c8101d]"
    >
      {children}
    </SharedSocialLinkButton>
  );
}

function ActionLinkButton({ action }: { action: ActionLink }) {
  if (action.kind === "edit-profile" || action.kind === "edit-artwork") {
    return (
      <Button
        asChild
        size="sm"
        variant="outline"
        className="w-full rounded-full"
      >
        <Link href={action.href}>
          <Pencil className="h-4 w-4" />
          {action.label}
        </Link>
      </Button>
    );
  }

  if (action.kind === "add-artwork") {
    return (
      <Button asChild size="sm" className="w-full rounded-full">
        <Link href={action.href}>
          <Plus className="h-4 w-4" />
          {action.label}
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild size="sm" className="w-full rounded-full">
      <Link href={action.href}>
        {action.label}
        <ExternalLink className="h-4 w-4" />
      </Link>
    </Button>
  );
}

function SocialLinkButtonsComponent({
  profileLinks,
  actionLinks,
  className,
}: {
  profileLinks?: SocialProfileLink[];
  actionLinks?: ActionLink[];
  className?: string;
}) {
  const resolvedProfileLinks = profileLinks ?? [];
  const resolvedActionLinks = actionLinks ?? [];

  return (
    <div className={cn("flex flex-col gap-2 pt-1", className)}>
      {resolvedProfileLinks.map((item) => {
        if (item.label === "Instagram") {
          return (
            <InstagramButton
              key={item.label}
              href={item.href}
              size="sm"
              className="w-full"
            >
              Instagram
            </InstagramButton>
          );
        }

        if (item.label === "Website") {
          return (
            <WebsiteButton
              key={item.label}
              href={item.href}
              size="sm"
              className="w-full"
            >
              Website
            </WebsiteButton>
          );
        }

        if (item.label === "Redbubble") {
          return (
            <RedbubbleButton
              key={item.label}
              href={item.href}
              size="sm"
              className="w-full"
            >
              Redbubble
            </RedbubbleButton>
          );
        }

        if (item.label === "Etsy") {
          return (
            <EtsyButton
              key={item.label}
              href={item.href}
              size="sm"
              className="w-full"
            >
              Etsy
            </EtsyButton>
          );
        }

        return (
          <Button
            key={item.label}
            asChild
            size="sm"
            variant="outline"
            className="rounded-full"
          >
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              {item.label}
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        );
      })}
      {resolvedActionLinks.map((action) => (
        <ActionLinkButton
          key={`${action.kind}:${action.href}`}
          action={action}
        />
      ))}
    </div>
  );
}

export const SocialLinkButtons = Object.assign(SocialLinkButtonsComponent, {
  InstagramButton,
  EtsyButton,
  WebsiteButton,
  RedbubbleButton,
});
