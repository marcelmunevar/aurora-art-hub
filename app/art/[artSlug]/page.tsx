import type { Metadata } from "next";
import { Suspense } from "react";
import { ArtDetail } from "@/components/art/ArtDetail";
import { getArtBySlug, getArtImagePublicUrl } from "@/lib/queries/art";

export async function generateMetadata({
  params,
}: PageProps<"/art/[artSlug]">): Promise<Metadata> {
  const { artSlug } = await params;
  const art = await getArtBySlug(artSlug);

  // Only expose rich metadata for public artwork; keep private/missing pieces generic.
  if (!art || !art.is_public) {
    return { title: "Artwork" };
  }

  const description =
    art.description ?? `View "${art.title}" on Aurora Art Hub.`;
  const imageUrl = art.image_path
    ? getArtImagePublicUrl(art.image_path)
    : undefined;

  return {
    title: art.title,
    description,
    alternates: { canonical: `/art/${art.slug}` },
    openGraph: {
      title: art.title,
      description,
      url: `/art/${art.slug}`,
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: art.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

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
