import Link from "next/link";
import {
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Pencil,
  Plus,
} from "lucide-react";

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
import { getPublicArt, getPrivateArt } from "@/lib/queries/art";
import { getCurrentUserArtist } from "@/lib/queries/artist";
import { QueryError } from "@/lib/queries/errors";

function getArtInitials(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type ArtListProps = {
  type: "public" | "private";
};

export async function ArtList({ type }: ArtListProps) {
  let currentUserArtistId: number | null = null;
  let isAuthenticated = true;

  try {
    const currentUserArtist = await getCurrentUserArtist();
    currentUserArtistId = currentUserArtist?.id ?? null;
  } catch (error) {
    if (!(error instanceof QueryError) || error.code !== "UNAUTHORIZED") {
      throw error;
    }

    isAuthenticated = false;
  }

  const artworks =
    type === "public" ? await getPublicArt() : await getPrivateArt();

  const emptyTitle =
    type === "public" ? "No public artwork yet" : "No private artwork yet";
  const emptyDescription =
    type === "public"
      ? "Artwork marked as public will appear here."
      : "Artwork you keep private will appear here.";

  if (artworks.length === 0 && !isAuthenticated) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>{emptyTitle}</CardTitle>
          <CardDescription>{emptyDescription}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {artworks.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>{emptyTitle}</CardTitle>
            <CardDescription>{emptyDescription}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {artworks.map((art) => {
        const initials = getArtInitials(art.title);
        const isOwner = currentUserArtistId === art.artist_id;

        return (
          <Card key={art.id} className="flex h-full flex-col">
            <CardHeader className="gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-lg font-semibold text-muted-foreground">
                  {initials}
                </div>
                <div className="min-w-0 space-y-2">
                  <CardTitle className="text-xl">{art.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {art.artist?.slug ? (
                      <Link
                        href={`/artist/${art.artist.slug}`}
                        className="underline underline-offset-4"
                      >
                        {art.artist.name}
                      </Link>
                    ) : (
                      (art.artist?.name ?? "Unknown artist")
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      {art.is_public ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        <EyeOff className="h-3 w-3" />
                      )}
                      {art.is_public ? "Public" : "Private"}
                    </Badge>
                    <Badge variant="outline">Slug: {art.slug}</Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="line-clamp-4 min-h-24 text-sm leading-6">
                {art.description?.trim() ||
                  "This artwork does not have a description yet."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Artwork details available on the detail page.</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button asChild className="w-full sm:w-auto">
                <Link href={`/art/${art.slug}`}>
                  View artwork
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              {isOwner ? (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href={`/art/${art.slug}/edit`}>
                    Edit artwork
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </CardFooter>
          </Card>
        );
      })}

      {type === "public" && isAuthenticated ? (
        <Card className="flex h-full min-h-72 items-center justify-center border-dashed p-6">
          <CardContent className="flex w-full items-center justify-center p-0">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/art/add">
                Add artwork
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
