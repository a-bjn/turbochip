import { NextResponse } from 'next/server'

interface CarApiEngine {
  trim_id: string
  trim: string
  year: number
  horsepower_hp: number
  torque_ft_lbs: number
}

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
      `${origin}/api/auth/token`
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
    const engines = (json.data as CarApiEngine[]).map((e) => ({
      id: e.trim_id,
      name: `${e.trim} (${e.year})`,
      horsepower: e.horsepower_hp,
      torque: e.torque_ft_lbs,
    }))

    return NextResponse.json({ data: engines })
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error')
    return NextResponse.json(
      { error: 'Unexpected error', details: error.message },
      { status: 500 }
    )
  }
}
