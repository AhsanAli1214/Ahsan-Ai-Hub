import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, feedback, type, rating } = await req.json();

    if (!feedback) {
      return NextResponse.json({ error: 'Feedback content is required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Ahsan AI Hub <feedback@ahsan-ai-hub.p.tawk.email>',
      to: ['a67515346@gmail.com'],
      subject: `New ${type} Feedback from ${name || 'Anonymous'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 40px; background: #ffffff; border-radius: 24px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
            .logo { font-size: 24px; font-weight: 900; color: #3b82f6; letter-spacing: -0.025em; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 24px; }
            .badge-feature { background: #dbeafe; color: #1e40af; }
            .badge-bug { background: #fee2e2; color: #991b1b; }
            .badge-other { background: #f3f4f6; color: #374151; }
            h1 { font-size: 28px; font-weight: 800; margin: 0 0 12px 0; color: #111827; }
            .rating { font-size: 20px; color: #f59e0b; margin-bottom: 24px; }
            .content { font-size: 16px; color: #4b5563; background: #f9fafb; padding: 24px; border-radius: 16px; border: 1px solid #f3f4f6; margin-bottom: 32px; }
            .footer { border-top: 1px solid #f3f4f6; padding-top: 24px; font-size: 14px; color: #9ca3af; }
            .info-item { margin-bottom: 8px; }
            .info-label { font-weight: 600; color: #374151; width: 80px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <span class="logo">Ahsan Ai Hub</span>
            </div>
            
            <div class="badge ${type === 'Bug Report' ? 'badge-bug' : type === 'Feature Request' ? 'badge-feature' : 'badge-other'}">
              ${type}
            </div>
            
            <h1>New Submission from ${name || 'Anonymous'}</h1>
            
            <div class="rating">
              ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}
            </div>

            <div class="content">
              ${feedback.replace(/\n/g, '<br>')}
            </div>

            <div class="footer">
              <div class="info-item">
                <span class="info-label">From:</span> ${name || 'Anonymous'}
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span> ${email || 'Not provided'}
              </div>
              <div class="info-item">
                <span class="info-label">Date:</span> ${new Date().toLocaleString()}
              </div>
              <div style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                Sent via Ahsan AI Hub automated feedback system.
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
