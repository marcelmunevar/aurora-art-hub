import { Suspense } from "react";

export default function Page({ params }: PageProps<"/art/[artSlug]">) {
  return (
    <div>
      <div>
        Slug is:{" "}
        <Suspense fallback={<div>Loading...</div>}>
          {params.then(({ artSlug }) => (
            <>{artSlug}</>
          ))}
        </Suspense>
      </div>
    </div>
  );
}
