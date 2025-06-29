// File: src/app/api/models/route.ts
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const make = req.nextUrl.searchParams.get("make");
  if (!make) {
    return NextResponse.json(
      { error: "Missing `make` query parameter" },
      { status: 400 }
    );
  }

  try {
    // 1️⃣ derive true origin (so this works on Vercel, not just localhost)
    const origin = req.nextUrl.origin;

    // 2️⃣ grab our JWT
    const authRes = await fetch(`${origin}/api/auth/token`);
    if (!authRes.ok) {
      const err = await authRes.text();
      throw new Error("Auth error: " + err);
    }
    const { token } = await authRes.json();

    // 3️⃣ call CarAPI models/v2
    const carRes = await fetch(
      `https://carapi.app/api/models/v2?make=${encodeURIComponent(make)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    if (!carRes.ok) {
      const msg = await carRes.text();
      throw new Error("CarAPI /models error: " + msg);
    }
    const data = await carRes.json();

    // 4️⃣ send it back
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
