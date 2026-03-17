import { Suspense } from "react";

export default function Page({ params }: PageProps<"/artist/[artistSlug]">) {
  return (
    <div>
      <div>
        Slug is:{" "}
        <Suspense fallback={<div>Loading...</div>}>
          {params.then(({ artistSlug }) => (
            <>{artistSlug}</>
          ))}
        </Suspense>
      </div>
    </div>
  );
}
