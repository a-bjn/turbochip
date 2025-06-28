// File: src/app/api/engines/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const make = url.searchParams.get('make')
  const model = url.searchParams.get('model')

  if (!make || !model) {
    return NextResponse.json(
      { error: 'Missing make or model parameter' },
      { status: 400 }
    )
  }

  try {
    // 1) Fetch JWT
    const tokenRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/token`
    )
    const { token } = await tokenRes.json()
    if (!token) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
    }

    // 2) Fetch all engines for make+model (no year filter)
    const carRes = await fetch(
      `https://carapi.app/api/engines/v2?make=${encodeURIComponent(
        make
      )}&model=${encodeURIComponent(model)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )
    if (!carRes.ok) {
      const text = await carRes.text()
      return NextResponse.json({ error: text }, { status: 500 })
    }

    const json = await carRes.json()
    if (!Array.isArray(json.data)) {
      return NextResponse.json({ error: 'Unexpected response' }, { status: 500 })
    }

    // 3) Map to only the fields we need
    const engines = json.data.map((e: any) => ({
      id: e.trim_id,
      name: `${e.trim} (${e.year})`,
      horsepower: e.horsepower_hp,
      torque: e.torque_ft_lbs,
    }))

    return NextResponse.json({ data: engines })
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: err.message },
      { status: 500 }
    )
  }
}
