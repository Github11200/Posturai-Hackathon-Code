"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={cn(
        "fixed mx-auto top-4 left-4 right-4 lg:w-2/3 xl:max-w-6xl z-50 border rounded-(--radius)"
      )}
    >
      <nav
        className="relative backdrop-blur-md mx-auto grid grid-cols-[1fr_1fr] lg:grid-cols-[1fr_auto_1fr] items-center px-2 py-2 md:px-4 md:py-4 rounded-(--radius)"
        aria-label="Main navigation"
      >
        <Link
          href="#"
          className="ml-2 font-semibold tracking-tight text-xl md:text-2xl text-foreground hover:text-foreground/80 transition-colors"
        >
          <Image
            src={"/logo.png"}
            width={50}
            height={50}
            alt="Logo"
            className="rounded-full"
          />
        </Link>
        <ul className="hidden lg:flex items-center gap-12 text-base md:text-lg font-medium">
          <li>
            <Link
              href="#about"
              className="text-muted-foreground text-lg px-4 transition-colors hover:text-foreground/90"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#features"
              className="text-muted-foreground text-lg px-4 transition-colors hover:text-foreground/90"
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              href="#pricing"
              className="text-muted-foreground text-lg px-4 transition-colors hover:text-foreground/90"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="text-muted-foreground text-lg px-4 transition-colors hover:text-foreground/90"
            >
              Contact
            </Link>
          </li>
        </ul>
        <div className="justify-self-end flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden text-2xl leading-none px-3 py-3 rounded hover:bg-muted/50 transition-colors"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <LoginLink>
            <Button size="lg">Get started</Button>
          </LoginLink>
        </div>
        {/* Mobile dropdown */}
        {open && (
          <div
            id="mobile-menu"
            role="menu"
            className="lg:hidden absolute top-full right-0 mt-2 w-56 rounded-md border border-border bg-background shadow-lg p-2"
          >
            <Link
              href="#about"
              className="block w-full rounded px-3 py-2 text-base text-muted-foreground hover:text-foreground/90 hover:bg-muted/50 transition-colors"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              About
            </Link>
            <Link
              href="#features"
              className="block w-full rounded px-3 py-2 text-base text-muted-foreground hover:text-foreground/90 hover:bg-muted/50 transition-colors"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block w-full rounded px-3 py-2 text-base text-muted-foreground hover:text-foreground/90 hover:bg-muted/50 transition-colors"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="block w-full rounded px-3 py-2 text-base text-muted-foreground hover:text-foreground/90 hover:bg-muted/50 transition-colors"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Contact
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
