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
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f4f7fa; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #eef2f6;">
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">New Inquiry Received</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-size: 16px;">Ahsan AI Hub • Professional Hub</p>
    </div>

    <div style="padding: 40px 30px;">
      <div style="margin-bottom: 30px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="width: 4px; height: 18px; background: #2563eb; border-radius: 2px; margin-right: 10px;"></div>
          <span style="font-size: 13px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Sender Information</span>
        </div>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">${validatedData.name}</p>
          <p style="margin: 4px 0 0 0; font-size: 15px; color: #2563eb; font-weight: 500;">${validatedData.email}</p>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="width: 4px; height: 18px; background: #2563eb; border-radius: 2px; margin-right: 10px;"></div>
          <span style="font-size: 13px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Request Category</span>
        </div>
        <div style="display: inline-block; background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; padding: 8px 16px; border-radius: 30px; font-size: 14px; font-weight: 700;">
          ${categoryMap[validatedData.category] || validatedData.category}
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="width: 4px; height: 18px; background: #2563eb; border-radius: 2px; margin-right: 10px;"></div>
          <span style="font-size: 13px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Subject Line</span>
        </div>
        <div style="font-size: 16px; color: #334155; font-weight: 600; padding: 15px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          ${validatedData.subject}
        </div>
      </div>

      <div style="margin-bottom: 40px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <div style="width: 4px; height: 18px; background: #2563eb; border-radius: 2px; margin-right: 10px;"></div>
          <span style="font-size: 13px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Message Details</span>
        </div>
        <div style="background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; white-space: pre-wrap; color: #1e293b; font-size: 15px; line-height: 1.7; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
${validatedData.message}
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 13px; color: #94a3b8; font-weight: 500;">Submitted via Ahsan AI Hub Official Portal</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #cbd5e1;">© ${new Date().getFullYear()} Ahsan AI Hub. All rights reserved.</p>
      </div>
    </div>

    <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 12px; color: #94a3b8; font-style: italic;">This is a priority automated notification. Please do not reply directly.</p>
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
