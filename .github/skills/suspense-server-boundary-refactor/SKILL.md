---
name: suspense-server-boundary-refactor
description: "Fix Next.js Suspense issues by moving server-side logic into a separate async function that returns TSX, then wrapping that function's output in a Suspense boundary from the main page export. Use for App Router pages with async data fetching, params parsing, or expensive server rendering."
argument-hint: "Target file and fallback UI (e.g., app/art/[artSlug]/page.tsx, skeleton card list)"
user-invocable: true
disable-model-invocation: false
---

# Suspense Server Boundary Refactor

## What This Produces

A stable App Router page structure where the default export is lightweight and synchronous, while server-side data work lives in a separate async TSX-returning function rendered inside a `Suspense` boundary.

## When to Use

- A page mixes heavy async server logic directly in the default export.
- You need cleaner loading behavior with a clear fallback UI.
- You see Suspense-related rendering issues, waterfall behavior, or awkward loading states.
- You want a repeatable pattern for server-data pages in Next.js App Router.

## Inputs

- Target file path (for example, `app/.../page.tsx`).
- Desired fallback UI (`loading.tsx` style snippet, skeleton, or spinner).
- Existing data dependencies (queries, auth checks, params/searchParams usage).

## Procedure

1. Inspect the target page and identify all server-only concerns.
2. Create an internal async function (for example `PageContent`) that performs the server-side work and returns TSX.
3. Move data fetching, auth guards, validation, and branch logic into this async function.
4. Keep the main default export focused on composition only.
5. Render the async content function inside `<Suspense fallback={...}>` in the main export.
6. Preserve behavior for redirects, not-found branches, and error throwing from the async function.
7. Keep function and prop types explicit (`params`, `searchParams`, and inferred data types).
8. Verify imports are correct (`Suspense` from `react`, plus unchanged query/util imports).
9. Confirm fallback UI is meaningful and matches existing design system.
10. Run lint/type checks and verify the route renders correctly in both loading and resolved states.

## Decision Points

- If the page already has a route-level `loading.tsx`:
  - Keep it, and still use local `Suspense` when you need section-level fallbacks.
- If only one data source is slow:
  - Wrap just the slow subtree in `Suspense` instead of the full page body.
- If auth/permission checks may redirect:
  - Execute those checks inside the async function before rendering child UI.
- If fallback duplicates route-level loading behavior:
  - Simplify local fallback to avoid redundant spinners/skeletons.

## Quality Checks

- Default export is simple and no longer contains heavy async logic.
- Server-side logic exists in one separate async TSX-returning function.
- `Suspense` boundary wraps the async output in the main export.
- TypeScript passes without introducing `any`.
- Redirect and not-found behavior remain unchanged.
- Fallback appears during load and disappears on resolution.
- No UI regressions on desktop/mobile for the affected page.

## Minimal Pattern

```tsx
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function PageContent({ params }: PageProps) {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) {
    notFound();
  }

  return <DetailView data={data} />;
}

export default function Page(props: PageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent {...props} />
    </Suspense>
  );
}
```

## Done Criteria

The route compiles, loading states are explicit via `Suspense`, and the data-fetching logic is isolated from the default export for readability, maintainability, and consistent rendering behavior.
