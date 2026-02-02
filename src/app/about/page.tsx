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
const LANGUAGES = ["Python", "C++", "SQL", "R", "Next.js"];

const TOOLS = [
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "TensorFlow",
  "Matplotlib",
  "Git",
  "Docker",
  "PostgreSQL",
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

const CATEGORY_COLORS: Record<string, string> = {
  "Computer Science & Math": "from-indigo-500/20 to-indigo-500/5",
  "Data Science": "from-cyan-500/20 to-cyan-500/5",
  Economics: "from-fuchsia-500/20 to-fuchsia-500/5",
};

const CATEGORY_BORDERS: Record<string, string> = {
  "Computer Science & Math": "border-indigo-500/30",
  "Data Science": "border-cyan-500/30",
  Economics: "border-fuchsia-500/30",
};

function LanguageCard({ name, delay }: { name: string; delay: number }) {
  return (
    <div
      className="reveal-on-scroll opacity-0 scale-95 group relative"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Gradient border effect */}
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-indigo-500/50 via-fuchsia-500/50 to-cyan-500/50 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 backdrop-blur transition-all duration-300 hover:bg-white/[0.10] hover:border-white/25">
        <span className="text-base font-semibold text-zinc-100">{name}</span>
      </div>
    </div>
  );
}

function ToolPill({ name, delay }: { name: string; delay: number }) {
  return (
    <span
      className="reveal-on-scroll opacity-0 scale-95 inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-zinc-200 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-fuchsia-500/10"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {name}
    </span>
  );
}

function CourseCard({
  course,
  category,
  delay,
}: {
  course: string;
  category: string;
  delay: number;
}) {
  return (
    <div
      className={`reveal-on-scroll opacity-0 translate-y-4 group rounded-xl border ${CATEGORY_BORDERS[category]} bg-gradient-to-br ${CATEGORY_COLORS[category]} p-3 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-sm font-medium text-zinc-100">{course}</p>
    </div>
  );
}

export default function AboutPage() {
  const containerRef = useScrollReveal();

  return (
    <div className="relative min-h-screen w-full" ref={containerRef}>
      {/* Fixed background - stays still while content scrolls */}
      <div className="fixed inset-0 -z-10">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Gradient glows */}
        <div className="absolute -top-48 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/15 to-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-64 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-cyan-500/15 via-indigo-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -left-64 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-fuchsia-500/15 via-indigo-500/10 to-transparent blur-3xl" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/40" />
      </div>

      {/* Scrolling content */}
      <main className="relative mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="reveal-on-scroll opacity-0 translate-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
            About
          </h1>
          <p className="mt-4 max-w-3xl text-xl font-medium leading-snug tracking-tight text-zinc-200">
            Data scientist and economist building systems that turn ideas into impact.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {/* Profile Card - spans 1 column on mobile, 1 on desktop */}
          <div className="reveal-on-scroll opacity-0 translate-y-4 md:col-span-1 lg:col-span-1 row-span-2">
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              {/* Glowing Avatar */}
              <div className="relative mx-auto w-fit">
                {/* Animated glow ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 opacity-75 blur-md animate-pulse" />
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 animate-spin-slow" style={{ animationDuration: "8s" }} />

                {/* Photo container */}
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-white/20">
                  <Image
                    src="/selfflick.jpg"
                    alt="Matthew Kooy"
                    fill
                    className="object-cover object-[center_25%] transition-transform duration-500 hover:scale-110"
                    priority
                  />
                </div>
              </div>

              {/* Name & Info */}
              <div className="mt-6 text-center">
                <h2 className="text-xl font-semibold text-zinc-50">Matthew Kooy</h2>
                <p className="mt-1 text-sm text-zinc-400">Ann Arbor, MI</p>

                {/* Badge */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" />
                  <span className="text-xs font-medium text-zinc-200">
                    Data Science • Economics
                  </span>
                </div>

                {/* University */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-zinc-300">
                  <span>🎓</span>
                  <span>University of Michigan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Card - spans 2 columns */}
          <div
            className="reveal-on-scroll opacity-0 translate-y-4 md:col-span-2 lg:col-span-3"
            style={{ transitionDelay: "100ms" }}
          >
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                About Me
              </h3>
              <p className="mt-4 text-base leading-relaxed text-zinc-200">
                {/* User will write this paragraph */}
                I am a Junior at the University of Michigan with declared majors in Data Science and Economics.
                My love for this field derives from the joy it brings me to turn an idea into a system. A quick thought can
                rapidly grow into a functional project, improving the lives of millions, and that inspires me.
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-300">
                {/* Placeholder for additional content */}
                I'm passionate about leveraging data to solve complex problems and create meaningful impact.
                Whether it's building high-performance systems, automating workflows, or uncovering insights
                through analytics, I thrive at the intersection of technology and economics.
              </p>
            </div>
          </div>

          {/* Languages Card */}
          <div
            className="reveal-on-scroll opacity-0 translate-y-4 md:col-span-1 lg:col-span-2"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
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
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Tools & Frameworks
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
        <section className="mt-12">
          <div className="reveal-on-scroll opacity-0 translate-y-4">
            <h2 className="text-2xl font-semibold text-zinc-50">Relevant Coursework</h2>
            <p className="mt-2 text-zinc-400">
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
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-300">
                  {category}
                </h3>
                <div className="flex flex-col gap-3">
                  {courses.map((course, i) => (
                    <CourseCard
                      key={course}
                      course={course}
                      category={category}
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
