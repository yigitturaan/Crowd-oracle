const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  
  
  
    "accountAssociation": {
      "header": "eyJmaWQiOjE3OTcwNzIsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgzM2Q4MzNmOWM2M0MxYzVGNzM4Mjk5OWIzNEMzNTczNGMxN0RiODQ2In0",
      "payload": "eyJkb21haW4iOiJvZHR1YmFzZTEudmVyY2VsLmFwcCJ9",
      "signature": "LTd0MZlI93VzjdSVnW5E8uJosCrD9KJkCbdWQgb8OAg5bkh7WTDnKWiPYjwkrWsdNwfNA/M8NE5qYJYh94WWjhs="
    },
  
  
  
  miniapp: {
    version: "1",
    name: "Cubey", 
    subtitle: "Your AI Ad Companion", 
    description: "Ads",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["marketing", "ads", "quickstart", "waitlist"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`, 
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;

