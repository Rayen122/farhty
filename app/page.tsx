import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Templates from "./components/Templates";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FloatingCTA from "./components/FloatingCTA";
import TemplateAdvisor from "./components/TemplateAdvisor";
import Footer from "./components/Footer";

/* Données structurées : permet à Google d'identifier l'entreprise et le site
   plutôt que de deviner à partir du texte de la page. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.farhty.me/#website",
      url: "https://www.farhty.me",
      name: "فرحتي",
      alternateName: "Farhty",
      inLanguage: "ar-TN",
    },
    {
      "@type": "Organization",
      "@id": "https://www.farhty.me/#organization",
      name: "فرحتي",
      alternateName: "Farhty",
      url: "https://www.farhty.me",
      logo: "https://www.farhty.me/brand/icon-primary.png",
      description:
        "منصّة تونسية لصناعة دعوات الزفاف والمناسبات الإلكترونية التفاعلية.",
      areaServed: { "@type": "Country", name: "Tunisia" },
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <Hero />
      <Templates />
      <HowItWorks />
      <Features />
      <Pricing />
      <Footer />
      <FloatingCTA />
      <TemplateAdvisor />
    </main>
  );
}
