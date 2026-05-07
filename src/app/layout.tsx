import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { Providers } from "@/components/providers/Providers";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MDP Market & Services | Mar del Plata",
  description: "Comprá, vendé y contratá servicios en Mar del Plata. El marketplace local con ritmo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn("h-full antialiased", inter.variable)}>
      <body className="min-h-full flex flex-col bg-[#f8fafc] font-sans">
        <Providers>
          <Header />
          <main className="flex-grow pb-20 lg:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
