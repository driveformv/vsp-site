import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  let event: Record<string, unknown>
  try {
    event = await req.json()
  } catch {
    return NextResponse.json(
      { isValid: false, issues: [{ severity: 'error', message: 'Invalid request body' }] },
      { status: 400 }
    )
  }

  if (!event.title || !event.date) {
    return NextResponse.json(
      { isValid: false, issues: [{ severity: 'error', message: 'Missing required fields: title, date' }] },
      { status: 400 }
    )
  }

  const eventDate = new Date(event.date as string)
  if (isNaN(eventDate.getTime())) {
    return NextResponse.json(
      { isValid: false, issues: [{ severity: 'error', message: 'Invalid date format' }] },
      { status: 400 }
    )
  }

  const dayName = eventDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'America/Denver' })

  const prompt = `
You are validating a race event for Vado Speedway Park.

The actual date is ${eventDate.toDateString()} which is a ${dayName}.

Event data:
- Title: ${String(event.title || '').slice(0, 200)}
- Admission info: ${String(event.admissionInfo || 'none').slice(0, 500)}
- Gate Time: ${String(event.gateTime || 'none').slice(0, 50)}
- Race Time: ${String(event.raceTime || 'none').slice(0, 50)}
- Ticket link: ${String(event.ticketLink || 'none').slice(0, 200)}
- Event type: ${String(event.eventType || 'none').slice(0, 50)}
- Status: ${String(event.status || 'none').slice(0, 50)}
- Featured: ${!!event.isFeatured}
- External URL: ${String(event.externalUrl || 'none').slice(0, 200)}
- Race classes count: ${Array.isArray(event.raceClasses) ? event.raceClasses.length : 0}
- Has image: ${!!event.image}

Check for issues. Return ONLY valid JSON:
{
  "isValid": boolean,
  "issues": [{ "severity": "error"|"warning", "message": string }]
}
`

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = response.content[0].type === 'text'
      ? response.content[0].text : ''

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { isValid: false, issues: [{ severity: 'warning', message: 'Validation service returned unparseable response' }] }
      )
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (err) {
    console.error('Event validation failed:', err)
    return NextResponse.json(
      { isValid: false, issues: [{ severity: 'warning', message: 'Validation service temporarily unavailable' }] },
      { status: 502 }
    )
  }
}
