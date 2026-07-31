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

const SITE_URL = "https://www.farhty.me";
const SITE_NAME = "فرحتي";
const SITE_DESCRIPTION =
  "منصّة تونسية تصنع مواقع دعوات إلكترونية مليئة بالبهجة للأعراس والحفلات وأعياد الميلاد. نحوّل الفرح إلى تجربة رقمية ملوّنة وسهلة — تبدأ بابتسامة وتنتهي بحضور.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "فرحتي · دعوات زفاف إلكترونية في تونس",
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "دعوات إلكترونية",
    "دعوات زفاف",
    "دعوة عرس",
    "بطاقات دعوة رقمية",
    "دعوات زفاف تونس",
    "faire-part mariage digital",
    "invitation mariage Tunisie",
  ],
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ar_TN",
    url: SITE_URL,
    title: "فرحتي · دعوات زفاف إلكترونية في تونس",
    description: SITE_DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "فرحتي · دعوات زفاف إلكترونية في تونس",
    description: SITE_DESCRIPTION,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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

