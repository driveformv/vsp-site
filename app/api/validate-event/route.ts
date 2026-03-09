import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const event = await req.json()

  const eventDate = new Date(event.date)
  const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long' })

  const prompt = `
You are validating a race event for Vado Speedway Park.

The actual date is ${eventDate.toDateString()} which is a ${dayName}.

Event data:
- Title: ${event.title}
- Admission info: ${event.admissionInfo}
- Pit Gates: ${event.pitGatesTime}
- Front Gates: ${event.frontGatesTime}
- Races Start: ${event.racesTime}
- Ticket link: ${event.ticketLink || 'none'}
- Event type: ${event.eventType}
- External URL: ${event.externalUrl || 'none'}
- Race classes count: ${event.raceClasses?.length || 0}
- Has image: ${!!event.image}

Check for issues. Return ONLY valid JSON:
{
  "isValid": boolean,
  "issues": [{ "severity": "error"|"warning", "message": string }]
}
`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = response.content[0].type === 'text'
    ? response.content[0].text : '{}'

  const result = JSON.parse(text)

  return NextResponse.json(result)
}
