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
      from: 'Ahsan AI Hub <onboarding@resend.dev>',
      to: 'a67515346@gmail.com',
      subject: `⭐ ${rating || '0'}/5 Feedback: ${subject || 'New Message'}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
              body { font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; }
              .wrapper { padding: 40px 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
              .header { background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 40px 30px; text-align: center; color: white; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.025em; text-transform: uppercase; }
              .content { padding: 40px 30px; }
              .rating-badge { display: inline-block; background: #eff6ff; color: #1e40af; padding: 8px 16px; border-radius: 12px; font-weight: 800; font-size: 14px; margin-bottom: 24px; border: 1px solid #dbeafe; }
              .user-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; border-bottom: 1px solid #f3f4f6; padding-bottom: 30px; }
              .info-label { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 4px; }
              .info-value { font-size: 14px; font-weight: 700; color: #111827; }
              .message-box { background: #f9fafb; border-radius: 16px; padding: 25px; border: 1px solid #f3f4f6; }
              .message-text { font-size: 16px; color: #374151; white-space: pre-wrap; line-height: 1.8; }
              .footer { padding: 30px; background: #f9fafb; text-align: center; border-top: 1px solid #f3f4f6; }
              .footer p { margin: 0; font-size: 12px; color: #9ca3af; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="header">
                  <h1>Ahsan AI Hub Feedback</h1>
                </div>
                <div class="content">
                  ${rating ? `<div class="rating-badge">EXPERIENCE RATING: ${rating} / 5</div>` : ''}
                  
                  <div class="user-info">
                    <div>
                      <div class="info-label">Sender</div>
                      <div class="info-value">${name || 'Anonymous User'}</div>
                    </div>
                    <div>
                      <div class="info-label">Email Address</div>
                      <div class="info-value">${email || 'Not provided'}</div>
                    </div>
                  </div>

                  <div class="info-label" style="margin-bottom: 12px;">Message Content</div>
                  <div class="message-box">
                    <div class="message-text">${message}</div>
                  </div>
                </div>
                <div class="footer">
                  <p>SENT VIA AHSAN AI HUB PLATFORM</p>
                  <p style="margin-top: 8px;">&copy; 2026 Ahsan Ali Wadani. All rights reserved.</p>
                </div>
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