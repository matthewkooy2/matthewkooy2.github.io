"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Hook for scroll-triggered animations (same as About page)
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
            }
          });
        },
        { threshold: 0.05, rootMargin: "100px 0px 0px 0px" }
      );

      const elements = ref.current?.querySelectorAll(".reveal-on-scroll");
      elements?.forEach((el) => observerRef.current?.observe(el));
    }, 50);

    return () => {
      clearTimeout(timeout);
      observerRef.current?.disconnect();
    };
  }, []);

  return ref;
}

type Experience = {
  id: string;
  title: string;
  company: string;
  location: string;
  dates: string;
  type: "work" | "research" | "leadership";
  logo?: string; // path to logo in /public
  bullets: string[];
  skills: string[];
};

const EXPERIENCES: Experience[] = [
  {
    id: "michigan-blockchain",
    title: "Software Engineer, Development Team",
    company: "Michigan Blockchain Club",
    location: "Ann Arbor, MI",
    dates: "January 2025 — Present",
    type: "work",
    logo: "/mb-logo.png",
    bullets: [
      "Automated ingestion and transformation of smart contract metrics in Python (pandas), cleaning 25K+ rows, and publishing analytics-ready tables that improved anomaly detection and reliability of downstream reporting",
      "Coordinated Git reviews with 3 teammates across 8 pull requests, maintaining traceable changes and reproducible outputs",
    ],
    skills: ["Python", "Pandas", "Git", "Data Engineering"],
  },
  {
    id: "wolverine-sports",
    title: "Project Team Lead",
    company: "Wolverine Sports Analytics",
    location: "Ann Arbor, MI",
    dates: "January 2025 — Present",
    type: "work",
    logo: "/WSA-logo.png",
    bullets: [
      "Modeled NBA player stat forecasts with Python regression across 1K+ games, producing structured feature tables that improved interpretability, error tracking, and repeatable decision support for weekly analysis planning",
      "Derived 20+ matchup and defense features with validation checks, reducing noisy outputs for high-variance players",
    ],
    skills: ["Python", "Regression", "Sports Analytics", "Feature Engineering"],
  },
  {
    id: "ipo-investing",
    title: "Junior Analyst",
    company: "IPO Investing Club",
    location: "Ann Arbor, MI",
    dates: "January 2024 — Present",
    type: "work",
    logo: "/IIC-logo.jpeg",
    bullets: [
      "Compiled KPI, growth, and margin comparisons in Excel, building a repeatable reporting pack for 12 metrics per company to support clearer narratives, tighter stakeholder alignment, and faster turnaround on follow-up questions",
      "Standardized valuation templates and assumption logs, improving data consistency across recurring coverage updates",
    ],
    skills: ["Excel", "Financial Analysis", "Valuation", "Reporting"],
  },
];

const TYPE_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  work: {
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
  },
  research: {
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
  },
  leadership: {
    border: "border-fuchsia-500/30",
    bg: "bg-fuchsia-500/10",
    text: "text-fuchsia-400",
  },
};

const TYPE_LABELS: Record<string, string> = {
  work: "Work Experience",
  research: "Research",
  leadership: "Leadership",
};

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const colors = TYPE_COLORS[exp.type];

  return (
    <div
      className="reveal-on-scroll opacity-0 translate-y-6 group"
      style={{ transitionDelay: `${150 + index * 100}ms` }}
    >
      <article
        className={`relative overflow-hidden rounded-2xl border ${colors.border} bg-white/[0.03] backdrop-blur transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20`}
      >
        {/* Hover glow effect */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col md:flex-row">
          {/* Logo Section */}
          <div className="flex items-center justify-center border-b border-white/10 bg-white/[0.02] p-6 md:w-56 md:border-b-0 md:border-r">
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05]">
              {exp.logo ? (
                <Image
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  fill
                  className="object-contain p-3"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-zinc-500">
                  {exp.company.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-zinc-50">
                    {exp.title}
                  </h3>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                  >
                    {TYPE_LABELS[exp.type]}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-zinc-300">
                  {exp.company}
                </p>
                <p className="text-sm text-zinc-500">
                  {exp.location}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <svg
                  className="h-4 w-4 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-zinc-400">{exp.dates}</span>
              </div>
            </div>

            {/* Bullets */}
            <ul className="mt-4 space-y-2">
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
                  <span className="text-sm leading-relaxed text-zinc-300">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            {/* Skills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {exp.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.08]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function ExperiencePage() {
  const containerRef = useScrollReveal();

  return (
    <div className="relative min-h-screen w-full" ref={containerRef}>
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Gradient glows */}
        <div className="absolute -top-56 left-1/2 h-[850px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/18 via-fuchsia-500/12 to-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/2 -left-72 h-[650px] w-[650px] rounded-full bg-gradient-to-br from-fuchsia-500/14 via-indigo-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -right-64 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-cyan-500/14 via-indigo-500/10 to-transparent blur-3xl" />

        {/* Vignettes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/50" />
      </div>

      {/* Content */}
      <main className="relative mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="reveal-on-scroll opacity-0 translate-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
            Experience
          </h1>
          <p className="mt-4 max-w-3xl text-xl font-medium leading-snug tracking-tight text-zinc-200">
            Building expertise across data science, analytics, and software engineering.
          </p>
        </div>

        {/* Timeline indicator */}
        <div className="reveal-on-scroll opacity-0 translate-y-4 mt-10 flex items-center gap-4" style={{ transitionDelay: "100ms" }}>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="text-sm text-zinc-500">Timeline</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Experience cards */}
        <section className="mt-8 flex flex-col gap-6">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </section>

        {/* Bottom CTA */}
        <div
          className="reveal-on-scroll opacity-0 translate-y-4 mt-16 text-center"
          style={{ transitionDelay: `${150 + EXPERIENCES.length * 100 + 100}ms` }}
        >
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 backdrop-blur">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse" />
            <span className="text-sm text-zinc-300">
              Currently open to new opportunities
            </span>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-24" />
      </main>
    </div>
  );
}
