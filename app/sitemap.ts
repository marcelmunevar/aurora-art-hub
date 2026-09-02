import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";
import { getPublicArt } from "@/lib/queries/art";
import { getPublicArtists } from "@/lib/queries/artist";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [art, artists] = await Promise.all([
    getPublicArt(),
    getPublicArtists(),
  ]);

  return [
    { url: `${siteUrl}/`, priority: 1 },
    { url: `${siteUrl}/art`, priority: 0.8 },
    { url: `${siteUrl}/artist`, priority: 0.8 },
    ...art.map((piece) => ({
      url: `${siteUrl}/art/${piece.slug}`,
      priority: 0.6,
    })),
    ...artists.map((artist) => ({
      url: `${siteUrl}/artist/${artist.slug}`,
      priority: 0.6,
    })),
  ];
}
