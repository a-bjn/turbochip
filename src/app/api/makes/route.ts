// File: src/app/api/makes/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Step 1: Fetch the JWT token from our internal auth route
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/token`)
    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || !tokenData.token) {
      return NextResponse.json({ error: 'Failed to retrieve token' }, { status: 500 })
    }

    const token = tokenData.token

    // Step 2: Use the token to fetch makes from CarAPI
    const carApiRes = await fetch('https://carapi.app/api/makes/v2', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      }
    })

    if (!carApiRes.ok) {
      const msg = await carApiRes.text()
      return NextResponse.json({ error: 'CarAPI error', message: msg }, { status: 500 })
    }

    const data = await carApiRes.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error', details: String(error) }, { status: 500 })
  }
}