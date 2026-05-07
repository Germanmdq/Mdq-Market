import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { Providers } from "@/components/providers/Providers";

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
    <html lang="es" className="h-full antialiased">
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
