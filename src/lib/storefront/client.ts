import {
  REVALIDATE,
  STOREFRONT_API_PATH,
  STOREFRONT_ORIGIN,
} from "@/lib/storefront/config";

export class StorefrontApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
  ) {
    super(message);
    this.name = "StorefrontApiError";
  }
}

type FetchOptions = {
  revalidate?: number | false;
  tags?: string[];
  cache?: RequestCache;
};

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return `${STOREFRONT_ORIGIN}${STOREFRONT_API_PATH}`;
  }
  return STOREFRONT_API_PATH;
}

export async function storefrontFetch<T>(
  path: string,
  { revalidate = REVALIDATE.catalog, tags, cache }: FetchOptions = {},
): Promise<T> {
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: cache ?? (revalidate === false ? "no-store" : undefined),
    next:
      revalidate === false
        ? undefined
        : {
            revalidate,
            tags,
          },
  });

  if (!res.ok) {
    throw new StorefrontApiError(
      `Storefront API ${res.status}: ${path}`,
      res.status,
      path,
    );
  }

  return (await res.json()) as T;
}

export async function storefrontFetchSafe<T>(
  path: string,
  fallback: T,
  options?: FetchOptions,
): Promise<T> {
  try {
    return await storefrontFetch<T>(path, options);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[storefront]", path, error);
    }
    return fallback;
  }
}
