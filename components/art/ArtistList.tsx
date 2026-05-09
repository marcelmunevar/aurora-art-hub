import Link from "next/link";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SocialLinkButtons } from "@/components/ui/social-link-buttons";
import { getPublicArtists } from "@/lib/queries/artist";

const CARD_ACCENTS = [
  "from-amber-200/70 via-orange-100/40 to-transparent dark:from-amber-500/20 dark:via-orange-400/10 dark:to-transparent",
  "from-emerald-200/70 via-teal-100/40 to-transparent dark:from-emerald-500/20 dark:via-teal-400/10 dark:to-transparent",
  "from-sky-200/70 via-cyan-100/40 to-transparent dark:from-sky-500/20 dark:via-cyan-400/10 dark:to-transparent",
  "from-rose-200/70 via-pink-100/40 to-transparent dark:from-rose-500/20 dark:via-pink-400/10 dark:to-transparent",
];

export async function ArtistList() {
  const artists = await getPublicArtists();

  if (artists.length === 0) {
    return (
      <Card className="rounded-[1.75rem] border-dashed border-border/70 bg-muted/20">
        <CardHeader className="items-start gap-4">
          <CardTitle>No public artists yet</CardTitle>
          <CardDescription>
            Artist profiles marked as public will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 min-[520px]:grid-cols-2 min-[1080px]:grid-cols-3">
      {artists.map((artist) => {
        const accentClass = CARD_ACCENTS[artist.id % CARD_ACCENTS.length];
        const profileLinks = [
          artist.website
            ? {
                label: "Website",
                href: artist.website,
              }
            : null,
          artist.instagram_link
            ? {
                label: "Instagram",
                href: artist.instagram_link,
              }
            : null,
          artist.redbubble_link
            ? {
                label: "Redbubble",
                href: artist.redbubble_link,
              }
            : null,
          artist.etsy_link
            ? {
                label: "Etsy",
                href: artist.etsy_link,
              }
            : null,
        ].filter(Boolean) as Array<{ label: string; href: string }>;

        return (
          <Card
            key={artist.id}
            className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border-border/60 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <CardHeader className="relative gap-5 px-0 pb-4 pt-0">
              <div className={`bg-gradient-to-br ${accentClass} px-6 py-6`}>
                <div className="flex items-start gap-4">
                  <div className="min-w-0 space-y-3">
                    <div className="space-y-2">
                      <CardTitle className="text-xl leading-tight">
                        <Link
                          href={`/artist/${artist.slug}`}
                          className="transition-colors hover:text-foreground/70"
                        >
                          {artist.name}
                        </Link>
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className="rounded-full px-3 py-1"
                        >
                          Public profile
                        </Badge>
                        {artist.location ? (
                          <Badge
                            variant="outline"
                            className="gap-1 rounded-full px-3 py-1"
                          >
                            <MapPin className="h-3 w-3" />
                            {artist.location}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="px-6 line-clamp-4 min-h-[5.25rem] text-sm leading-7 text-muted-foreground/95">
                {artist.bio?.trim() || "This artist has not added a bio yet."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-end gap-3">
              <SocialLinkButtons
                profileLinks={profileLinks}
                actionLinks={[
                  {
                    label: "View profile",
                    href: `/artist/${artist.slug}`,
                    kind: "view-profile",
                  },
                ]}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
