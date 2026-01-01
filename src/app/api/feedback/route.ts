import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message, rating } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Ahsan AI Hub Feedback <onboarding@resend.dev>',
      to: 'a67515346@gmail.com',
      subject: `[Feedback] ${subject || 'New Feedback'} - Ahsan AI Hub`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; }
              .header { border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
              .header h1 { color: #1e40af; margin: 0; font-size: 24px; }
              .info { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
              .info p { margin: 5px 0; font-size: 14px; }
              .rating { display: inline-block; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; }
              .message { white-space: pre-wrap; background: #fff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; font-size: 15px; }
              .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Feedback Received</h1>
              </div>
              <div class="info">
                <p><strong>From:</strong> ${name || 'Anonymous'} (${email || 'No email provided'})</p>
                <p><strong>Subject:</strong> ${subject || 'General Feedback'}</p>
                ${rating ? `<p><strong>Rating:</strong> <span class="rating">${rating} / 5</span></p>` : ''}
              </div>
              <div class="message">
                ${message}
              </div>
              <div class="footer">
                <p>This feedback was sent from the Ahsan AI Hub platform.</p>
                <p>&copy; 2026 Ahsan AI Hub - Privacy-First AI</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}