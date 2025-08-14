export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center select-none overflow-visible pt-28 md:pt-32 border-t border-border/60 bg-card/5"
      aria-labelledby="hero-heading"
    >
      <div className="relative z-10 w-full max-w-8xl mx-auto px-6 md:px-8">
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          <h1 id="hero-heading" className="text-5xl md:text-6xl font-black tracking-tight">
            Posturai
          </h1>
          <p className="w-full lg:max-w-xl text-base md:text-lg text-muted-foreground">
            Posture correction software.
          </p>
          <div className="w-full flex justify-center">
            <div className="relative w-[clamp(240px,70vw,720px)] aspect-video rounded-[calc(var(--radius)*2)] border border-border/60 bg-card/40 shadow-inner overflow-hidden flex items-center justify-center text-muted-foreground text-sm">
              Video Placeholder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
