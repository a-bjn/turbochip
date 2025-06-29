// File: src/app/api/diagnostics/route.ts
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You’re an automotive expert. Diagnose car issues.',
        },
        {
          role: 'user',
          content: `Given the symptom: "${prompt}", reply in JSON with:
{
  "title": "<a brief issue title>",
  "urgency": "Low|Medium|High",
  "description": "<one-sentence summary>",
  "causes": ["…","…","…"],
  "solutions": ["…","…","…"]
}`,
        },
      ],
    })

    const text = chat.choices[0].message.content!
    // parse into a strongly-typed shape
    const data = JSON.parse(text) as {
      title: string
      urgency: 'Low' | 'Medium' | 'High'
      description: string
      causes: string[]
      solutions: string[]
    }

    return NextResponse.json(data)
  } catch (err: unknown) {
    // Narrow the error to a string message
    const message =
      err instanceof Error
        ? err.message
        : 'An unknown error occurred'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
