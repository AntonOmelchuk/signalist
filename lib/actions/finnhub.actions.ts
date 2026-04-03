"use server";

import { formatArticle, getDateRange, validateArticle } from "../utils";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const TOKEN = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? "";
const MAX_ARTICLES = 6;

type TOptions = RequestInit & { next?: { revalidate?: number } };

export const fetchJSON = async <T>(
  url: string,
  revalidateSeconds?: number,
): Promise<T> => {
  const options: TOptions = revalidateSeconds
    ? { cache: "force-cache", next: { revalidate: revalidateSeconds } }
    : { cache: "no-store" };

  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
};

export const getNews = async (
  symbols?: string[],
): Promise<MarketNewsArticle[]> => {
  try {
    const { from, to } = getDateRange(5);

    const cleanSymbols = (symbols || [])
      .map((symbol) => symbol?.trim().toUpperCase())
      .filter((symbol) => Boolean(symbol));

    // If we have symbols, try to fetch company news per symbol and round-robin select
    if (cleanSymbols.length > 0) {
      const perSymbolArticles: Record<string, RawNewsArticle[]> = {};

      await Promise.all(
        cleanSymbols.map(async (symbol) => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${TOKEN}`;
            const article = await fetchJSON<RawNewsArticle[]>(url, 300);

            perSymbolArticles[symbol] = (article || []).filter(validateArticle);
          } catch (error) {
            console.error("Error fetching company news for", symbol, error);
            perSymbolArticles[symbol] = [];
          }
        }),
      );

      const collected: MarketNewsArticle[] = [];

      // Round-robin up to 6 picks
      for (let round = 0; round < MAX_ARTICLES; round++) {
        for (let i = 0; i < cleanSymbols.length; i++) {
          const symbol = cleanSymbols[i];
          const list = perSymbolArticles[symbol] || [];

          if (list.length === 0) continue;

          const article = list.shift();

          if (!article || !validateArticle(article)) continue;

          collected.push(formatArticle(article, true, symbol, round));

          if (collected.length > MAX_ARTICLES) break;
        }

        if (collected.length > MAX_ARTICLES) break;
      }

      if (collected.length > 0) {
        // Sort by datetime desc
        collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));

        return collected.slice(0, MAX_ARTICLES);
      }

      // If none collected, fall throught to general news
    }

    // General market news fallback or when no symbols provided
    const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${TOKEN}`;
    const general = await fetchJSON<RawNewsArticle[]>(generalUrl, 300);

    const seen = new Set<string>();
    const unique: RawNewsArticle[] = [];

    for (const art of general || []) {
      if (!validateArticle(art)) continue;

      const key = `${art.id}-${art.url}-${art.headline}`;

      if (seen.has(key)) continue;

      seen.add(key);
      unique.push(art);

      if (unique.length > 20) break; // cap early before final slicing
    }

    const formatted = unique
      .slice(0, MAX_ARTICLES)
      .map((article, idx) => formatArticle(article, false, undefined, idx));

    return formatted;
  } catch (error) {
    console.error("getNews error", error);
    throw new Error("Failed to fetch news");
  }
};
