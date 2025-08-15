export default function AboutSection() {
  return (
    <div className="contents sm:block">
      {/* Real-time posture monitoring */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 py-24 border-t border-border/60 bg-card/10"
        aria-labelledby="about-realtime-heading"
      >
        <div className="w-full max-w-6xl mx-auto">
          <div className="group relative rounded-2xl border border-white/10 bg-background/20 backdrop-blur-md p-8 md:p-10 shadow-lg overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/10 via-green-400/5 to-teal-500/10 opacity-70" />
            <div className="relative flex flex-col gap-6">
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
                Lightweight on-device tracking that nudges you before bad habits
                set in.
              </p>
              <div
                aria-label="analysis preview image placeholder"
                className="mt-2 aspect-video rounded-xl border border-border/60 bg-muted/10 shadow-inner flex items-center justify-center text-xs text-muted-foreground"
              >
                Image Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy-first by design */}
      <section
        className="min-h-screen flex items-center justify-center px-6 py-24 bg-card/10"
        aria-labelledby="about-privacy-heading"
      >
        <div className="w-full max-w-6xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-background/20 backdrop-blur-md p-8 md:p-10 shadow-lg">
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
        </div>
      </section>

      {/* Offline */}
      <section
        className="min-h-screen flex items-center justify-center px-6 py-24 bg-card/10"
        aria-labelledby="about-offline-heading"
      >
        <div className="w-full max-w-6xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-background/20 backdrop-blur-md p-8 md:p-10 shadow-lg">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-wifi-off"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.706 3.294A12.6 12.6 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4q.946 0 1.852.148zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.45 8.45 0 0 1 3.51-1.27zm2.596 1.404.785-.785q.947.362 1.785.907a.482.482 0 0 1 .063.745.525.525 0 0 1-.652.065 8.5 8.5 0 0 0-1.98-.932zM8 10l.933-.933a6.5 6.5 0 0 1 2.013.637c.285.145.326.524.1.75l-.015.015a.53.53 0 0 1-.611.09A5.5 5.5 0 0 0 8 10m4.905-4.905.747-.747q.886.451 1.685 1.03a.485.485 0 0 1 .047.737.52.52 0 0 1-.668.05 11.5 11.5 0 0 0-1.811-1.07M9.02 11.78c.238.14.236.464.04.66l-.707.706a.5.5 0 0 1-.707 0l-.707-.707c-.195-.195-.197-.518.04-.66A2 2 0 0 1 8 11.5c.374 0 .723.102 1.021.28zm4.355-9.905a.53.53 0 0 1 .75.75l-10.75 10.75a.53.53 0 0 1-.75-.75z" />
                </svg>
                <h2
                  id="about-offline-heading"
                  className="text-2xl md:text-3xl font-semibold"
                >
                  Offline
                </h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Works even without internet access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Actionable insights */}
      <section
        className="min-h-screen flex items-center justify-center px-6 py-24 bg-card/10"
        aria-labelledby="about-insights-heading"
      >
        <div className="w-full max-w-6xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-background/20 backdrop-blur-md p-8 md:p-10 shadow-lg">
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
                aria-label="insights chart image placeholder"
                className="mt-2 aspect-video rounded-xl border border-border/60 bg-muted/10 shadow-inner flex items-center justify-center text-xs text-muted-foreground"
              >
                Image Placeholder
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
