"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "../ui/button";

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="min-h-screen flex items-center justify-center px-6 py-24 scroll-mt-20 border-t border-border/60 bg-card/5"
      aria-labelledby="pricing-heading"
    >
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center space-y-2 mb-8">
          <h2
            id="pricing-heading"
            className="text-3xl md:text-4xl font-bold tracking-tight"
          >
            Simple pricing
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            One plan. Everything included.
          </p>
        </div>

        <div
          role="list"
          aria-label="Pricing options"
          className="grid place-items-center"
        >
          <div
            role="listitem"
            className="w-full max-w-md rounded-2xl border border-border/60 hover:border-border/80 hover:ring-1 hover:ring-border focus-visible:border-border/80 focus-visible:ring-1 focus-visible:ring-border/40 bg-card/20 p-6 md:p-8 shadow-xs hover:shadow-md transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  All features
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Everything you need for better posture.
                </p>
              </div>
              <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                Monthly
              </span>
            </div>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-bold tracking-tight">$10</span>
              <span className="pb-1 text-muted-foreground">/month</span>
            </div>

            <ul
              className="mt-6 space-y-3 text-sm"
              aria-label="Included features"
            >
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mt-0.5 size-5 text-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                Real-time posture analysis
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mt-0.5 size-5 text-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                Privacy‑first, on‑device processing
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mt-0.5 size-5 text-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                Offline friendly
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mt-0.5 size-5 text-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                In-depth statistics
              </li>
            </ul>

            <div className="mt-8">
              <RegisterLink>
                <Button className="w-full">Get started</Button>
              </RegisterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
