// src/app/api/auth/token/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://carapi.app/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_token: process.env.CARAPI_KEY,
      api_secret: process.env.CARAPI_SECRET,
    }),
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Failed to authenticate with CarAPI' },
      { status: 500 }
    )
  }

  // Read raw token string
  const token = (await res.text()).trim()

  return NextResponse.json({ token })
}
