// src/app/page.tsx
import Link from "next/link";
import TetrisMini from "@/app/components/TetrisMini";
import { PROJECTS } from "@/app/projects/page";


export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 font-sans dark:bg-black">
      {/* Gradient / glow background (more visible) */}
      <div className="pointer-events-none absolute inset-0">
        {/* top glow */}
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full
                        bg-gradient-to-br from-indigo-500/25 via-fuchsia-500/15 to-cyan-500/10
                        blur-3xl dark:from-indigo-500/25 dark:via-fuchsia-500/15 dark:to-cyan-500/10" />

        {/* right glow */}
        <div className="absolute top-32 right-[-260px] h-[650px] w-[650px] rounded-full
                        bg-gradient-to-br from-cyan-500/16 via-indigo-500/12 to-transparent
                        blur-3xl" />

        {/* left/bottom glow */}
        <div className="absolute bottom-[-280px] left-[-280px] h-[700px] w-[700px] rounded-full
                        bg-gradient-to-br from-fuchsia-500/16 via-indigo-500/10 to-transparent
                        blur-3xl" />

        {/* subtle vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/35" />
      </div>


      <main className="relative mx-auto w-full max-w-5xl px-6 py-20">
        {/* Hero */}
        <section className="relative rounded-3xl border border-black/10 bg-white/70 p-8 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] md:p-10">
          {/* subtle glow ring */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/5 dark:ring-white/10" />

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                Data Science • Economics
              </p>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
                Matthew Kooy
              </h1>

              <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                I am a Junior at the University of Michigan with declared majors in Data Science and Economics.
                My love for this field derives from the joy it brings me to turn an idea into a system. A simple thought can 
                rapidly grow into a functional project, improving the lives of millions, and that inspires me.
              </p>

              {/* chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {["Python", "C++", "SQL", "Machine Learning", "Analytics", "Next.js"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-200"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-black"
                >
                  View Projects
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl border border-black/10 bg-white/60 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-50 dark:hover:bg-white/[0.10]"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="w-full md:w-[340px]">
              <TetrisMini />
            </div>

          </div>
        </section>

        {/* Featured cards */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
              Featured work
            </h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
            >
              See all →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PROJECTS.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                href="/projects"
                className="group rounded-2xl border border-black/10 bg-white/60 p-5 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {project.title}
                  </h3>
                  <span className="text-zinc-400 transition group-hover:text-zinc-600 dark:group-hover:text-zinc-200">
                    ↗
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {project.description}
                </p>

                <div className="mt-4 h-px w-full bg-black/5 dark:bg-white/10" />
                <p className="mt-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Click to explore
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
