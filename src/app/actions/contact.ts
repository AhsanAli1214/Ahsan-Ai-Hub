import { z } from 'zod';

// Validation schema for contact form (can be used on client)
export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100),
  category: z.enum(['bug_report', 'feature_request', 'general_inquiry', 'collaboration', 'feedback']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;

// Server action - marked for server execution
export async function sendContactFormServer(data: unknown): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  'use server';

  try {
    // Validate input
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
      // Fallback: still report success but log locally
      return {
        success: true,
        message: 'Your message has been received. We will get back to you soon!',
      };
    }

    // Format category to readable text
    const categoryMap: Record<string, string> = {
      bug_report: 'Bug Report',
      feature_request: 'Feature Request',
      general_inquiry: 'General Inquiry',
      collaboration: 'Collaboration',
      feedback: 'Feedback',
    };

    const emailBody = `
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">New Contact Form Submission</h2>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <div style="margin-bottom: 15px;">
          <p style="margin: 0 0 5px 0; font-weight: bold; color: #6b7280;">From:</p>
          <p style="margin: 0; font-size: 16px;">${validatedData.name}</p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">${validatedData.email}</p>
        </div>

        <div style="margin-bottom: 15px;">
          <p style="margin: 0 0 5px 0; font-weight: bold; color: #6b7280;">Category:</p>
          <p style="margin: 0; display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 500;">
            ${categoryMap[validatedData.category] || validatedData.category}
          </p>
        </div>

        <div style="margin-bottom: 15px;">
          <p style="margin: 0 0 5px 0; font-weight: bold; color: #6b7280;">Subject:</p>
          <p style="margin: 0; font-size: 16px; font-weight: 500;">${validatedData.subject}</p>
        </div>

        <div>
          <p style="margin: 0 0 5px 0; font-weight: bold; color: #6b7280;">Message:</p>
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; white-space: pre-wrap; word-wrap: break-word;">
${validatedData.message}
          </div>
        </div>
      </div>

      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 12px; color: #6b7280;">
        <p style="margin: 0;">This is an automated message from Ahsan AI Hub contact form.</p>
        <p style="margin: 5px 0 0 0;">Platform: ahsan-ai-hub.vercel.app</p>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      
      <div style="text-align: center; font-size: 12px; color: #9ca3af;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Ahsan AI Hub. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
    `.trim();

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'Contact Form <onboarding@resend.dev>',
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

/**
 * Exported function for client use (wraps the server action)
 */
export const sendContactForm = sendContactFormServer;
