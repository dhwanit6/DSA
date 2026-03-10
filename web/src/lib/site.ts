const PROD_BASE_PATH = "/DSA";

export const SITE_BASE_PATH = process.env.NODE_ENV === "production" ? PROD_BASE_PATH : "";

export function withBasePath(path: string): string {
  if (!path) return SITE_BASE_PATH || "/";
  if (/^(https?:|mailto:|tel:)/i.test(path)) return path;
  if (SITE_BASE_PATH && path.startsWith(SITE_BASE_PATH)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return SITE_BASE_PATH ? `${SITE_BASE_PATH}${normalizedPath}` : normalizedPath;
}
