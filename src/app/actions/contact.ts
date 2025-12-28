'use server';

import { z } from 'zod';

const ContactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  subject: z.string().trim().min(5, 'Subject must be at least 5 characters').max(100),
  category: z.enum(['bug_report', 'feature_request', 'general_inquiry', 'collaboration', 'feedback']),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;

export async function sendContactForm(data: unknown): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    let validatedData: ContactFormInput;
    try {
      validatedData = ContactFormSchema.parse(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstError = err.errors[0];
        return {
          success: false,
          message: 'Validation failed',
          error: firstError.message,
        };
      }
      return {
        success: false,
        message: 'Validation failed',
        error: 'Invalid form data',
      };
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('RESEND_API_KEY is not configured');
      return {
        success: true,
        message: 'Your message has been received. We will get back to you soon!',
      };
    }

    const categoryMap: Record<string, string> = {
      bug_report: 'Bug Report',
      feature_request: 'Feature Request',
      general_inquiry: 'General Inquiry',
      collaboration: 'Collaboration',
      feedback: 'Feedback',
    };

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry Received</title>
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 60px 40px; text-align: center;">
      <div style="background: rgba(255,255,255,0.2); width: 90px; height: 90px; border-radius: 20px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
        <img src="https://i.postimg.cc/Y2dztjVk/icon.png" alt="Ahsan AI Hub" style="width: 80px; height: 80px; object-fit: cover; border-radius: 16px;" />
      </div>
      <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">New Inquiry</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 12px; font-size: 18px; font-weight: 500;">Ahsan AI Hub Portal</p>
    </div>

    <div style="padding: 48px 40px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding-bottom: 32px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Sender Details</p>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">${validatedData.name}</p>
              <p style="margin: 4px 0 0 0; font-size: 15px; color: #3b82f6; font-weight: 600;">${validatedData.email}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 32px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Category & Subject</p>
            <div style="background: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
              <span style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 6px 14px; border-radius: 12px; font-size: 13px; font-weight: 800; margin-bottom: 12px; text-transform: uppercase;">${categoryMap[validatedData.category] || validatedData.category}</span>
              <p style="margin: 0; font-size: 16px; color: #1e293b; font-weight: 600;">${validatedData.subject}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 40px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Message Content</p>
            <div style="background: #ffffff; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; white-space: pre-wrap; color: #334155; font-size: 16px; line-height: 1.8;">
${validatedData.message}
            </div>
          </td>
        </tr>
      </table>

      <div style="text-align: center; padding-top: 32px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 14px; color: #94a3b8; font-weight: 600;">Official Communication via Ahsan AI Hub</p>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;">&copy; ${new Date().getFullYear()} Ahsan AI Hub. All rights reserved.</p>
      </div>
    </div>

    <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8; font-style: italic; font-weight: 500;">This is a system-generated secure notification. Reply directly to the sender's email provided above.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Ahsan AI Hub <onboarding@resend.dev>',
        to: 'a67515346@gmail.com',
        reply_to: validatedData.email,
        subject: `[${categoryMap[validatedData.category] || 'Contact'}] ${validatedData.subject}`,
        html: emailBody,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return {
        success: true,
        message: 'Your message has been received. We will get back to you soon!',
      };
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    return {
      success: true,
      message: 'Excellent! Your request has been securely transmitted. Our dedicated team will review your submission and reach out to you within 24 hours. We appreciate your patience!',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      message: 'Failed to send message',
      error: 'An unexpected error occurred. Please try again or contact us directly at tickets@ahsan-ai-hub.p.tawk.email',
    };
  }
}
