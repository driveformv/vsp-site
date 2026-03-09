**Addendum: AI Event Validation**

Claude SDK Integration for Sanity Studio

Supplement to: Vado Speedway Park Website Rebuild Plan \| March 2026

**1. Problem**

The VSP team occasionally enters event data with day/date mismatches ---
for example, an event titled \'Race Saturday\' where the actual date
field is a Friday. These mistakes go live on the site and cause fan
confusion. Other common errors include gate times that don\'t make
logical sense, missing ticket links for paid events, and race class
typos.

Adding an AI validation step inside Sanity Studio catches these issues
before the content ever publishes, without adding friction to the
team\'s workflow.

**2. Solution Overview**

  --------------------- -------------------------------------------------
  **Where it lives**    Sanity Studio --- custom Document Action button

  **When it runs**      Team clicks \'Validate Event\' before hitting
                        Publish

  **What it uses**      Anthropic Claude SDK (claude-haiku for speed and
                        cost)

  **What it returns**   List of issues with severity --- warnings don\'t
                        block, errors do

  **Who sees it**       Only the editor inside Studio, not public-facing

  **API route**         Next.js /api/validate-event --- keeps API key
                        server-side
  --------------------- -------------------------------------------------

**3. What It Catches**

**Day/Date Mismatches**

- Title says \'Race Saturday\' but date field is a Friday

- Description mentions \'this Friday\' but event is on a Saturday

- Month name in title doesn\'t match date (e.g. \'April Classic\' in
  May)

**Time Logic Errors**

- Races start time is before front gates open

- Front gates open before pit gates

- Times entered as AM when all VSP events are PM

**Missing or Inconsistent Data**

- Paid event (admission fee mentioned) but no ticket link

- External event type selected but no external URL provided

- Race classes list is empty on a weekly racing event

- Event image not uploaded

**Obvious Typos**

- Sponsor or class name looks garbled or incomplete

- Admission price looks malformed (e.g. \'\$\' with no number)

**4. Implementation**

**4.1 --- API Route**

The Claude API call lives in a Next.js server-side API route. The API
key never touches the browser.

// app/api/validate-event/route.ts

import Anthropic from \'@anthropic-ai/sdk\'

import { NextRequest, NextResponse } from \'next/server\'

const client = new Anthropic()

export async function POST(req: NextRequest) {

const event = await req.json()

const eventDate = new Date(event.date)

const dayName = eventDate.toLocaleDateString(\'en-US\', { weekday:
\'long\' })

// e.g. \'Friday\'

const prompt = \`

You are validating a race event for Vado Speedway Park.

The actual date is \${eventDate.toDateString()} which is a \${dayName}.

Event data:

\- Title: \${event.title}

\- Admission info: \${event.admissionInfo}

\- Pit Gates: \${event.pitGatesTime}

\- Front Gates: \${event.frontGatesTime}

\- Races Start: \${event.racesTime}

\- Ticket link: \${event.ticketLink \|\| \'none\'}

\- Event type: \${event.eventType}

\- External URL: \${event.externalUrl \|\| \'none\'}

\- Race classes count: \${event.raceClasses?.length \|\| 0}

\- Has image: \${!!event.image}

Check for issues. Return ONLY valid JSON:

{

\"isValid\": boolean,

\"issues\": \[{ \"severity\": \"error\"\|\"warning\", \"message\":
string }\]

}

\`

const response = await client.messages.create({

model: \'claude-haiku-4-5-20251001\',

max_tokens: 500,

messages: \[{ role: \'user\', content: prompt }\]

})

const text = response.content\[0\].type === \'text\'

? response.content\[0\].text : \'{}\'

const result = JSON.parse(text)

return NextResponse.json(result)

}

**4.2 --- Sanity Document Action**

This adds a \'Validate Event\' button to the Studio toolbar. When
clicked it calls the API route and shows results inline.

// sanity/actions/validateEvent.ts

import { useCallback, useState } from \'react\'

import { DocumentActionProps, useToast } from \'sanity\'

export function ValidateEventAction(props: DocumentActionProps) {

const \[loading, setLoading\] = useState(false)

const toast = useToast()

const handleValidate = useCallback(async () =\> {

setLoading(true)

try {

const res = await fetch(\'/api/validate-event\', {

method: \'POST\',

headers: { \'Content-Type\': \'application/json\' },

body: JSON.stringify(props.draft \|\| props.published),

})

const result = await res.json()

if (result.isValid) {

toast.push({ status: \'success\', title: \'Event looks good --- no
issues found\' })

} else {

result.issues.forEach((issue: any) =\> {

toast.push({

status: issue.severity === \'error\' ? \'error\' : \'warning\',

title: issue.message,

duration: 8000,

})

})

}

} catch (e) {

toast.push({ status: \'error\', title: \'Validation failed\' })

} finally {

setLoading(false)

}

}, \[props.draft, props.published\])

return {

label: loading ? \'Validating\...\' : \'Validate Event\',

onHandle: handleValidate,

disabled: loading,

}

}

**4.3 --- Register the Action in sanity.config.ts**

Wire up the action so it only appears on event documents, not all
content types.

// sanity.config.ts

import { ValidateEventAction } from \'./sanity/actions/validateEvent\'

export default defineConfig({

// \... existing config

document: {

actions: (prev, context) =\> {

if (context.schemaType === \'event\') {

return \[ValidateEventAction, \...prev\]

}

return prev

}

}

})

**5. Cost & Model Choice**

  --------------------- -------------------------------------------------
  **Model**             claude-haiku-4-5-20251001 --- fastest and
                        cheapest, more than enough for validation

  **Tokens per call**   \~400 input + \~150 output = \~550 tokens per
                        validation

  **Cost per            Fraction of a cent --- negligible
  validation**          

  **When it runs**      Only when team manually clicks Validate --- not
                        on every keystroke

  **API key location**  Server-side only in .env.local / Vercel env vars
                        --- never exposed to browser
  --------------------- -------------------------------------------------

**6. Team Workflow With Validation**

1.  Team fills out event in Sanity Studio as normal

2.  Before publishing, clicks \'Validate Event\' button in the toolbar

3.  Claude checks the data and shows results as toast notifications in
    Studio

4.  Green toast = all good, hit Publish

5.  Yellow/red toasts = specific issues listed --- fix them and validate
    again

6.  Team can still publish with warnings --- validation is advisory, not
    a hard block

**7. Future Enhancements**

- Extend validation to news posts --- check that race results mention
  correct date/classes

- Auto-suggest event description based on race classes and event type

- Flag duplicate events --- same date already exists in Sanity

- Send Resend email to Hector if a post-validate publish still has
  errors

**MVT Marketing & Communications**

Supplement to: Vado Speedway Park Website Rebuild Plan \| March 2026
