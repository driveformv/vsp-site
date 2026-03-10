import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, interests } = await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('fan_program_signups').insert({
      name,
      email,
      phone: phone || null,
      interests: interests || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save signup' }, { status: 500 });
    }

    await sendConfirmationEmail({
      to: email,
      subject: 'Welcome to the Fan Program - Vado Speedway Park',
      html: `<p>Hi ${name},</p><p>You are now signed up for the Vado Speedway Park Fan Program. You will receive exclusive updates, promotions, and early access to special event tickets.</p><p>-- Vado Speedway Park</p>`,
    });

    await sendAdminNotification({
      subject: `New Fan Program Signup: ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Interests:</strong> ${interests || 'N/A'}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Fan program error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
