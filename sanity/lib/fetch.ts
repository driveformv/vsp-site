import { client } from "./client";
import type { QueryParams } from "next-sanity";

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
};

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: SanityFetchOptions): Promise<T> {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.fetch<T>(query, params, {
        next: {
          revalidate: revalidate === false ? undefined : revalidate,
          tags,
        },
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const cause = error instanceof Error && 'cause' in error ? String((error as { cause: unknown }).cause) : '';
      const isRetryable = msg.includes('fetch failed') || msg.includes('Timeout') ||
        msg.includes('ETIMEDOUT') || msg.includes('ECONNRESET') ||
        cause.includes('Timeout') || cause.includes('ETIMEDOUT');
      if (isRetryable && attempt < maxRetries) {
        const delay = attempt * 3000;
        console.warn(
          `Sanity fetch attempt ${attempt}/${maxRetries} failed, retrying in ${delay / 1000}s...`
        );
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Sanity fetch failed after retries");
}
