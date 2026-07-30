import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Templates from "./components/Templates";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FloatingCTA from "./components/FloatingCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Templates />
      <HowItWorks />
      <Features />
      <Pricing />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
