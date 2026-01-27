import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import crypto from "crypto";

// https://apidocs.cheapshark.com/

type DealParams = {
  title?: string;
  pageNumber?: string;
  pageSize?: string;
  lowerPrice?: string;
  upperPrice?: string;
  AAA?: string;
  steamRating?: string;
  sortBy?: string;
  desc?: string;
}

// Utility: build a stable cache key from query params
function buildCacheKey(base: string, params: Record<string, any>) {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .sort() // ensures consistent order
    .join("&");

  //hash key for shorter length
  const hash = crypto.createHash("sha256").update(queryString).digest("hex");

  return [`${base}?${hash}`];
}

// Wrapper function that creates a cached fetch per query
async function getDeals(params: DealParams) {

  // Create a unique cache key based on params
  const cacheKey = buildCacheKey("enriched-deals", params);

  // Create the cached function
  const cachedFn = unstable_cache(
    async () => {
      // Build query string safely
      const queryParams = new URLSearchParams();      
      queryParams.append("storeID", "1"); //default to steam
      if (params.title) queryParams.append("title", params.title);
      if (params.pageNumber) queryParams.append("pageNumber", String(params.pageNumber));
      if (params.lowerPrice) queryParams.append("lowerPrice", String(params.lowerPrice));
      if (params.upperPrice) queryParams.append("upperPrice", String(params.upperPrice));
      if (params.AAA == "true" || params.AAA == "1") queryParams.append("AAA", "1");
      if (params.steamRating) queryParams.append("steamRating", String(params.steamRating));
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      queryParams.append("onSale", "1");
      if (params.desc == "true" || params.desc == "1") queryParams.append("desc", "1");
      
      const query = queryParams.toString();

      //Fetch deals
      const dealsRes = await fetch(`https://www.cheapshark.com/api/1.0/deals?${query}`);
      if (!dealsRes.ok) throw new Error("Failed to fetch deals");

      const totalPages = Number(dealsRes.headers.get("X-Total-Page-Count") || 0);
      
      const deals = await dealsRes.json();

      return { totalPages, deals };
    },
    cacheKey,
    { revalidate: 3600 } // 1 hour cache for deals
  );

  return cachedFn();

}


// API route
export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);

    const params: DealParams = {
      title: searchParams.get("title") ?? undefined,
      pageNumber: searchParams.get("pageNumber") ?? undefined,
      lowerPrice: searchParams.get("lowerPrice") ?? undefined,
      upperPrice: searchParams.get("upperPrice") ?? undefined,
      AAA: searchParams.get("AAA") ?? undefined,
      steamRating: searchParams.get("steamRating") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      desc: searchParams.get("desc") ?? undefined,
    };
    
    const enrichedDeals = await getDeals({... params});

    return NextResponse.json(enrichedDeals);

}
