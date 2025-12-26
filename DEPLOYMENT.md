# Deployment Guide - Vercel

## Environment Variables Required for Production

When deploying to Vercel, you must add the following environment variables to your project settings:

### AI Integration Variables (Required)
- **`AI_INTEGRATIONS_GEMINI_API_KEY`** - API key for Gemini AI access
- **`AI_INTEGRATIONS_GEMINI_BASE_URL`** - Base URL for Gemini API endpoint

These variables are automatically configured on Replit through AI Integrations. For Vercel, you need to:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add the following variables:
   - Name: `AI_INTEGRATIONS_GEMINI_API_KEY`
   - Name: `AI_INTEGRATIONS_GEMINI_BASE_URL`

### Optional Variables
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - ReCAPTCHA public key for form protection
- `DATABASE_URL` - PostgreSQL connection string (if using database features)
- `SESSION_SECRET` - Secret for session management

## Getting API Credentials

### For Replit Users
- AI Integration credentials are automatically provided by Replit
- No additional setup needed for development

### For Vercel Deployment
Contact support or check your Replit integration documentation for the credential values to use in Vercel.

## Deployment Checklist

- [ ] Add all required environment variables to Vercel project settings
- [ ] Test AI chat features after deployment
- [ ] Test content tools functionality
- [ ] Verify error messages display properly (no hardcoded API keys shown)
- [ ] Check browser console for any errors

## Testing AI Features

1. **AI Chat**: Click "AI Chat" and try sending a message
2. **Content Tools**: Test "Rewrite Text", "Explain Code", "Generate Ideas"
3. **Check Logs**: Monitor Vercel logs for any API errors

## Troubleshooting

If AI features don't work after deployment:

1. **Missing Credentials**: Verify all environment variables are set in Vercel settings
2. **API Errors**: Check Vercel logs for specific error messages
3. **Timeout Issues**: Increase function timeout in Vercel settings if needed
4. **CORS Issues**: Ensure API routes are properly configured for your domain

## Support

For issues with:
- **AI Integration**: Check Replit documentation
- **Vercel Deployment**: Visit Vercel support
- **Application Issues**: Check browser console and Vercel logs
