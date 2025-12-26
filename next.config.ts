import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Vercel deployment için gerekli ayarlar
  output: 'standalone', // Vercel için optimize edilmiş output
  // React 19 uyumluluğu için
  reactStrictMode: true,
};

export default nextConfig;
