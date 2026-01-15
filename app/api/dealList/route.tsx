import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import crypto from "crypto";

// const DealList = async () => {
//   const res = await fetch("https://www.cheapshark.com/api/1.0/deals?storeID=1&lowerPrice=5&onSale=1&AAA=1",{
//     cache: 'force-cache',
//     next: { revalidate: 3600 } // 1 hour
//   });
//   if (!res.ok) throw new Error("Failed to fetch deals");
//   return res.json();
// };

// const GetDealDetails = async (dealID: string) => {
//   const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?id=${dealID}`{
//     cache: 'force-cache',
//     next: { revalidate: 3600 } // 1 hour
//   });
//   if (!res.ok) throw new Error("Failed to fetch deal details");
//   return res.json();
// };

// const GetStores = async () => {
//   const res = await fetch("https://www.cheapshark.com/api/1.0/stores"{
//     cache: 'force-cache',
//     next: { revalidate: 86400 } // 24 hours
//   });
//   if (!res.ok) throw new Error("Failed to fetch stores");
//   return res.json();
// };

type CheaperStore = {
  storeID?: string;
  salePrice?: string;
  storeName?: string;
  icon?: string;
};

type DealParams = {
  storeID: string;
  pageNumber?: number;
  pageSize?: number;
  upperPrice: number;
  lowerPrice?: number;
  AAA?: string;
  steamRating?: number;
  title?: string;
  sortBy?: string;
};

// Cache the stores list globally
const getStores = unstable_cache(
  async () => {
    const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
    return res.json();
  },
  ["stores-list"],
  { revalidate: 86400 } // 24 hours
);

// Cache deal details individually per dealID
function getDealDetails(dealID: string) {
  return unstable_cache(
    async () => {
      const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?id=${dealID}`);
      if (!res.ok) throw new Error("Failed to fetch deal detail");
      return res.json();
    },
    [`deal-detail-${dealID}`], // ✅ now dealID is in scope
    { revalidate: 3600 }
  );
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
async function getEnrichedDeals(params: DealParams) {

  // Create a unique cache key based on params
  const cacheKey = buildCacheKey("enriched-deals", params);

  // Create the cached function
  const cachedFn = unstable_cache(
    async () => {
      // Build query string safely
      const queryParams = new URLSearchParams();
      queryParams.append("storeID", params.storeID);
      queryParams.append("pageNumber", String(params.pageNumber));
      queryParams.append("pageSize", String(params.pageSize));
      queryParams.append("lowerPrice", String(params.lowerPrice));
      queryParams.append("upperPrice", String(params.upperPrice));
      queryParams.append("AAA", params.AAA ? "1" : "0");
      queryParams.append("steamRating", String(params.steamRating));
      if (params.title) queryParams.append("title", params.title);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      queryParams.append("onSale", "1");
      
      const query = queryParams.toString();

      // Fetch deals
      const dealsRes = await fetch(`https://www.cheapshark.com/api/1.0/deals?${query}`);
      if (!dealsRes.ok) throw new Error("Failed to fetch deals");

      const totalPages = Number(dealsRes.headers.get("X-Total-Page-Count") || 0);
      const deals = await dealsRes.json();

      // Use cached store list
      const stores = await getStores();

      // Enrich deals
      const enrichedDeals = await Promise.all(
        deals.map(async (deal: any) => {
          try {
            const detail = await getDealDetails(deal.dealID)();

            let cheapestStore: CheaperStore | null = null;

            if (detail.cheaperStores?.length > 0) {
              cheapestStore = detail.cheaperStores.reduce(
                (lowest: any, store: any) =>
                  parseFloat(store.salePrice) < parseFloat(lowest.salePrice) ? store : lowest
              );

              const storeInfo = stores.find((s: any) => s.storeID === cheapestStore?.storeID);
              cheapestStore = {
                ...cheapestStore,
                storeName: storeInfo?.storeName || "Unknown",
                icon: storeInfo?.images.icon || "Unknown",
              };
            }

            return {
              ...deal,
              cheapestStore,
              cheapestPriceEver: detail.cheapestPriceEver || null,
            };
          } catch {
            return deal;
          }
        })
      );

      return { totalPages, deals: enrichedDeals };
    },
    cacheKey,
    { revalidate: 3600 } // 1 hour cache for deals
  );

  return cachedFn();

}


// API route
export async function GET(req: Request) {
  // try {
    const { searchParams } = new URL(req.url);
    const filters: DealParams  = {
      storeID : searchParams.get("storeID") || "1",
      pageNumber: Number(searchParams.get("pageNumber")) || 0,
      pageSize:  Number(searchParams.get("pageSize")) || 10,    
      lowerPrice:  Number(searchParams.get("lowerPrice")) || 0,
      upperPrice:  Number(searchParams.get("upperPrice")) || 50,
      AAA: searchParams.get("AAA") || "0",
      steamRating: Number(searchParams.get("steamRating")) || 0,
      title: searchParams.get("title") || "",
      sortBy: searchParams.get("sortBy") || "Metacritic",
    }
    
    const enrichedDeals = await getEnrichedDeals({... filters});

    return NextResponse.json(enrichedDeals);
  // } catch (err: any) {
  //   return NextResponse.json({ error: err.message }, { status: 500 });
  // }
}
