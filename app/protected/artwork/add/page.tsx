import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreateArtworkForm from "@/components/artwork-form";

async function ArtworkForm() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return <CreateArtworkForm />;
}

export default async function ProtectedPage() {
  return <ArtworkForm />;
}
