import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const {
      driverName,
      email,
      phone,
      carNumber,
      division,
      eventName,
      hometown,
    } = await req.json();

    if (!driverName || !email || !carNumber || !division) {
      return NextResponse.json(
        { error: 'Driver name, email, car number, and division are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('entry_forms').insert({
      driver_name: driverName,
      email,
      phone: phone || null,
      car_number: carNumber,
      division,
      event_name: eventName || null,
      hometown: hometown || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
    }

    await sendConfirmationEmail({
      to: email,
      subject: 'Entry Form Received - Vado Speedway Park',
      html: `<p>Hi ${driverName},</p><p>Your entry form has been received${eventName ? ` for ${eventName}` : ''}.</p><p>Car #${carNumber} - ${division}</p><p>-- Vado Speedway Park</p>`,
    });

    await sendAdminNotification({
      subject: `New Entry Form: ${driverName} #${carNumber}`,
      html: `<p><strong>Driver:</strong> ${driverName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Car #:</strong> ${carNumber}</p><p><strong>Division:</strong> ${division}</p><p><strong>Event:</strong> ${eventName || 'N/A'}</p><p><strong>Hometown:</strong> ${hometown || 'N/A'}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Entry form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
