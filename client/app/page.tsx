// TODO: Update the buttons to have more of a Supabase or Stripe type of look
// TODO: Fix up the auth/billing

import { Navbar } from "../components/landing/navbar";
import HeroSection from "@/components/landing/hero-section";
import AboutSection from "@/components/landing/about-section";
import PricingSection from "@/components/landing/pricing-section";
import ContactSection from "@/components/landing/contact-section";

export default function Home() {
  return (
    <main className="w-full h-screen overflow-x-hidden overflow-y-auto">
      <Navbar />
      {/* <div className="absolute inset-0 -z-10"> */}
      {/* <div className="absolute bottom-[20vh] left-[25vw] w-[30%] h-[30%] bg-[var(--primary)] rounded-full mix-blend-multiply filter blur-[75vw] opacity-40"></div>
        <div className="absolute bottom-[10vh] left-[35vw] w-[30%] h-[30%] bg-[#00ff66] rounded-full mix-blend-multiply filter blur-[75vw] opacity-30"></div>
        <div className="absolute bottom-[20vh] left-[40vw] w-[30%] h-[30%] bg-[#00a442] rounded-full mix-blend-multiply filter blur-[75vw] opacity-20"></div> */}
      {/* <div className="absolute top-1/4 left-1/3 w-[50%] h-[50%] bg-linear-to-br from-[#7aff04] to-[#158f6e] rounded-full blur-[500px] animate-float-slow"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-linear-to-br from-[#00ffe0] to-[#9eff00] rounded-full blur-3xl animate-float-slow-reverse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-linear-to-br from-[#4ec452] to-[#00ffe0] rounded-full blur-3xl animate-float-drift"></div> */}
      {/* </div> */}

      <HeroSection />
      <AboutSection />
      <PricingSection />
      <ContactSection />
    </main>
  );
}
