// app/page.jsx or pages/index.jsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-500/40">
              <span className="text-lg font-semibold text-sky-300">N</span>
            </div>
            <div className="flex flex-col leading-tight">
              {/* If Bitcount is mapped to --font-bitcount, this will use it */}
              <span className="text-lg font-semibold tracking-tight font-[var(--font-bitcount,theme(font.sans))]">
                NoteFlow
              </span>
              <span className="text-xs text-slate-400">
                Capture. Organize. Remember.
              </span>
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 text-sm sm:flex">
            <Link
              href="#features"
              className="text-slate-300 transition hover:text-slate-50"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-slate-300 transition hover:text-slate-50"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-slate-300 transition hover:text-slate-50"
            >
              FAQ
            </Link>
            <div className="h-6 w-px bg-slate-700" />
            <Link href="/signin" className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-200 hover:text-white">
              Sign in
            </Link>
            <Link href="/get-started" className="rounded-full bg-sky-500 px-4 py-1.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-20">
        {/* Left: Text */}
        <div className="flex-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Sync notes across all your devices</span>
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Your thoughts,{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              beautifully organized
            </span>
            .
          </h1>

          <p className="mt-4 max-w-xl text-balance text-sm text-slate-300 sm:text-base">
            NoteFlow is a minimal, fast note-taking app that keeps all your
            ideas, tasks, and checklists in one place. Search instantly, sync
            everywhere, and never lose a thought again.
          </p>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400">
              Start taking notes
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-100 hover:border-slate-400">
              Try demo (no signup)
            </button>
          </div>

          {/* Small trust row */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] text-emerald-300">
                ★
              </span>
              <span>Autosave every keystroke</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/15 text-[10px] text-sky-300">
                ☁
              </span>
              <span>Cloud sync & backup</span>
            </div>
          </div>
        </div>

        {/* Right: Mockup / Card */}
        <div className="flex-1">
          <div className="relative mx-auto max-w-md">
            {/* Glow background */}
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[40px] bg-sky-500/20 blur-3xl" />
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/60 backdrop-blur">
              {/* Mock top bar */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Today · 10:24 AM</span>
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                  Note preview
                </span>
              </div>

              {/* Mock note content */}
              <div className="space-y-4 px-4 pb-4 pt-3">
                <div className="rounded-2xl bg-slate-800/80 px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-sky-300">
                    Daily Journal
                  </p>
                  <p className="mt-1 text-sm text-slate-100">
                    Ship landing page for NoteFlow ✨
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300">
                    <li>• Finalize hero section copy</li>
                    <li>• Connect to notes API</li>
                    <li>• Test on mobile & tablet</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-slate-800/60 px-3 py-2">
                    <p className="text-[11px] font-medium text-slate-300">
                      Quick capture
                    </p>
                    <p className="mt-1 text-slate-400">
                      Press{" "}
                      <span className="rounded bg-slate-700 px-1">Ctrl</span>+
                      <span className="rounded bg-slate-700 px-1">N</span> to
                      create a new note.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-800/60 px-3 py-2">
                    <p className="text-[11px] font-medium text-slate-300">
                      Tags & search
                    </p>
                    <p className="mt-1 text-slate-400">
                      Type{" "}
                      <span className="rounded bg-slate-700 px-1">#work</span>{" "}
                      to organize instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-800/80 px-3 py-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-slate-300">Your streak</span>
                    <span className="text-sm font-semibold text-emerald-300">
                      7 days writing
                    </span>
                  </div>
                  <button className="rounded-full bg-sky-500 px-3 py-1 text-[11px] font-medium text-slate-950 hover:bg-sky-400">
                    Continue note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8"
      >
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Designed for fast note-taking
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-400 sm:text-base">
          Everything you need to capture ideas, tasks, and documents without
          getting in your way.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Instant search"
            description="Find any note in milliseconds with full-text search and filters by tag, date, and notebook."
          />
          <FeatureCard
            title="Organize with tags"
            description="Keep things simple with lightweight tags instead of complex folder trees."
          />
          <FeatureCard
            title="Cloud sync"
            description="Your notes stay in sync across desktop, tablet, and phone automatically."
          />
          <FeatureCard
            title="Offline first"
            description="Write anywhere. Everything syncs back up when you’re online again."
          />
          <FeatureCard
            title="Secure by default"
            description="Notes are stored securely, and you control who can access shared notebooks."
          />
          <FeatureCard
            title="Dark mode ready"
            description="Beautiful in both light and dark themes, tuned for long writing sessions."
          />
        </div>
      </section>

      {/* SIMPLE PRICING / CTA */}
      <section id="pricing" className="border-t border-white/5 bg-slate-950/70">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Start free. Upgrade when you&apos;re ready.
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-400 sm:text-base">
                Perfect for personal journals, study notes, and side projects.
                Power features for when your ideas grow bigger.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>✓ Unlimited notes & tags</li>
                <li>✓ Sync across 2 devices on free plan</li>
                <li>✓ Export anytime — your data is yours</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-sky-500/30 bg-sky-500/10 p-6 shadow-lg shadow-sky-500/20">
              <p className="text-xs font-medium uppercase tracking-wide text-sky-200">
                Pro plan
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-semibold">$4</span>
                <span className="text-sm text-slate-300">/month</span>
              </div>
              <p className="mt-2 text-sm text-slate-200">
                Unlimited devices, advanced search filters, shared workspaces,
                and priority support.
              </p>
              <button className="mt-4 w-full rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400">
                Upgrade to Pro
              </button>
              <p className="mt-2 text-center text-[11px] text-slate-300">
                No credit card required for the free plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} NoteFlow. All rights reserved.</span>
          <div className="flex gap-4">
            <button className="hover:text-slate-300">Privacy</button>
            <button className="hover:text-slate-300">Terms</button>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="flex flex-col rounded-2xl border border-white/5 bg-slate-900/60 p-4 text-sm shadow-[0_18px_40px_rgba(15,23,42,0.7)] backdrop-blur">
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-xs text-slate-400 sm:text-sm">{description}</p>
    </div>
  );
}
