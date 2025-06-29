import { NextResponse } from "next/server";

interface CarApiCollection {
  url: string;
  count: number;
  pages: number;
  total: number;
  next: string;
  prev: string;
  first: string;
  last: string;
}

interface Make {
  id: number;
  name: string;
}

interface CarApiMakesResponse {
  collection: CarApiCollection;
  data: Make[];
}

export async function GET() {
  try {
    // derive our own origin so this works on Vercel
    const origin = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // 1️⃣ fetch our JWT from /api/auth/token
    const tokenRes = await fetch(`${origin}/api/auth/token`);
    if (!tokenRes.ok) {
      return NextResponse.json({ error: "Failed to fetch auth token" }, { status: 500 });
    }
    const tokenJson = (await tokenRes.json()) as { token?: string };
    if (!tokenJson.token) {
      return NextResponse.json({ error: "Auth token missing in response" }, { status: 500 });
    }
    const token = tokenJson.token;

    // 2️⃣ call CarAPI /makes/v2
    const carApiRes = await fetch("https://carapi.app/api/makes/v2", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (!carApiRes.ok) {
      const text = await carApiRes.text();
      return NextResponse.json({ error: "CarAPI/makes error", detail: text }, { status: 500 });
    }

    // 3️⃣ parse & return
    const json = (await carApiRes.json()) as CarApiMakesResponse;
    return NextResponse.json(json);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Unexpected error in /api/makes", detail: String(err) },
      { status: 500 }
    );
  }
}
