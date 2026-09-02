"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export function AuthButton({ stacked = false }: { stacked?: boolean } = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [artistSlug, setArtistSlug] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    }
    fetchSession();

    async function fetchArtist() {
      const session = await supabase.auth.getSession();
      const currentUser = session.data.session?.user ?? null;
      if (!currentUser) return setArtistSlug(null);

      const { data, error } = await supabase
        .from("artist")
        .select("slug")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (!error && data) {
        setArtistSlug((data as any).slug ?? null);
      } else {
        setArtistSlug(null);
      }
    }
    fetchArtist();

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    // call unsubscribe to remove the callback
    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  return user ? (
    <div
      className={
        stacked
          ? "flex flex-col items-stretch gap-2"
          : "flex items-center gap-4"
      }
    >
      <Button
        asChild
        size="sm"
        variant="outline"
        className={stacked ? "w-full justify-start" : undefined}
      >
        <Link href={artistSlug ? `/artist/${artistSlug}` : "/artist/edit"}>
          Dashboard
        </Link>
      </Button>
      <LogoutButton className={stacked ? "w-full justify-start" : undefined} />
    </div>
  ) : (
    <div className={stacked ? "flex flex-col gap-2" : "flex gap-2"}>
      <Button
        asChild
        size="sm"
        variant={"outline"}
        className={stacked ? "w-full justify-start" : undefined}
      >
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button
        asChild
        size="sm"
        variant={"default"}
        className={stacked ? "w-full justify-start" : undefined}
      >
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
