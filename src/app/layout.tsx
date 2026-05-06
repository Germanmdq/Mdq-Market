import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MDP Market & Services | Comprá, vendé y contratá en Mar del Plata",
  description: "Marketplace hiperlocal de productos, servicios y profesionales verificados en Mar del Plata, con pago protegido y entrega validada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50 pb-16 lg:pb-0`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
