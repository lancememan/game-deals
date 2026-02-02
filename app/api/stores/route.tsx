import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = await fetch("https://www.cheapshark.com/api/1.0/stores");
  const data = await res.json();

  return NextResponse.json(data);
}