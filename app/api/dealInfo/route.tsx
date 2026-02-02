import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

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

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const dealID = searchParams.get("dealId");
    if (!dealID) {
      return NextResponse.json({ error: "Missing dealID" }, { status: 400 });
    }

    // Call the cached function directly
    const dealDetails = await getDealDetails(dealID)();
    return NextResponse.json(dealDetails);
    
}
