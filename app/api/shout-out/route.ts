import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { sendAdminNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { name, email, recipientName, message } = await req.json();

    if (!name || !email || !recipientName || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase.from('shout_out_requests').insert({
      submitter_name: name,
      submitter_email: email,
      recipient_name: recipientName,
      message,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save request' }, { status: 500 });
    }

    await sendAdminNotification({
      subject: `New Shout Out Request for ${recipientName}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>For:</strong> ${recipientName}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Shout out error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
