import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      carNumber,
      division,
      experience,
      emergencyContact,
      emergencyPhone,
    } = await req.json();

    if (!firstName || !lastName || !email || !carNumber || !division) {
      return NextResponse.json(
        { error: 'First name, last name, email, car number, and division are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('driver_registrations').insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zip: zip || null,
      car_number: carNumber,
      division,
      experience: experience || null,
      emergency_contact: emergencyContact || null,
      emergency_phone: emergencyPhone || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save registration' }, { status: 500 });
    }

    await sendConfirmationEmail({
      to: email,
      subject: 'Driver Registration Received - Vado Speedway Park',
      html: `<p>Hi ${firstName},</p><p>Your driver registration has been received. Please bring a copy of this confirmation and your required documentation to the pit gate on race day.</p><p>Car #${carNumber} - ${division}</p><p>-- Vado Speedway Park</p>`,
    });

    await sendAdminNotification({
      subject: `New Driver Registration: ${firstName} ${lastName} #${carNumber}`,
      html: `<p><strong>Driver:</strong> ${firstName} ${lastName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Car #:</strong> ${carNumber}</p><p><strong>Division:</strong> ${division}</p><p><strong>Experience:</strong> ${experience || 'N/A'}</p><p><strong>Emergency:</strong> ${emergencyContact || 'N/A'} - ${emergencyPhone || 'N/A'}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Driver registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
