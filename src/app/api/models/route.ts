import { NextResponse } from 'next/server'

interface CarModel {
  name: string
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const make = url.searchParams.get('make')
  if (!make) {
    return NextResponse.json({ error: 'Missing make parameter' }, { status: 400 })
  }

  try {
    // 1️⃣ Get JWT token
    const tokenRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://turbochip.vercel.app'}/api/auth/token`
    )
    const tokenJson = await tokenRes.json()
    const token = tokenJson.token
    if (!token) {
      return NextResponse.json({ error: 'Failed to retrieve token' }, { status: 500 })
    }

    // 2️⃣ Fetch models from CarAPI v2 with the make filter
    const carApiRes = await fetch(
      `https://carapi.app/api/models/v2?make=${encodeURIComponent(make)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )
    if (!carApiRes.ok) {
      const msg = await carApiRes.text()
      return NextResponse.json({ error: 'CarAPI error', message: msg }, { status: 500 })
    }

    // 3️⃣ Parse response and extract model names
    const json = await carApiRes.json()
    if (!Array.isArray(json.data)) {
      return NextResponse.json({ error: 'Invalid models format' }, { status: 500 })
    }
    const models = (json.data as CarModel[]).map(item => item.name)

    // 4️⃣ Return the names list
    return NextResponse.json({ data: models })
  } catch (error) {
    return NextResponse.json({ error: 'Unexpected error', details: String(error) }, { status: 500 })
  }
}
