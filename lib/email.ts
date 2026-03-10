import { Resend } from 'resend';

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return null;
    resend = new Resend(key);
  }
  return resend;
}

const FROM_EMAIL = 'Vado Speedway Park <noreply@vadospeedwaypark.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@vadospeedwaypark.com';

export async function sendConfirmationEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const r = getResend();
  if (!r) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return null;
  }

  return r.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

export async function sendAdminNotification({
  subject,
  html,
}: {
  subject: string;
  html: string;
}) {
  const r = getResend();
  if (!r) {
    console.warn('RESEND_API_KEY not set, skipping admin notification');
    return null;
  }

  return r.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject,
    html,
  });
}
