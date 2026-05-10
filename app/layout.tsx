import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Suspense } from "react";
import { hasEnvVars } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Aurora Art Hub",
    template: "%s | Aurora Art Hub",
  },
  description:
    "A platform for artists to share work, build profiles, and connect with collectors and fans.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

function AuroraLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 108 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Aurora Art Hub"
      {...props}
    >
      <defs>
        <linearGradient
          id="aurora-wordmark-gradient"
          x1="4"
          y1="34"
          x2="44"
          y2="6"
        >
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="45%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#a3e635" />
        </linearGradient>
        <linearGradient
          id="aurora-wordmark-glow"
          x1="20"
          y1="4"
          x2="20"
          y2="36"
        >
          <stop offset="0%" stopColor="#67e8f955" />
          <stop offset="100%" stopColor="#1f293733" />
        </linearGradient>
        <linearGradient
          id="aurora-wordmark-text"
          x1="46"
          y1="7"
          x2="132"
          y2="33"
        >
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#bef264" />
        </linearGradient>
        <radialGradient
          id="aurora-constellation-core"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(20 20) rotate(90) scale(16)"
        >
          <stop offset="0%" stopColor="#67e8f955" />
          <stop offset="100%" stopColor="#67e8f900" />
        </radialGradient>
      </defs>
      <rect
        x="3"
        y="3"
        width="34"
        height="34"
        rx="9"
        stroke="url(#aurora-wordmark-glow)"
        strokeWidth="1.5"
      />
      <rect
        x="4"
        y="4"
        width="32"
        height="32"
        rx="8"
        fill="url(#aurora-constellation-core)"
      />
      <path
        d="M9.6 27.6L14.1 20.1L20.2 22.2L25.8 14.6L30.7 17.4"
        fill="url(#aurora-wordmark-gradient)"
        fillOpacity="0"
        stroke="url(#aurora-wordmark-gradient)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2 11.6L16.3 13.9L21.1 10.8"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.6" cy="27.6" r="1.3" fill="#67e8f9" />
      <circle cx="14.1" cy="20.1" r="1.4" fill="#34d399" />
      <circle cx="20.2" cy="22.2" r="1.25" fill="#bef264" />
      <circle cx="25.8" cy="14.6" r="1.5" fill="#67e8f9" />
      <circle cx="30.7" cy="17.4" r="1.2" fill="#34d399" />
      <circle
        cx="11.2"
        cy="11.6"
        r="1"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <circle
        cx="16.3"
        cy="13.9"
        r="0.95"
        fill="currentColor"
        fillOpacity="0.8"
      />
      <circle
        cx="21.1"
        cy="10.8"
        r="1.05"
        fill="currentColor"
        fillOpacity="0.88"
      />
      <text
        x="49"
        y="17"
        fill="url(#aurora-wordmark-text)"
        fontSize="12"
        fontWeight="700"
        letterSpacing="0.08em"
        style={{ textTransform: "uppercase" }}
      >
        Aurora
      </text>
      <text
        x="49"
        y="30"
        fill="url(#aurora-wordmark-text)"
        fillOpacity="0.95"
        fontSize="11"
        fontWeight="600"
        letterSpacing="0.14em"
        style={{ textTransform: "uppercase" }}
      >
        Art Hub
      </text>
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-10 items-center">
              <nav className="relative w-full flex justify-center border-b border-b-foreground/10 h-16 overflow-hidden bg-[radial-gradient(circle_at_12%_22%,rgba(255,255,255,0.45)_1px,transparent_1.3px),radial-gradient(circle_at_36%_70%,rgba(255,255,255,0.28)_1px,transparent_1.2px),radial-gradient(circle_at_68%_18%,rgba(255,255,255,0.35)_1px,transparent_1.3px),radial-gradient(circle_at_87%_58%,rgba(255,255,255,0.3)_1px,transparent_1.2px),linear-gradient(90deg,rgba(8,47,73,0.86),rgba(6,78,59,0.82),rgba(30,41,59,0.86))]">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link
                      href="/"
                      aria-label="Aurora Art Hub home"
                      className="inline-flex items-center transition-opacity hover:opacity-90"
                    >
                      <AuroraLogo className="h-10 w-[8.75rem] shrink-0" />
                    </Link>
                    <div className="hidden md:flex items-center gap-2">
                      <Link href="/art">Art</Link>
                      <Link href="/artist">Artists</Link>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center">
                    {!hasEnvVars ? (
                      <EnvVarWarning />
                    ) : (
                      <Suspense>
                        <AuthButton />
                      </Suspense>
                    )}
                  </div>

                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full border-white/30 bg-black/20 text-white hover:bg-black/35"
                          aria-label="Open navigation menu"
                        >
                          <Menu className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem asChild>
                          <Link href="/">Home</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/art">Art</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/artist">Artists</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1">
                          {!hasEnvVars ? (
                            <EnvVarWarning />
                          ) : (
                            <Suspense>
                              <AuthButton stacked />
                            </Suspense>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </nav>
              <div className="w-full flex justify-center h-16">
                <div className="w-full max-w-5xl ">
                  <Suspense>
                    <Breadcrumbs className="mb-4" />
                  </Suspense>
                </div>
              </div>
              <div className="flex-1 flex w-full flex-col gap-6 max-w-5xl p-5">
                {children}
              </div>
              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                <ThemeSwitcher />
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
