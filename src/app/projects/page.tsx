import Image from "next/image";
import Link from "next/link";

export type Project = {
  id: string;
  category: string; // e.g., "Embedded", "ML", "Web"
  title: string;
  description: string;
  image: string; // path in /public
  tags: string[];
  href?: string; // live/demo
  code?: string; // github
  details?: string; // extended description for detail page
};

// Projects ordered newest first - add new projects at the top
export const PROJECTS: Project[] = [
  {
    id: "nba-stats-predictor",
    category: "Machine Learning",
    title: "NBA Stats Predictor",
    description:
      "End-to-end Python ML pipeline using feature engineering, time-series CV, and CatBoost, beating rolling-average baselines by 15% on held-out seasons.",
    image: "/projects/NBAML.png",
    tags: ["Python", "Machine Learning", "CatBoost", "SQLite"],
    code: "https://github.com/matthewkooy2/NBAPredictions",
  },
  {
    id: "stock-simulator",
    category: "Systems",
    title: "Stock Simulator",
    description:
      "C++ order-matching engine with O(log n) latency on 100K+ events and 2M ticks/sec market data ingestion.",
    image: "/projects/trading.avif",
    tags: ["C++", "Data Structures", "Performance", "Algorithms"],
    details: "Add your detailed description here.",
  },
  {
    id: "sql-emulator",
    category: "Systems",
    title: "SQL Database Emulator",
    description:
      "In-memory SQL engine in C++ with parsing, indexing, and test-driven validation for structured queries.",
    image: "/projects/SQLexamp.png",
    tags: ["C++", "Databases", "Parsing", "Indexing"],
    details: "Add your detailed description here.",
  },
  {
    id: "ml-classifier",
    category: "Machine Learning",
    title: "Machine Learning Text Classifier",
    description:
      "Bernoulli Naive Bayes classifier in C++ trained on 20K+ posts with 25 unit tests for validation.",
    image: "/projects/MLTEXT.jpg",
    tags: ["C++", "Machine Learning", "NLP", "Testing"],
    details: "Add your detailed description here.",
  },
  {
    id: "puzzle-solver",
    category: "Algorithms",
    title: "3D Puzzle Solver",
    description:
      "Explores 1M+ states in under 2 seconds using BFS and DFS optimization strategies.",
    image: "/projects/BFSDFS.webp",
    tags: ["C++", "BFS", "DFS", "Optimization"],
    details: "Add your detailed description here.",
  },
];

function IconExternal(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"
      />
    </svg>
  );
}

function IconCode(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M8.7 16.3 3.4 12l5.3-4.3 1.3 1.6L6.7 12l3.3 2.7-1.3 1.6Zm6.6 0-1.3-1.6 3.3-2.7-3.3-2.7 1.3-1.6 5.3 4.3-5.3 4.3Zm-3.6 4.2-1.9-.5 4.4-16 1.9.5-4.4 16Z"
      />
    </svg>
  );
}

function IconInfo(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      />
    </svg>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
        "backdrop-blur",
        "transition hover:border-white/20 hover:bg-white/[0.06]",
      ].join(" ")}
    >
      {/* image */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={p.image}
          alt={p.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={false}
        />

        {/* subtle image overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* category pill */}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-md border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-semibold text-zinc-100 backdrop-blur">
            {p.category}
          </span>
        </div>

        {/* top-right actions */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {p.href && (
            <Link
              href={p.href}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-zinc-100 backdrop-blur transition hover:bg-black/40"
              aria-label="Open project"
              title="Open"
            >
              <IconExternal className="h-4 w-4" />
            </Link>
          )}
          {p.code ? (
            <Link
              href={p.code}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-zinc-100 backdrop-blur transition hover:bg-black/40"
              aria-label="View code"
              title="Code"
            >
              <IconCode className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={`/projects/${p.id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-zinc-100 backdrop-blur transition hover:bg-black/40"
              aria-label="View details"
              title="Details"
            >
              <IconInfo className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      {/* content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
          {p.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-300">{p.description}</p>

        {/* tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={`${p.id}-${t}`}
              className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs font-semibold text-zinc-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute -right-16 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <div className="relative w-full">
      {/* full-bleed background (grid + glow) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* vignettes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.55),transparent_45%)]" />
        {/* glows */}
        <div className="absolute -top-56 left-1/2 h-[820px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/18 via-fuchsia-500/12 to-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-420px] left-[-360px] h-[820px] w-[820px] rounded-full bg-gradient-to-br from-fuchsia-500/14 via-indigo-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-380px] right-[-420px] h-[760px] w-[760px] rounded-full bg-gradient-to-br from-cyan-500/12 via-indigo-500/10 to-transparent blur-3xl" />
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          Projects
        </h1>
        <p className="mt-4 max-w-3xl text-xl font-semibold leading-snug tracking-tight text-zinc-100">
          A curated set of builds across software, analytics, and systems.
        </p>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </section>
      </main>
    </div>
  );
}
