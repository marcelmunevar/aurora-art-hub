import { Suspense } from "react";
import { ArtistDetail } from "./_components/ArtistDetail";

export default function Page({ params }: PageProps<"/artist/[artistSlug]">) {
  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
        {params.then(({ artistSlug }) => (
          <ArtistDetail artistSlug={artistSlug} />
        ))}
      </Suspense>
    </div>
  );
}
