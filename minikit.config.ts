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
      "payload": "eyJkb21haW4iOiJjcm93ZC1vcmFjbGUudmVyY2VsLmFwcCJ9",
      "signature": "ud7GwlFEmKrxRkoEAOt1U4cSDr+CdO1w3l92Rli0ELBbLKSdpw1Ze2dmoAcGvgtle8Lbrh3XsgKER02T9JVsyhs="
    },
  
  
  
  
  miniapp: {
    version: "1",
    name: "Crowd Oracle", 
    subtitle: "Geleceği Tahmin Et", 
    description: "Topluluk bilgeliğiyle geleceği tahmin et. ETH fiyat tahminleri ve kitle analizi.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/eye-logo.png`,
    splashImageUrl: `${ROOT_URL}/eye-logo.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["prediction", "crypto", "ethereum", "crowd", "oracle"],
    heroImageUrl: `${ROOT_URL}/eye-logo.png`, 
    tagline: "Geleceği Görebiliyor musun?",
    ogTitle: "Crowd Oracle",
    ogDescription: "Topluluk bilgeliğiyle geleceği tahmin et. ETH fiyat tahminleri ve kitle analizi.",
    ogImageUrl: `${ROOT_URL}/eye-logo.png`,
  },
} as const;

