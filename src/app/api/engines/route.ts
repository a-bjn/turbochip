// File: src/app/api/engines/route.ts
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const make = url.searchParams.get("make");
  const model = url.searchParams.get("model");
  const year = url.searchParams.get("year");

  if (!make || !model || !year) {
    return NextResponse.json(
      { error: "Missing one of `make`, `model`, or `year`" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ origin
    const origin = url.origin;

    // 2️⃣ auth token
    const authRes = await fetch(`${origin}/api/auth/token`);
    if (!authRes.ok) {
      const err = await authRes.text();
      throw new Error("Auth error: " + err);
    }
    const { token } = await authRes.json();

    // 3️⃣ CarAPI engines/v2
    const carRes = await fetch(
      `https://carapi.app/api/engines/v2?make=${encodeURIComponent(
        make
      )}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    if (!carRes.ok) {
      const msg = await carRes.text();
      throw new Error("CarAPI /engines error: " + msg);
    }
    const data = await carRes.json();

    // 4️⃣ forward
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
