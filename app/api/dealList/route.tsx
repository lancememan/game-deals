import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

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
  steamRating?: string;
  title?: string;
  sortBy?: string;
};


// Utility: build a stable cache key from query params
function buildCacheKey(base: string, params: Record<string, any>) {
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .sort() // ensures consistent order
    .join("&");

  return [`${base}?${queryString}`];
}

// Wrapper function that creates a cached fetch per query
async function getEnrichedDeals(params: DealParams) {
  // compute the cache key here
  const cacheKey = buildCacheKey("enriched-deals", params);

  // create a cached function bound to this key
  const cachedFn = unstable_cache(
    async () => {

      // Build query string safely
      const query = new URLSearchParams({
        storeID: params.storeID,
        ...(params.pageNumber !== undefined && { pageNumber: String(params.pageNumber) }),
        ...(params.pageSize !== undefined && { pageSize: String(params.pageSize) }),
        ...(params.lowerPrice !== undefined && { lowerPrice: String(params.lowerPrice) }),
        ...(params.upperPrice !== undefined && { upperPrice: String(params.upperPrice) }),
        ...(params.AAA && { AAA: params.AAA }),
        ...(params.steamRating && { steamRating: params.steamRating }),
        ...(params.title && { title: params.title }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        onSale: "1", // always filter to on sale
      }).toString();


      const [deals, stores] = await Promise.all([
        fetch(
          `https://www.cheapshark.com/api/1.0/deals?${query}`
        ).then(res => res.json()),
        fetch("https://www.cheapshark.com/api/1.0/stores").then(res => res.json())
      ]);

      const enrichedDeals = await Promise.all(
        deals.map(async (deal: any) => {
          try {
            const detail = await fetch(
              `https://www.cheapshark.com/api/1.0/deals?id=${deal.dealID}`
            ).then(res => res.json());

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
              cheapestPriceEver: detail.cheapestPriceEver || null
            };
          } catch {
            return deal;
          }
        })
      );

      return enrichedDeals;
    },
    cacheKey, // ✅ pass string[] directly
    { revalidate: 3600 }
  );

  return cachedFn();
}

// API route
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeID = searchParams.get("storeID") || "1";
  const pageNumber = Number(searchParams.get("pageNumber")) || 0;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const lowerPrice = Number(searchParams.get("lowerPrice")) || 0;
  const upperPrice = Number(searchParams.get("upperPrice")) || 50;
  const AAA = searchParams.get("AAA") || "1";
  const steamRating = searchParams.get("steamRating") || "0";
  const title = searchParams.get("title") || "";
  const sortBy = searchParams.get("sortBy") || "Metacritic";

  const enrichedDeals = await getEnrichedDeals({
    storeID,
    pageNumber,
    pageSize,
    upperPrice,
    lowerPrice,
    AAA,
    steamRating,
    title,
    sortBy,
  });

  return NextResponse.json(enrichedDeals);
}
