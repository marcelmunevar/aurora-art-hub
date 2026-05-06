import { Suspense } from "react";
import { ArtDetail } from "@/components/art/ArtDetail";

export default function Page({ params }: PageProps<"/art/[artSlug]">) {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
        {params.then(({ artSlug }) => (
          <ArtDetail artSlug={artSlug} />
        ))}
      </Suspense>
    </div>
  );
}
