// src/app/page.tsx
import Link from "next/link";
import TetrisMini from "@/app/components/TetrisMini";
import { PROJECTS } from "@/app/projects/page";


export default function Home() {
  return (
    <div className="relative w-full">
      <main className="relative mx-auto w-full max-w-5xl px-6 py-16 md:py-24">
        {/* Hero */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 md:p-10">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Data Science &amp; Economics
              </p>

              <h1 className="text-4xl font-semibold tracking-tight text-zinc-50 md:text-5xl">
                Matthew Kooy
              </h1>

              <p className="mt-3 text-base text-zinc-400">
                Junior at the University of Michigan
              </p>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
                I like turning ideas into working systems &mdash; small thoughts that grow
                into projects people actually use, from data pipelines to full-stack apps.
              </p>

              {/* chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {["Python", "C++", "SQL", "Machine Learning", "Analytics", "Next.js"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="rounded-lg bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  View Projects
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
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
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-50">
              Featured work
            </h2>
            <Link
              href="/projects"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              See all &rarr;
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PROJECTS.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                href="/projects"
                className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition-colors hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-zinc-50">
                    {project.title}
                  </h3>
                  <span className="text-zinc-500 transition-colors group-hover:text-zinc-300">
                    &rarr;
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {project.description}
                </p>

                <div className="mt-4 h-px w-full bg-zinc-800" />
                <p className="mt-3 text-xs font-medium text-zinc-500">
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
