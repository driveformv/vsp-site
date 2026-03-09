import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

let supabase
let API_KEY
let SCHEDULE_ID

function init() {
  if (!supabase) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    API_KEY = process.env.MYRACEPASS_API_KEY
    SCHEDULE_ID = process.env.MYRACEPASS_SCHEDULE_ID
  }
}

export async function GET(request) {
  init()
  console.log('Starting MyRacePass sync...')

  try {
    await logSyncStatus('sync_start', 'running', null, 0)

    console.log('Fetching events...')
    const eventsResult = await fetchAndStoreEvents()

    console.log('Fetching results...')
    const resultsResult = await fetchAndStoreResults()

    console.log('Fetching points...')
    const pointsResult = await fetchAndStorePoints()

    const totalRecords = eventsResult.count + resultsResult.count + pointsResult.count
    await logSyncStatus('sync_complete', 'success', null, totalRecords)

    console.log('Sync completed successfully')

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: { events: eventsResult, results: resultsResult, points: pointsResult },
      totalRecords
    })

  } catch (error) {
    console.error('Sync failed:', error)
    await logSyncStatus('sync_error', 'error', error.message, 0)

    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request) {
  return GET(request)
}

async function fetchAndStoreEvents() {
  const url = `https://api.myracepass.com/v2/schedules/events/?key=${API_KEY}&ScheduleId=${SCHEDULE_ID}`

  const response = await fetch(url, {
    headers: { 'User-Agent': 'Vercel-Function/1.0', 'Accept': 'application/json' }
  })

  if (!response.ok) throw new Error(`Events API failed: HTTP ${response.status}`)

  const data = await response.json()
  if (!data.ScheduleEvents || !Array.isArray(data.ScheduleEvents)) {
    throw new Error('Invalid events data structure')
  }

  const events = data.ScheduleEvents
  console.log(`Found ${events.length} events`)
  let processedCount = 0

  for (const event of events) {
    try {
      const { error: eventError } = await supabase
        .from('events')
        .upsert({
          event_id: parseInt(event.EventId),
          event_name: event.EventName,
          event_date: event.EventDate,
          event_description: event.EventDescription || ''
        }, { onConflict: 'event_id' })

      if (eventError) { console.error(`Error storing event ${event.EventId}:`, eventError); continue }
      processedCount++

      if (event.Classes && Array.isArray(event.Classes)) {
        for (const cls of event.Classes) {
          const { error: classError } = await supabase
            .from('classes')
            .upsert({
              class_id: parseInt(cls.ClassId),
              class_name: cls.ClassName,
              class_name_override: cls.ClassNameOverride || ''
            }, { onConflict: 'class_id' })
          if (classError) console.error(`Error storing class ${cls.ClassId}:`, classError)
        }
      }
    } catch (error) {
      console.error(`Error processing event ${event.EventId}:`, error)
    }
  }

  console.log(`Processed ${processedCount} of ${events.length} events`)
  return { success: true, count: processedCount }
}

async function fetchAndStoreResults() {
  const { data: allEvents, error: eventsError } = await supabase
    .from('events')
    .select('event_id, event_name, event_date')
    .order('event_date', { ascending: false })

  if (eventsError) throw new Error(`Failed to get events: ${eventsError.message}`)
  if (!allEvents || allEvents.length === 0) {
    console.log('No events to fetch results for')
    return { success: true, count: 0 }
  }

  console.log(`Fetching results for all ${allEvents.length} events`)
  let storedCount = 0

  for (const event of allEvents) {
    try {
      const url = `https://api.myracepass.com/v2/schedules/results/?key=${API_KEY}&EventId=${event.event_id}`
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Vercel-Function/1.0', 'Accept': 'application/json' }
      })

      if (!response.ok) { console.log(`Results API failed for event ${event.event_id}: HTTP ${response.status}`); continue }

      const data = await response.json()
      if (!data.Classes || !Array.isArray(data.Classes)) continue

      const processedData = {
        ...data,
        Classes: data.Classes.map(cls => ({
          ...cls,
          Results: cls.Results ? cls.Results.map(result => ({
            ...result,
            DriverName: result.Driver && result.Driver[0]
              ? `${result.Driver[0].DriverFName || ''} ${result.Driver[0].DriverLName || ''}`.trim()
              : result.DriverName || 'Unknown'
          })) : []
        }))
      }

      const { error: resultsError } = await supabase
        .from('results')
        .upsert({
          event_id: event.event_id,
          event_name: event.event_name,
          event_date: event.event_date,
          results_data: processedData
        }, { onConflict: 'event_id' })

      if (resultsError) { console.error(`Error storing results for event ${event.event_id}:`, resultsError); continue }
      storedCount++
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`Error processing results for event ${event.event_id}:`, error)
    }
  }

  console.log(`Stored results for ${storedCount} events`)
  return { success: true, count: storedCount }
}

async function fetchAndStorePoints() {
  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('class_id, class_name')

  if (classesError) throw new Error(`Failed to get classes: ${classesError.message}`)
  if (!classes || classes.length === 0) {
    console.log('No classes found for points fetching')
    return { success: true, count: 0 }
  }

  console.log(`Fetching points for ${classes.length} classes`)
  let storedCount = 0

  for (const cls of classes) {
    try {
      const url = `https://api.myracepass.com/v2/points/?key=${API_KEY}&ScheduleId=${SCHEDULE_ID}&ClassId=${cls.class_id}`
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Vercel-Function/1.0', 'Accept': 'application/json' }
      })

      if (!response.ok) { console.log(`Points API failed for class ${cls.class_id}: HTTP ${response.status}`); continue }

      let responseText = await response.text()
      responseText = responseText.replace(/,,/g, ',')
      const data = JSON.parse(responseText)

      if (data.RequestValid !== 1 || !data.Points || data.Points.length === 0) continue

      const processedPoints = data.Points.map(point => ({
        ...point,
        DriverName: point.Driver && point.Driver[0]
          ? `${point.Driver[0].DriverFName} ${point.Driver[0].DriverLName}`.trim()
          : 'Unknown',
        Points: point.PointTotal || 0
      }))

      const { error: pointsError } = await supabase
        .from('points')
        .upsert({
          class_id: cls.class_id,
          class_name: cls.class_name,
          points_data: processedPoints,
          points_as_of: data.PointsAsOf || new Date().toISOString().split('T')[0]
        }, { onConflict: 'class_id' })

      if (pointsError) { console.error(`Error storing points for class ${cls.class_id}:`, pointsError); continue }
      storedCount++
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`Error processing points for class ${cls.class_id}:`, error)
    }
  }

  console.log(`Stored points for ${storedCount} classes`)
  return { success: true, count: storedCount }
}

async function logSyncStatus(dataType, status, errorMessage, recordsUpdated) {
  try {
    await supabase.from('sync_status').insert({
      data_type: dataType,
      last_sync: new Date().toISOString(),
      status: status,
      error_message: errorMessage,
      records_updated: recordsUpdated
    })
  } catch (error) {
    console.error('Failed to log sync status:', error)
  }
}
