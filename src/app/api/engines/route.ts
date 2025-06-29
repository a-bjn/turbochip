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

interface EngineApi {
  id: number;
  trim: string;
  trim_description: string;
  horsepower_hp: number;
  torque_ft_lbs: number;
}

interface CarApiEnginesResponse {
  collection: CarApiCollection;
  data: EngineApi[];
}

export async function GET(req: NextRequest) {
  const make = req.nextUrl.searchParams.get("make");
  const model = req.nextUrl.searchParams.get("model");
  const year = req.nextUrl.searchParams.get("year");
  if (!make || !model || !year) {
    return NextResponse.json(
      { error: "Missing one of `make`, `model`, or `year` parameters" },
      { status: 400 }
    );
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

    // fetch trims/engines from CarAPI
    const carApiRes = await fetch(
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
    if (!carApiRes.ok) {
      const text = await carApiRes.text();
      return NextResponse.json({ error: "CarAPI/engines error", detail: text }, { status: 500 });
    }

    const json = (await carApiRes.json()) as CarApiEnginesResponse;

    // map into the shape our UI expects
    const mapped = json.data.map((e) => ({
      id: e.id,
      name: e.trim_description,
      horsepower: e.horsepower_hp,
      torque: e.torque_ft_lbs,
    }));

    return NextResponse.json({ data: mapped });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Unexpected error in /api/engines", detail: String(err) },
      { status: 500 }
    );
  }
}
