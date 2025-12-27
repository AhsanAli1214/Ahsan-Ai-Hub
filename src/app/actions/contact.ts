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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Submission</h1>
    </div>

    <div style="padding: 30px 20px;">
      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">From</p>
        <div style="background: #f3f4f6; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; font-size: 16px; font-weight: 500; color: #1f2937;">${validatedData.name}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">${validatedData.email}</p>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Category</p>
        <div style="display: inline-block; background: #dbeafe; border: 1px solid #93c5fd; color: #1e40af; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;">
          ${categoryMap[validatedData.category] || validatedData.category}
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Subject</p>
        <p style="margin: 0; font-size: 16px; color: #1f2937; padding: 12px 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">${validatedData.subject}</p>
      </div>

      <div style="margin-bottom: 25px;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6; white-space: pre-wrap; word-wrap: break-word; color: #374151; font-size: 14px; line-height: 1.6;">
${validatedData.message}
        </div>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 6px 0; font-size: 12px; color: #6b7280;">Submitted via Ahsan AI Hub Contact Form</p>
        <p style="margin: 0; font-size: 11px; color: #9ca3af;">© ${new Date().getFullYear()} Ahsan AI Hub. All rights reserved.</p>
      </div>
    </div>

    <div style="background: #f9fafb; padding: 16px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 11px; color: #9ca3af;">This is an automated message. Please do not reply to this email.</p>
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
        to: 'tickets@ahsan-ai-hub.p.tawk.email',
        replyTo: validatedData.email,
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
      message: 'Thank you! Your message has been sent successfully. We will review it and get back to you as soon as possible.',
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
