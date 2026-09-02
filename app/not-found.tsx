import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        404
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        We couldn&apos;t find that page.
      </h1>
      <p className="max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
        The artwork, artist, or page you&apos;re looking for may have been
        moved, made private, or no longer exists.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="rounded-full px-6">
          <Link href="/art">Browse art</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full px-6"
        >
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
