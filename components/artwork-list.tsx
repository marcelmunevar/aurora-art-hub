import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ArtworkList({
  artworks,
  currentUserId,
}: {
  artworks: Array<{
    id: number;
    title: string;
    description: string | null;
    is_public: boolean;
    user_id: string;
  }>;
  currentUserId: string;
}) {
  if (!artworks || artworks.length === 0) {
    return <div>No artworks found.</div>;
  }
  return (
    <div className="grid grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <Card key={artwork.id}>
          <CardHeader>
            <CardTitle>{artwork.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground mb-2">
              {artwork.description || <em>No description</em>}
            </div>
            <div className="text-xs">
              {artwork.is_public ? "Public" : "Private"}
              {artwork.user_id === currentUserId && " • Your artwork"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
