// src/app/api/makes/route.ts
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // derive the true origin (e.g. https://your-app.vercel.app)
    const origin = req.nextUrl.origin;

    // 1) grab our JWT from our own auth route
    const authRes = await fetch(`${origin}/api/auth/token`);
    if (!authRes.ok) {
      const err = await authRes.text();
      throw new Error("Failed to fetch auth token: " + err);
    }
    const { token } = await authRes.json();

    // 2) call CarAPI
    const carRes = await fetch("https://carapi.app/api/makes/v2", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!carRes.ok) {
      const msg = await carRes.text();
      throw new Error("CarAPI /makes error: " + msg);
    }
    const data = await carRes.json();

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
