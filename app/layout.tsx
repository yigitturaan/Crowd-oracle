import type { Metadata } from "next";
import { Inter, Russo_One, Space_Mono } from "next/font/google";
import "./globals.css";
import EyeBlink from "@/components/EyeBlink";

const inter = Inter({ subsets: ["latin"] });
const russo = Russo_One({ weight: "400", subsets: ["latin"], variable: "--font-russo" });
const space = Space_Mono({ weight: "400", subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Crowd Oracle",
  description: "Geleceği Tahmin Et",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${russo.variable} ${space.variable} min-h-screen bg-[#020617] text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden`}>
        
        {/* --- ARKA PLAN SAHNESİ --- */}
        <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
            
            {/* 1. KAHİN AURASI (Arkadaki Yumuşak Işık - Değişmedi) */}
            <div className="absolute w-[900px] h-[900px] bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-full blur-[120px] animate-rotate"></div>
            <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] rounded-full blur-[150px] opacity-40 animate-aura"></div>

            {/* 2. NEON SİBER GÖZ (İnce Çizgili & İçi Boş) */}
            {/* Genel Opacity %70 - Projektörde net görünsün ama yazıyı ezmesin */}
            <EyeBlink />
            
        </div>

        {/* --- İÇERİK --- */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>

      </body>
    </html>
  );
}
