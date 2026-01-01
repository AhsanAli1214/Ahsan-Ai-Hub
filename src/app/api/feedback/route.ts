import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { rating, feedback, email } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Ahsan AI Hub <feedback@ahsan-ai-hub.vercel.app>',
      to: ['a67515346@gmail.com'],
      subject: `New Feedback: ${rating} Stars - Ahsan AI Hub`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #f9fafb; border-radius: 24px;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 32px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #1e1b4b; font-size: 28px; font-weight: 800; margin-bottom: 24px; text-align: center;">New Website Feedback</h1>
            
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; border-radius: 9999px; font-weight: 800; font-size: 20px;">
                ${rating} / 5 Stars
              </div>
            </div>

            <div style="margin-bottom: 32px;">
              <h2 style="color: #64748b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">User Feedback</h2>
              <p style="color: #1e293b; font-size: 16px; line-height: 1.6; background-color: #f1f5f9; padding: 20px; border-radius: 16px; margin: 0;">
                ${feedback || 'No comments provided.'}
              </p>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                <strong>User Email:</strong> ${email || 'Anonymous'}
              </p>
              <p style="color: #64748b; font-size: 14px; margin: 8px 0 0 0;">
                <strong>Submitted At:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
          
          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 24px;">
            This feedback was sent from the Ahsan AI Hub Feedback System.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
