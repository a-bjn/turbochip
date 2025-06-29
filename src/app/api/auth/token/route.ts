// src/app/api/auth/token/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // build the POST to CarAPI’s /api/auth/token
  const res = await fetch("https://carapi.app/api/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/jwt"   // they return a bare JWT string
    },
    body: JSON.stringify({
      api_token: process.env.CARAPI_KEY,
      api_secret: process.env.CARAPI_SECRET,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return NextResponse.json(
      { error: "Auth-token error", details: errText },
      { status: 500 }
    );
  }

  // *** IMPORTANT *** CarAPI returns a raw JWT in the response body
  const token = await res.text();

  return NextResponse.json({ token });
}
