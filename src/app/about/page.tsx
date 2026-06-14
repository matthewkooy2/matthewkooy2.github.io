"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Hook for scroll-triggered animations
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Small delay to ensure DOM is ready after hydration
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

// Skill data
const LANGUAGES = ["Python", "C++", "SQL", "R", "React", "Next.js"];

const TOOLS = [
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "TensorFlow",
  "Matplotlib",
  "Git",
  "Docker",
  "PostgreSQL",
  "Vite",
  "Supabase",
  "Express",
  "Salesforce",
  "Jupyter",
  "VS Code",
];

// Coursework with categories
const COURSEWORK = {
  "Computer Science & Math": [
    "Data Structures & Algorithms",
    "Multivariate Calculus",
    "Linear Algebra",
    "Discrete Math",
    "Statistics & Probability",
  ],
  "Data Science": [
    "Machine Learning",
    "Applied Regression",
    "Bioinformatics",
  ],
  Economics: [
    "Microeconomics",
    "Macroeconomics",
    "Econometrics",
    "Game Theory",
    "Public Finance",
    "Energy Economics",
  ],
};

function LanguageCard({ name, delay }: { name: string; delay: number }) {
  return (
    <div
      className="reveal-on-scroll opacity-0 scale-95"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 px-5 py-3 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-900">
        <span className="text-base font-semibold text-zinc-100">{name}</span>
      </div>
    </div>
  );
}

function ToolPill({ name, delay }: { name: string; delay: number }) {
  return (
    <span
      className="reveal-on-scroll opacity-0 scale-95 inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 font-mono text-sm text-zinc-300 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-900"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {name}
    </span>
  );
}

function CourseCard({ course, delay }: { course: string; delay: number }) {
  return (
    <div
      className="reveal-on-scroll opacity-0 scale-95"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-900/70">
        <p className="text-sm font-medium text-zinc-200">{course}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const containerRef = useScrollReveal();

  return (
    <div className="relative w-full" ref={containerRef}>
      <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Header */}
        <div className="reveal-on-scroll opacity-0 translate-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            About
          </h1>
          <p className="mt-3 max-w-2xl text-base text-zinc-400 md:text-lg">
            Data scientist and economist building systems that turn ideas into impact.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Profile Card - spans 1 column on mobile, 1 on desktop */}
          <div className="reveal-on-scroll opacity-0 translate-y-4 md:col-span-1 lg:col-span-1 row-span-2">
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              {/* Photo */}
              <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border border-zinc-800">
                <Image
                  src="/selfflick.jpg"
                  alt="Matthew Kooy"
                  fill
                  className="object-cover object-[center_25%] transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>

              {/* Name & Info */}
              <div className="mt-6 text-center">
                <h2 className="text-xl font-semibold text-zinc-50">Matthew Kooy</h2>
                <p className="mt-1 text-sm text-zinc-400">Ann Arbor, MI</p>

                {/* Badge */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  <span className="text-xs font-medium text-zinc-300">
                    Data Science &amp; Economics
                  </span>
                </div>

                {/* University */}
                <p className="mt-4 text-sm text-zinc-400">University of Michigan</p>
              </div>
            </div>
          </div>

          {/* Bio Card - spans 2 columns */}
          <div
            className="reveal-on-scroll opacity-0 translate-y-4 md:col-span-2 lg:col-span-3"
            style={{ transitionDelay: "100ms" }}
          >
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                About Me
              </h3>
              <p className="mt-4 text-base leading-relaxed text-zinc-300">
                I&apos;m a Junior at the University of Michigan with declared majors in Data Science and
                Economics. My interest in this field comes from the satisfaction of turning an idea into
                a working system &mdash; a quick thought that grows into a functional project.
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                I&apos;m drawn to using data to solve concrete problems. Whether it&apos;s building
                full-stack systems, automating workflows, or uncovering insights through analytics, I
                like working at the intersection of technology and economics.
              </p>
            </div>
          </div>

          {/* Languages Card */}
          <div
            className="reveal-on-scroll opacity-0 translate-y-4 md:col-span-1 lg:col-span-2"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Languages
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {LANGUAGES.map((lang, i) => (
                  <LanguageCard key={lang} name={lang} delay={300 + i * 75} />
                ))}
              </div>
            </div>
          </div>

          {/* Tools & Frameworks Card */}
          <div
            className="reveal-on-scroll opacity-0 translate-y-4 md:col-span-2 lg:col-span-2"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="h-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Tools &amp; Frameworks
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {TOOLS.map((tool, i) => (
                  <ToolPill key={tool} name={tool} delay={400 + i * 50} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coursework Section */}
        <section className="mt-16">
          <div className="reveal-on-scroll opacity-0 translate-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-50 md:text-2xl">Relevant Coursework</h2>
            <p className="mt-2 text-sm text-zinc-400 md:text-base">
              A foundation spanning computer science, mathematics, and economics.
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {Object.entries(COURSEWORK).map(([category, courses], categoryIndex) => (
              <div
                key={category}
                className="reveal-on-scroll opacity-0 translate-y-4"
                style={{ transitionDelay: `${500 + categoryIndex * 150}ms` }}
              >
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {category}
                </h3>
                <div className="flex flex-col gap-3">
                  {courses.map((course, i) => (
                    <CourseCard
                      key={course}
                      course={course}
                      delay={600 + categoryIndex * 150 + i * 75}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom spacing */}
        <div className="h-24" />
      </main>

    </div>
  );
}
