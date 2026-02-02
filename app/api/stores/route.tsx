import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

// Cache the stores list globally
const getStores = unstable_cache(
  async () => {
    const res = await fetch("https://www.cheapshark.com/api/1.0/stores", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "game-deals/1.0 (https://lancememan-game-deals.vercel.app/)"
      }
    });
    return res.json();
  },
  ["stores-list"],
  { revalidate: 86400 } // 24 hours
);

export async function GET(req: Request) {
  
    return NextResponse.json(await getStores());

}
