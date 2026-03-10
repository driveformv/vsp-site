import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('contact_submissions').insert({
      name,
      email,
      message,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }

    await sendConfirmationEmail({
      to: email,
      subject: 'We received your message - Vado Speedway Park',
      html: `<p>Hi ${name},</p><p>Thanks for reaching out to Vado Speedway Park. We received your message and will get back to you as soon as possible.</p><p>-- Vado Speedway Park</p>`,
    });

    await sendAdminNotification({
      subject: `New Contact Form: ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
