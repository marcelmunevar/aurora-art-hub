"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";

export function AuthButton({ stacked = false }: { stacked?: boolean } = {}) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSession() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    }
    fetchSession();

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
        <Link href="/dashboard">Dashboard</Link>
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
