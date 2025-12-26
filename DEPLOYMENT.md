# Deployment Guide - Vercel

## Environment Variables Required for Production

When deploying to Vercel, add this environment variable to your project settings:

### Required Variable
- **`GEMINI_API_KEY`** - Your Google Gemini API key for AI features

### Steps to Add Environment Variable
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Environments: Select all (Production, Preview, Development)
4. Save and redeploy

### Getting Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Create a new API key
4. Copy the key and add it to Vercel as `GEMINI_API_KEY`

### Optional Variables
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - ReCAPTCHA site key (if using form protection)
- `DATABASE_URL` - PostgreSQL connection string (if using database)
- `SESSION_SECRET` - Secret for session management

## Deployment Checklist

- [ ] Get Gemini API key from Google AI Studio
- [ ] Add `GEMINI_API_KEY` to Vercel Environment Variables
- [ ] Redeploy your project
- [ ] Test AI chat - should work immediately
- [ ] Test content tools (Rewrite Text, Explain Code, etc.)
- [ ] Check browser console for errors

## Testing AI Features After Deployment

1. **AI Chat**: Open the app and click "Start Chatting"
2. **Content Tools**: Try each tool in the Content Tools section
3. **Send a Message**: Type a test message in the chat

## Troubleshooting

| Issue | Solution |
|-------|----------|
| AI features not working | Verify `GEMINI_API_KEY` is set in Vercel Environment Variables |
| "Missing API key" error | Check that the environment variable was saved and app was redeployed |
| API quota exceeded | Check your Google API quota limits |
| Timeout errors | Increase serverless function timeout in Vercel settings |

## Support

For issues with:
- **Gemini API**: Visit [Google AI Documentation](https://ai.google.dev/)
- **Vercel Deployment**: Check [Vercel Documentation](https://vercel.com/docs)
- **App Issues**: Check browser console and Vercel function logs
