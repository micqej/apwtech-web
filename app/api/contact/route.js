import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, company, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'APW-TECH Web <onboarding@resend.dev>',
      to: 'apwtech@apwtech.sk',
      replyTo: email,
      subject: `Správa z webu od ${name}${company ? ` (${company})` : ''}`,
      text: `Meno: ${name}\nEmail: ${email}${company ? `\nSpoločnosť: ${company}` : ''}\n\nSpráva:\n${message}`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
