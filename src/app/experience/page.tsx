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
    id: "airplai",
    title: "Sports Operations Intern",
    company: "AirPLAi Sports",
    location: "Remote",
    dates: "July 2026 — Present",
    type: "work",
    bullets: [
      "Shipped production improvements to responsive player/team analytics profiles and video-enabled shot-chart workflows using Next.js, TypeScript, and PostgreSQL.",
      "Replaced per-record query fan-out with batched PostgreSQL reads and added real-database regression coverage, improving latency while preserving authorization behavior.",
      "Built a reproducible basketball multi-object-tracking pipeline spanning YOLO detection, active-player filtering, identity linking, MOT validation, and TrackEval.",
    ],
    skills: ["Next.js", "TypeScript", "PostgreSQL", "Python", "YOLO", "TrackEval"],
  },
  {
    id: "team-financial-group",
    title: "Software Engineer Intern",
    company: "Team Financial Group",
    location: "Hybrid",
    dates: "March 2026 — Present",
    type: "work",
    logo: "/TFGLogoMark.png",
    bullets: [
      "Built and deployed an authenticated multi-tenant customer portal using React, Express, Supabase/PostgreSQL, and Microsoft Graph for agreements, payments, documents, and account-scoped workflows.",
      "Implemented authorization, invitations and roles, SharePoint document access, and global-admin tooling with fail-closed security behavior.",
      "Engineered guarded Python ETL across LeaseWorks, Salesforce, Supabase, and SharePoint with deterministic validation, manual-review gates, and idempotent processing.",
      "Added health-gated Cloud Run releases and an operations cockpit with pipeline status, run details, and aggregate database diffs for safer support and deployment.",
    ],
    skills: [
      "React",
      "Python",
      "Supabase",
      "Express",
      "Salesforce",
      "Microsoft Graph",
      "Cloud Run",
      "Data Pipelines",
      "Full-Stack Development",
    ],
  },
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

const TYPE_LABELS: Record<string, string> = {
  work: "Work Experience",
  research: "Research",
  leadership: "Leadership",
};

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  return (
    <div
      id={exp.id}
      className="reveal-on-scroll opacity-0 translate-y-6"
      style={{ transitionDelay: `${150 + index * 100}ms` }}
    >
      <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-900/70">
        <div className="flex flex-col md:flex-row">
          {/* Logo Section */}
          <div className="flex items-center justify-center border-b border-zinc-800 p-6 md:w-48 md:border-b-0 md:border-r">
            <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
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
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-zinc-50">
                    {exp.title}
                  </h3>
                  <span className="rounded-md border border-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
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
              <div className="flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-1.5">
                <svg
                  className="h-4 w-4 text-zinc-500"
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
                  <span className="mt-2 h-1 w-1 flex-none rounded-full bg-zinc-600" />
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
                  className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 font-mono text-xs text-zinc-400 transition-colors hover:border-zinc-700"
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
    <div className="relative w-full" ref={containerRef}>
      {/* Content */}
      <main className="relative mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/* Header */}
        <div className="reveal-on-scroll opacity-0 translate-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            Experience
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-400 md:text-lg">
            Building expertise across data science, analytics, and software engineering.
          </p>
        </div>

        {/* Timeline indicator */}
        <div className="reveal-on-scroll opacity-0 translate-y-4 mt-10 flex items-center gap-4" style={{ transitionDelay: "100ms" }}>
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">Timeline</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        {/* Experience cards */}
        <section className="mt-8 flex flex-col gap-4">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </section>

        {/* Bottom CTA */}
        <div
          className="reveal-on-scroll opacity-0 translate-y-4 mt-12 text-center"
          style={{ transitionDelay: `${150 + EXPERIENCES.length * 100 + 100}ms` }}
        >
          <div className="inline-flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-5 py-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm text-zinc-400">
              Currently open to new opportunities
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
