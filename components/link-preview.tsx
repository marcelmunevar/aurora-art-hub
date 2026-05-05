import { ExternalLink } from "lucide-react";

const FB_UA =
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

interface OGData {
  title?: string;
  description?: string;
  image?: string;
}

async function fetchOG(url: string): Promise<OGData> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": FB_UA },
      next: { revalidate: 3600 },
    });
    const html = await res.text();

    const get = (prop: string) => {
      const m =
        html.match(
          new RegExp(
            `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']*)["']`,
            "i",
          ),
        ) ??
        html.match(
          new RegExp(
            `<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${prop}["']`,
            "i",
          ),
        );
      return m?.[1];
    };

    const raw = get("og:image");
    return {
      title: get("og:title"),
      description: get("og:description"),
      image: raw ? raw.replace(/&amp;/g, "&") : undefined,
    };
  } catch {
    return {};
  }
}

async function fetchImageDataUrl(src: string): Promise<string | null> {
  try {
    const res = await fetch(src, {
      headers: { "User-Agent": FB_UA },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "image/jpeg";
    const buf = await res.arrayBuffer();
    return `data:${ct};base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    return null;
  }
}

export async function LinkPreview({ url }: { url: string | null }) {
  if (!url) return null;

  const [og, hostname] = await Promise.all([
    fetchOG(url),
    Promise.resolve(new URL(url).hostname.replace(/^www\./, "")),
  ]);

  const imageDataUrl = og.image ? await fetchImageDataUrl(og.image) : null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full max-w-sm flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      {imageDataUrl ? (
        <div className="aspect-square w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageDataUrl}
            alt={og.title ?? "Preview"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-square w-full items-center justify-center bg-muted">
          <span className="text-xs text-muted-foreground">No image</span>
        </div>
      )}

      <div className="flex flex-col gap-1 p-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-medium uppercase tracking-wide">
            {hostname}
          </span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </div>
        {og.title && (
          <p className="line-clamp-2 text-sm font-semibold leading-snug">
            {og.title}
          </p>
        )}
        {og.description && (
          <p className="line-clamp-3 text-xs text-muted-foreground">
            {og.description}
          </p>
        )}
      </div>
    </a>
  );
}
