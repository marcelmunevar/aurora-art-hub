"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const items = [
    { label: "Home", href: "/" },
    ...segments.map((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      const label =
        seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
      return {
        label,
        href: idx === segments.length - 1 ? undefined : href,
      };
    }),
  ];
  return (
    <nav
      className={cn("flex items-center text-sm gap-1", className)}
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          {item.href && idx !== items.length - 1 ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
          {idx < items.length - 1 && (
            <span className="mx-2 text-muted-foreground">/</span>
          )}
        </span>
      ))}
    </nav>
  );
}
