import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="contents sm:block" id="features">
      {/* Real-time posture monitoring */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 py-24 bg-card/10"
        aria-labelledby="about-realtime-heading"
      >
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex gap-3 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-display"
                viewBox="0 0 16 16"
              >
                <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145" />
              </svg>
              <h2
                id="about-realtime-heading"
                className="text-2xl md:text-3xl font-semibold tracking-tight"
              >
                Real-time posture monitoring
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              On-device tracking that nudges you before your spine becomes a
              circle.
            </p>
            <div
              aria-label="analysis preview image placeholder"
              className="mt-2 rounded-xl flex items-center justify-center"
            >
              <Image
                src={"/landing/analysis.png"}
                width={500}
                height={500}
                className="w-full rounded-xl border border-border/60"
                alt="Real time analysis screenshot"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Actionable insights */}
      <section
        className="min-h-screen flex items-center justify-center px-6 py-24 bg-card/10"
        aria-labelledby="about-insights-heading"
      >
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-bar-chart"
                viewBox="0 0 16 16"
              >
                <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z" />
              </svg>
              <h2
                id="about-insights-heading"
                className="text-2xl md:text-3xl font-semibold"
              >
                Actionable insights
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              Daily and weekly summaries with simple scores and tips you can
              actually use.
            </p>
            <div
              aria-label="analysis preview image placeholder"
              className="mt-2 rounded-xl flex items-center justify-center"
            >
              <Image
                src={"/landing/statistics.png"}
                width={500}
                height={500}
                className="w-full rounded-xl border border-border/60"
                alt="Real time analysis screenshot"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Privacy-first by design */}
      <section
        className="min-h-screen flex items-center justify-center px-6 py-24 bg-card/10"
        aria-labelledby="about-privacy-heading"
      >
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col gap-4">
            <h2
              id="about-privacy-heading"
              className="text-2xl md:text-3xl font-semibold flex items-center gap-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-lock"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"
                />
              </svg>
              Privacy-first by design
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
              All the video processing takes place on device with no live data
              being sent to the server.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
