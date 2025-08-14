"use client";

import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";

// NOTE: Replace these with your real contact details.
const SUPPORT_EMAIL = "jinayunity22@gmail.com"; // TODO: Change the email possibly
const LINKEDIN_URL = "https://www.linkedin.com/company/posturai"; // TODO: set real LinkedIn

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
        <div className="absolute -top-10 -right-16 w-72 h-72 bg-linear-to-br from-emerald-400/10 via-green-400/10 to-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-16 w-72 h-72 bg-linear-to-br from-lime-400/10 via-emerald-400/10 to-green-400/10 rounded-full blur-3xl" />
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
            We’re happy to help — reach us by email or on LinkedIn.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="min-w-40">
            <a href={mailto} aria-label="Email us">
              <Mail className="mr-2 size-4" /> Email us
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-40">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Find us on LinkedIn"
            >
              <Linkedin className="mr-2 size-4" /> LinkedIn
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
