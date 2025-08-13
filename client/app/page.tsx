import { Navbar } from "../components/navbar";

export default function Home() {
  return (
    <main className="w-full">
      <Navbar />
      {/* Hero Section */}
      <section
        className="relative min-h-[100vh] flex items-center justify-center select-none overflow-visible pt-36 md:pt-40"
        aria-labelledby="hero-heading"
      >
        {/* Gradient blob background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-visible"
        >
          <div className="animate-drift will-change-transform absolute -left-1/3 md:-left-1/4 top-[0%] w-[75vw] max-w-[880px] aspect-square rounded-full blur-[190px] opacity-25 sm:opacity-30 md:opacity-35 lg:opacity-40 xl:opacity-45 dark:opacity-25 dark:md:opacity-30 dark:xl:opacity-35 brightness-105 sm:brightness-110 lg:brightness-125 bg-[radial-gradient(circle_at_35%_40%,hsl(var(--primary))_0%,hsla(var(--primary)/0.45)_28%,transparent_70%)]" />
          <div className="animate-drift-alt will-change-transform absolute -right-[30%] md:-right-[22%] lg:-right-[18%] bottom-[-12%] w-[70vw] max-w-[900px] aspect-square rounded-full blur-[210px] opacity-22 sm:opacity-28 md:opacity-32 lg:opacity-40 xl:opacity-45 dark:opacity-20 dark:md:opacity-25 dark:lg:opacity-30 brightness-105 sm:brightness-110 lg:brightness-120 bg-[radial-gradient(circle_at_80%_55%,hsl(var(--ring))_0%,hsla(var(--ring)/0.45)_26%,hsla(var(--primary)/0.28)_50%,transparent_72%)]" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid items-stretch lg:grid-cols-2 gap-10 md:gap-14 lg:gap-12">
            <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-2xl mx-auto lg:mx-0 h-full">
              <h1
                id="hero-heading"
                className="text-5xl md:text-6xl font-bold tracking-tight"
              >
                Posturai
              </h1>
              <p className="mt-4 w-full md:max-w-xl text-base md:text-lg text-muted-foreground">
                Improve your posture intelligently with real‑time feedback,
                actionable insights, and gentle coaching designed to fit
                seamlessly into your routine.
              </p>
            </div>
            <div className="flex h-full max-w-2xl w-full mx-auto lg:mx-0">
              <div className="relative w-full aspect-[16/9] self-center rounded-[calc(var(--radius)*2)] border border-border/60 bg-card/40 backdrop-blur-sm shadow-inner overflow-hidden flex items-center justify-center text-muted-foreground text-sm">
                Video Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 py-24 scroll-mt-20"
        aria-labelledby="about-heading"
      >
        <div className="max-w-2xl space-y-4 text-center">
          <h2
            id="about-heading"
            className="text-3xl font-semibold tracking-tight"
          >
            About
          </h2>
          <p className="text-muted-foreground">
            Brief description about Posturai. Replace this with real content
            explaining the mission or value proposition.
          </p>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="min-h-screen flex items-center justify-center px-6 py-24 scroll-mt-20"
        aria-labelledby="features-heading"
      >
        <div className="max-w-3xl space-y-8">
          <h2
            id="features-heading"
            className="text-center text-3xl font-semibold tracking-tight"
          >
            Features
          </h2>
          <ul className="grid gap-6 md:grid-cols-3 text-sm">
            <li className="rounded-lg border p-4">Feature One</li>
            <li className="rounded-lg border p-4">Feature Two</li>
            <li className="rounded-lg border p-4">Feature Three</li>
          </ul>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="min-h-screen flex items-center justify-center px-6 py-24 scroll-mt-20"
        aria-labelledby="pricing-heading"
      >
        <div className="max-w-xl space-y-4 text-center">
          <h2
            id="pricing-heading"
            className="text-3xl font-semibold tracking-tight"
          >
            Pricing
          </h2>
          <p className="text-muted-foreground">Simple pricing coming soon.</p>
        </div>
      </section>
    </main>
  );
}
