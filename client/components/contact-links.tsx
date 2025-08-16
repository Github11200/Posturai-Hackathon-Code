import { LINKEDIN_URL, DISCORD_URL, SUPPORT_EMAIL } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";

export default function ContactLinks() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 justify-items-stretch">
      <Button asChild size="lg" className="min-w-40 sm:flex-1">
        <Link href={SUPPORT_EMAIL} aria-label="Email us">
          <Mail className="mr-2 size-4" /> Email us
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="min-w-40 sm:flex-1"
      >
        <Link
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Find us on LinkedIn"
        >
          <Linkedin className="mr-2 size-4" /> LinkedIn
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="min-w-40 sm:flex-1"
      >
        <Link
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Find us on LinkedIn"
        >
          <Image
            src={"/landing/discord.svg"}
            width={18}
            height={18}
            alt="Discord logo"
            className="mr-2"
          />{" "}
          Discord
        </Link>
      </Button>
    </div>
  );
}
