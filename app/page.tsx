import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4">
        Welcome to Aurora Art Hub, a vibrant community where artists and art
        enthusiasts come together to share, discover, and celebrate creativity.
        Join us to explore a world of artistic expression and connect with
        fellow art lovers!
      </main>
    </>
  );
}
