// File: src/app/api/common-issues/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const { make, model, engine } = await req.json()
    if (!make || !model || !engine) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const prompt = `List the 5 most common engine problems for a ${make} ${model} with engine ${engine}. Provide each as a bullet with a brief description.`
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: 'You are an expert automotive mechanic.' },
        { role: 'user', content: prompt }
      ]
    })

    const text = completion.choices[0].message.content || ''
    const lines = text.split(/\r?\n/).filter(l => l.trim().startsWith('-'))
    const data = lines.map((l, i) => ({
      id: i.toString(),
      description: l.replace(/^[-•]\s*/, '')
    }))

    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
