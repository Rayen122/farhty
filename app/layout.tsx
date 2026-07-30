import type { Metadata } from "next";
import { Lalezar, Tajawal, Fredoka, Vazirmatn, Playfair_Display, DM_Sans, Great_Vibes, Cormorant_Infant, Amiri, Cairo } from "next/font/google";
import "./globals.css";
import AntiCopyGuard from "./components/AntiCopyGuard";

const lalezar = Lalezar({
  variable: "--font-lalezar",
  subsets: ["arabic"],
  weight: "400",
  display: "swap",
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  display: "swap",
  weight: ["300", "400", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const cormorant = Cormorant_Infant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "فرحتي · دعوات إلكترونية لكل مناسبة",
  description: "منصّة تصنع مواقع دعوات إلكترونية مليئة بالبهجة للأعراس والحفلات وأعيad الميلاد. نحوّل الفرح إلى تجربة رقمية ملوّنة وسهلة — تبدأ بابتسامة وتنتهي بحضور.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${lalezar.variable} ${tajawal.variable} ${fredoka.variable} ${vazirmatn.variable} ${playfair.variable} ${dmSans.variable} ${greatVibes.variable} ${cormorant.variable} ${amiri.variable} ${cairo.variable}`}>
      <body className="min-h-full flex flex-col antialiased overflow-x-hidden w-full">
        <AntiCopyGuard />
        {children}
      </body>
    </html>
  );
}

