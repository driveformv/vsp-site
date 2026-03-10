import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { company, contact, email, phone, message } = await req.json();

    if (!company || !contact || !email) {
      return NextResponse.json(
        { error: 'Company, contact name, and email are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('sponsor_inquiries').insert({
      company,
      contact_name: contact,
      email,
      phone: phone || null,
      message: message || null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save inquiry' }, { status: 500 });
    }

    await sendConfirmationEmail({
      to: email,
      subject: 'Sponsorship Inquiry Received - Vado Speedway Park',
      html: `<p>Hi ${contact},</p><p>Thanks for your interest in sponsoring Vado Speedway Park. We received your inquiry and our sponsorship team will be in touch shortly.</p><p>-- Vado Speedway Park</p>`,
    });

    await sendAdminNotification({
      subject: `New Sponsor Inquiry: ${company}`,
      html: `<p><strong>Company:</strong> ${company}</p><p><strong>Contact:</strong> ${contact}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Message:</strong> ${message || 'N/A'}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sponsor inquiry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
