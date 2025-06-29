import { NextResponse, type NextRequest } from "next/server";

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

interface Model {
  id: number;
  make_id: number;
  make: string;
  name: string;
}

interface CarApiModelsResponse {
  collection: CarApiCollection;
  data: Model[];
}

export async function GET(req: NextRequest) {
  const make = req.nextUrl.searchParams.get("make");
  if (!make) {
    return NextResponse.json({ error: "Missing `make` query parameter" }, { status: 400 });
  }

  try {
    const origin = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const tokenRes = await fetch(`${origin}/api/auth/token`);
    if (!tokenRes.ok) {
      return NextResponse.json({ error: "Failed to fetch auth token" }, { status: 500 });
    }
    const tokenJson = (await tokenRes.json()) as { token?: string };
    if (!tokenJson.token) {
      return NextResponse.json({ error: "Auth token missing in response" }, { status: 500 });
    }
    const token = tokenJson.token;

    // fetch models for that make
    const carApiRes = await fetch(
      `https://carapi.app/api/models/v2?make=${encodeURIComponent(make)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    if (!carApiRes.ok) {
      const text = await carApiRes.text();
      return NextResponse.json({ error: "CarAPI/models error", detail: text }, { status: 500 });
    }

    const json = (await carApiRes.json()) as CarApiModelsResponse;
    // return just the array of names
    const names = json.data.map((m) => m.name).sort();
    return NextResponse.json({ data: names });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Unexpected error in /api/models", detail: String(err) },
      { status: 500 }
    );
  }
}
