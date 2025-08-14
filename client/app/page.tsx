// TODO: Update the buttons to have more of a Supabase or Stripe type of look

import { Navbar } from "../components/navbar";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import PricingSection from "@/components/pricing-section";
import ContactSection from "@/components/contact-section";

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Navbar />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-green-400/20 via-emerald-400/15 to-teal-400/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-lime-400/15 via-green-400/20 to-emerald-400/15 rounded-full blur-3xl animate-float-slow-reverse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-400/20 via-green-400/15 to-lime-400/20 rounded-full blur-3xl animate-float-drift"></div>
      </div>

      <HeroSection />
      <AboutSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
}
