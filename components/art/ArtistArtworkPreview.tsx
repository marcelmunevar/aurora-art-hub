import Image from "next/image";
import Link from "next/link";

import { getLinkPreviewImageDataUrl } from "@/components/link-previews/link-preview";
import { getArtImagePublicUrl, getPublicArt } from "@/lib/queries/art";
import { cn } from "@/lib/utils";

export type ArtistArtworkPreviewItem = {
  artist_id: number;
  slug: string;
  title: string;
  image_path: string | null;
  instagram_url: string | null;
};

type ArtistArtworkPreviewProps = {
  artistId: number;
  artworks?: ArtistArtworkPreviewItem[];
  className?: string;
  frameClassName?: string;
  imageClassName?: string;
  sizes?: string;
};

function selectArtistArtwork(
  artworks: ArtistArtworkPreviewItem[],
): ArtistArtworkPreviewItem | null {
  const withImage = artworks.find((art) => art.image_path);

  if (withImage) {
    return withImage;
  }

  return artworks.find((art) => art.instagram_url) ?? null;
}

async function resolveArtistArtworkMedia(
  artistId: number,
  artworks?: ArtistArtworkPreviewItem[],
): Promise<{ href: string; src: string; title: string } | null> {
  const artistArtworks = artworks ?? (await getPublicArt());
  const selectedArtwork = selectArtistArtwork(
    artistArtworks.filter((art) => art.artist_id === artistId),
  );

  if (!selectedArtwork) {
    return null;
  }

  let src: string | null = null;

  if (selectedArtwork.image_path) {
    try {
      src = getArtImagePublicUrl(selectedArtwork.image_path);
    } catch {
      src = null;
    }
  }

  if (!src && selectedArtwork.instagram_url) {
    src = await getLinkPreviewImageDataUrl(selectedArtwork.instagram_url);
  }

  if (!src) {
    return null;
  }

  return {
    href: `/art/${selectedArtwork.slug}`,
    src,
    title: selectedArtwork.title,
  };
}

export async function ArtistArtworkPreview({
  artistId,
  artworks,
  className,
  frameClassName,
  imageClassName,
  sizes = "(min-width: 1080px) 33vw, (min-width: 520px) 50vw, 100vw",
}: ArtistArtworkPreviewProps) {
  const media = await resolveArtistArtworkMedia(artistId, artworks);

  if (!media) {
    return null;
  }

  return (
    <Link href={media.href} className={cn("block", className)}>
      <div
        className={cn(
          "relative h-64 w-full overflow-hidden border border-border/60 bg-background/80 shadow-sm",
          frameClassName,
        )}
      >
        <Image
          src={media.src}
          alt={media.title}
          fill
          className={cn("object-cover", imageClassName)}
          sizes={sizes}
          unoptimized
        />
      </div>
    </Link>
  );
}