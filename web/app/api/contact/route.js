const API_BASE = 'https://api.mail.hostinger.com/api/v1';

const SUBJECT_TAGS = {
  listing: 'List my business - venue listing',
  feedback: 'Feedback -',
  other: 'Message -',
};

function escapeHtml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: bots fill this invisible field, humans never see it
  if (data.company) {
    return Response.json({ ok: true });
  }

  const topic = SUBJECT_TAGS[data.topic] ? data.topic : 'other';
  const name = String(data.name || '').trim().slice(0, 100);
  const email = String(data.email || '').trim().slice(0, 200);
  const business = String(data.business || '').trim().slice(0, 200);
  const website = String(data.website || '').trim().slice(0, 300);
  const message = String(data.message || '').trim().slice(0, 4000);

  if (!name || !email || !message) {
    return Response.json({ ok: false, error: 'Name, email and message are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const token = process.env.HOSTINGER_MAIL_TOKEN;
  const mailboxId = process.env.HOSTINGER_MAIL_FEEDBACK_ID;
  if (!token || !mailboxId) {
    console.error('Contact form: missing HOSTINGER_MAIL_TOKEN or HOSTINGER_MAIL_FEEDBACK_ID');
    return Response.json({ ok: false, error: 'Mail is not configured yet. Please email us directly.' }, { status: 500 });
  }

  const subject = `[torontobirthdayparties.com] ${SUBJECT_TAGS[topic]} ${topic === 'feedback' || topic === 'other' ? `from ${name}` : business || name}`;

  const textLines = [
    `From: ${name} <${email}>`,
    business ? `Business: ${business}` : null,
    website ? `Website: ${website}` : null,
    `Topic: ${topic}`,
    '',
    message,
    '',
    '---',
    `Sent via the contact form on torontobirthdayparties.com/contact`,
  ].filter((l) => l !== null);

  const htmlBody = [
    `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`,
    business ? `<p><strong>Business:</strong> ${escapeHtml(business)}</p>` : '',
    website ? `<p><strong>Website:</strong> ${escapeHtml(website)}</p>` : '',
    `<p><strong>Topic:</strong> ${escapeHtml(topic)}</p>`,
    `<hr>`,
    `<p>${escapeHtml(message).replaceAll('\n', '<br>')}</p>`,
  ].join('');

  try {
    const res = await fetch(`${API_BASE}/mailboxes/${mailboxId}/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: ['feedback@torontobirthdayparties.com'],
        displayName: `Contact Form (${name})`,
        subject: subject.slice(0, 250),
        text: textLines.join('\n'),
        html: htmlBody,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('Hostinger send failed:', res.status, body.slice(0, 500));
      return Response.json({ ok: false, error: 'Could not send right now. Please try again or email us directly.' }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return Response.json({ ok: false, error: 'Could not send right now. Please try again or email us directly.' }, { status: 502 });
  }
}
