/**
 * Website Status Configuration
 *
 * USE THIS FILE TO TOGGLE BETWEEN:
 * 1. 'maintenance' - Use when fixing errors or making changes
 * 2. 'coming-soon' - Use before the official launch
 * 3. 'live'         - Use when the website is fully ready
 */

export const siteStatusConfig = {
  // SET MODE TO: 'maintenance', 'coming-soon', or 'live'
  mode: "maintenance",

  // 1. MAINTENANCE SETTINGS (For fixing errors)
  maintenance: {
    title: "Maintenance Mode",
    description:
      "We're currently performing some technical updates to improve your experience. We'll be back online in a few minutes.",
    contactEmail: "support@ahsan-ai-hub.com",
  },

  // 2. COMING SOON SETTINGS (For official launch)
  comingSoon: {
    targetDate: "2026-01-20T00:00:00Z",
    siteName: "Ahsan AI Hub",
    tagline: "The Next Generation of AI",
    description:
      "We're building the most powerful privacy-first AI companion. Something revolutionary is coming soon.",
    logo: "/logo.png",
  },

  // GLOBAL SOCIAL LINKS
  socials: {
    twitter: "https://twitter.com/Ahsan_Ali_12",
    github: "https://github.com/AhsanAli1214",
    instagram: "https://www.instagram.com/ahsan.ali.wadani",
    facebook: "https://www.facebook.com/AhsanAliWadani",
  },
};
