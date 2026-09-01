"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CancelButtonProps = {
  className?: string;
};

export function CancelButton({ className }: CancelButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("w-full sm:w-auto", className)}
      onClick={() => router.back()}
    >
      Cancel
    </Button>
  );
}
