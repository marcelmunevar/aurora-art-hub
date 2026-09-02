import type { Metadata } from "next";
import { Suspense } from "react";
import { ArtistDetail } from "@/components/art/ArtistDetail";
import { getArtistBySlug } from "@/lib/queries/artist";

export async function generateMetadata({
  params,
}: PageProps<"/artist/[artistSlug]">): Promise<Metadata> {
  const { artistSlug } = await params;
  const artist = await getArtistBySlug(artistSlug);

  // Only expose rich metadata for public profiles; keep private/missing ones generic.
  if (!artist || !artist.is_public) {
    return { title: "Artist" };
  }

  const description =
    artist.bio ?? `View ${artist.name}'s profile on Aurora Art Hub.`;

  return {
    title: artist.name,
    description,
    alternates: { canonical: `/artist/${artist.slug}` },
    openGraph: {
      title: artist.name,
      description,
      url: `/artist/${artist.slug}`,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: artist.name,
      description,
    },
  };
}

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
