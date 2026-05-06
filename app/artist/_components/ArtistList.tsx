import Link from "next/link";
import { ExternalLink, Instagram, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
              {artist.website ? (
                <div>
                  <span className="font-medium text-foreground">Website:</span>{" "}
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    Visit site
                  </a>
                </div>
              ) : null}
              {artist.instagram_link ? (
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  <a
                    href={artist.instagram_link}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    Instagram
                  </a>
                </div>
              ) : null}
              {artist.etsy_link ? (
                <div>
                  <span className="font-medium text-foreground">Etsy:</span>{" "}
                  <a
                    href={artist.etsy_link}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4"
                  >
                    Shop
                  </a>
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
              <Button asChild className="w-full min-w-0 rounded-full md:flex-1">
                <Link href={`/artist/${artist.slug}`}>
                  View profile
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
