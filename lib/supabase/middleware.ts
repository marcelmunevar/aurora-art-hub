const PROTECTED_PATHS = new Set(["/profile", "/protected"]);

const PROTECTED_PREFIXES = ["/protected/"];

const PROTECTED_PATTERNS = [/^\/art\/add\/?$/, /^\/art\/[^/]+\/edit\/?$/];

function normalizePathname(pathname: string): string {
  if (!pathname) return "/";

  return pathname !== "/" && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

export function isAuthRoute(pathname: string): boolean {
  const normalizedPathname = normalizePathname(pathname);

  return (
    normalizedPathname === "/auth" || normalizedPathname.startsWith("/auth/")
  );
}

export function requiresAuthenticatedUser(pathname: string): boolean {
  const normalizedPathname = normalizePathname(pathname);

  if (PROTECTED_PATHS.has(normalizedPathname)) {
    return true;
  }

  if (
    PROTECTED_PREFIXES.some((prefix) => normalizedPathname.startsWith(prefix))
  ) {
    return true;
  }

  return PROTECTED_PATTERNS.some((pattern) => pattern.test(normalizedPathname));
}
