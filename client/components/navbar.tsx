import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 w-[96%] md:w-[96%] lg:w-[96%] xl:max-w-[1400px] z-50 supports-[backdrop-filter]:bg-background/55 border border-border/50 rounded-[calc(var(--radius)*1.5)]"
      )}
    >
      <nav
        className="mx-auto h-20 max-w-7xl grid grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10"
        aria-label="Main navigation"
      >
        <Link
          href="#"
          className="font-semibold tracking-tight text-xl md:text-2xl text-foreground hover:text-foreground/80 transition-colors"
        >
          Posturai
        </Link>
        <ul className="flex items-center gap-12 text-base md:text-lg font-medium">
          <li>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-muted-foreground text-lg hover:text-foreground px-4"
            >
              <Link href="#about">About</Link>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-muted-foreground text-lg hover:text-foreground px-4"
            >
              <Link href="#features">Features</Link>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-muted-foreground text-lg hover:text-foreground px-4"
            >
              <Link href="#pricing">Pricing</Link>
            </Button>
          </li>
        </ul>
        <div className="justify-self-end flex items-center gap-4">
          <Button size="lg">Sign Up</Button>
        </div>
      </nav>
    </header>
  );
}
