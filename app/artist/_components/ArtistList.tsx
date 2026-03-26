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

function getArtistInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function ArtistList() {
  const artists = await getPublicArtists();

  if (artists.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No public artists yet</CardTitle>
          <CardDescription>
            Artist profiles marked as public will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {artists.map((artist) => {
        const initials = getArtistInitials(artist.name);

        return (
          <Card key={artist.id} className="flex h-full flex-col">
            <CardHeader className="gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
                  {initials}
                </div>
                <div className="min-w-0 space-y-2">
                  <CardTitle className="text-xl">{artist.name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Public profile</Badge>
                    {artist.location ? (
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        {artist.location}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </div>
              <CardDescription className="line-clamp-3 min-h-[3.75rem] text-sm leading-6">
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
            <CardFooter>
              <Button asChild className="w-full sm:w-auto">
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
