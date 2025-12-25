# Ahsan AI Hub

## Overview
Ahsan AI Hub is an AI-powered companion application built with Next.js 14. It provides various AI tools and features including text rewriting, code explanation, idea generation, and question solving.

## Project Structure
- `src/app/` - Next.js App Router pages
  - `(app)/` - Main application routes (home, about, contact, content-tools, etc.)
- `src/components/` - React components
  - `layout/` - Layout components (header, sidebar, navigation)
  - `ui/` - Reusable UI components (shadcn/ui)
  - `recommendations/` - AI chat interface
- `src/ai/` - AI/Genkit flows and configuration
  - `flows/` - Individual AI tool implementations
  - `genkit.ts` - Genkit configuration with Google AI
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and constants

## Technologies
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.x
- **UI Components**: shadcn/ui (Radix UI primitives)
- **AI Integration**: Google Genkit with Gemini 2.5 Flash
- **State Management**: React Context
- **Forms**: React Hook Form with Zod validation

## Development
- **Package Manager**: pnpm
- **Port**: 5000 (development)
- **Command**: `pnpm run dev`

## Environment Variables
The application uses Google AI through Genkit. Ensure the following environment variables are configured:
- `GOOGLE_GENAI_API_KEY` - Required for AI features

## Deployment
Configured for Replit Autoscale deployment:
- Build: `pnpm run build`
- Start: `pnpm run start`

## Configuration Files
- `.npmrc` - npm configuration to suppress peer dependency warnings
- `vercel.json` - Vercel deployment configuration for pnpm support
- `next.config.mjs` - Next.js configuration with image optimization
- `tailwind.config.ts` - Tailwind CSS configuration with custom theme
- `tsconfig.json` - TypeScript compiler options

## Recent Features & Improvements

### Performance Optimizations
- Image optimization with AVIF/WebP format support
- Aggressive caching with 1-year duration for static assets
- Gzip compression enabled for faster load times

### User Experience Enhancements
- **PWA Installation**: Fully functional "Install App" button with native PWA support and fallback manual instructions for all browsers/devices
- **Auto-scroll Button**: Chat page now shows scroll button when user scrolls away from latest messages; auto-scrolls on page load
- **Mobile Sidebar**: Improved bottom navigation with larger icons (h-20 height), gradient active states, and smooth transitions
- **About Page Logo**: Enhanced "A❤️N" logo with gradient text, backdrop blur, and hover effects for better visual appeal
- **Tool Cards**: Enhanced spacing with professional padding (p-7), larger icons (w-16 h-16), improved grid layout (gap-8)

### SEO & Metadata Optimization (Dec 25, 2025)
- **Metadata Enhancement**: Updated title, description, and keywords for better search visibility
- **Google Search Console**: Verified via meta tag (C3kD33pr8zGcgloDD-hhPTHJVKhicxKot5N39asPcX4)
- **Robots & Sitemap**: Fixed domain from replit.dev to vercel.app in robots.txt and sitemap API route
- **Structured Data**: Added Schema.org JSON-LD markup for WebApplication and Organization
- **Open Graph**: Enhanced social media sharing with proper OG tags and Twitter Card support
- **Canonical URLs**: Added canonical link and hreflang attributes for proper indexing
- **GoogleBot Directives**: Enabled indexing, following, and rich snippet display
- **Meta Tags**: Added comprehensive meta tags for author, viewport, theme-color, and description
- **Keyword Optimization**: Added 10 targeted keywords for AI tools (chat, writing, content generation, email, code explanation, etc.)
- **URL**: Domain correctly set to https://ahsan-ai-hub.vercel.app for Google indexing

## User Preferences
- Mobile-first responsive design priority
- Smooth animations and transitions (when enabled in settings)
- Accessibility considerations for all interactive elements
