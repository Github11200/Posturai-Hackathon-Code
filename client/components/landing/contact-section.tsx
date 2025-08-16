"use client";

import { Button } from "@/components/ui/button";
import { SUPPORT_EMAIL, LINKEDIN_URL, DISCORD_URL } from "@/lib/utils";
import { Mail, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ContactLinks from "../contact-links";

export function ContactSection() {
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "Posturai inquiry"
  )}`;

  return (
    <section
      id="contact"
      className="relative px-6 py-24 border-t border-border/60 bg-card/10 scroll-mt-20"
      aria-labelledby="contact-heading"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-10 -right-16 w-72 h-72 bg-linear-to-br from-emerald-400/10 to-primary/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-16 w-72 h-72 bg-linear-to-br from-lime-400/10 to-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <div className="text-center space-y-3">
          <h2
            id="contact-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Contact us
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            We’re happy to help — reach us by email, Linkedin, or join our
            Discord!
          </p>
        </div>

        <ContactLinks />
      </div>
    </section>
  );
}

export default ContactSection;
