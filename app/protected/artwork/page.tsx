import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ArtworkList from "@/components/artwork-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

async function Artworks() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return <div className="text-destructive">Error: Not logged in</div>;
  }
  const { data: artworks, error: artworksError } = await supabase
    .from("artworks")
    .select("id, title, description, is_public, user_id")
    .or(`is_public.eq.true,user_id.eq.${userData.user.id}`)
    .order("id", { ascending: false });
  if (artworksError) {
    return (
      <div className="text-destructive">
        Error loading artworks: {artworksError.message}
      </div>
    );
  }
  return (
    <ArtworkList artworks={artworks || []} currentUserId={userData.user.id} />
  );
}

export default function ArtworkListPage() {
  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Artworks</h1>
      <Suspense>
        <Artworks />
      </Suspense>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/protected/artwork/add">Add Artwork</Link>
      </Button>
    </div>
  );
}
