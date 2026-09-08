import Image from "next/image";
import Link from "next/link";

export type Project = {
  id: string;
  category: string; // e.g., "Embedded", "ML", "Web"
  title: string;
  description: string;
  image?: string; // path in /public
  tags: string[];
  context?: string;
  href?: string; // live/demo
  code?: string; // github
  details?: string; // extended description for detail page
};

// Projects ordered newest first - add new projects at the top
export const PROJECTS: Project[] = [
  {
    id: "nba-analytics-warehouse",
    category: "Data Engineering",
    title: "NBA Analytics Warehouse",
    description: "A resumable warehouse spanning 30 NBA seasons and 18.3M play-by-play events, built for reproducible basketball analysis.",
    tags: ["Python", "DuckDB", "Parquet", "Data Quality", "ETL"],
    context: "Personal Project",
    details: "Covers 6.3M shots, 6.1M possessions, and 2.1M player-matchup rows. These are separate datasets, not additive slices of the event total.\n\nImplemented content-addressed source artifacts, idempotent backfills, identity reconciliation, coverage tracking, and data-quality quarantines so ingestion can resume safely and analysis can be reproduced.",
  },
  {
    id: "lewis",
    category: "Developer Tools",
    title: "Lewis",
    description:
      "A local-first AI engineering assistant with durable memory, isolated Git worktrees, and human-approved code changes.",
    tags: [
      "Python",
      "FastAPI",
      "AI Agents",
      "Local-first",
      "Developer Tools",
      "Approval Workflows",
    ],
    context: "Personal Project",
    details:
      "Lewis combines chat, memory, local artifacts, and a guarded Freestyle coding lane. It can propose code changes inside isolated worktrees, generate and validate exact edit bundles, run allowlisted checks, and require human review before changes are applied or merged.\n\nDesigned for auditability rather than blind autonomy, its workflows use explicit permissions, approval records, review artifacts, rollback-aware application, and fail-closed behavior. DeepSeek powers proposal and edit generation within those controls.",
  },
  {
    id: "tfg-customer-portal",
    category: "Full-Stack Development",
    title: "Team Financial Group Customer Portal",
    description:
      "Built and deployed a full-stack customer portal for authenticated users to access agreements, payments, documents, and account-specific data.",
    image: "/projects/tfg-customer-portal.svg",
    tags: [
      "React",
      "Vite",
      "Supabase",
      "Express",
      "Microsoft Graph",
      "SharePoint",
      "Salesforce",
    ],
    context: "Professional Project",
    details:
      "Built multi-tenant authentication, invitations and roles, SharePoint document access, and global-admin tooling with fail-closed authorization.\n\nEngineered guarded Python ETL across LeaseWorks, Salesforce, Supabase, and SharePoint with deterministic validation, manual-review gates, and idempotent processing. Added health-gated Cloud Run releases and an operations cockpit for pipeline status, run details, and aggregate database diffs.",
  },
  {
    id: "fantasy-baseball-daily-briefing",
    category: "Sports Analytics",
    title: "Fantasy Baseball Daily Briefing",
    description:
      "Python pipeline that uses APIs, scraping, and statistical analysis to email daily matchup, injury, waiver, and lineup optimization insights.",
    image: "/projects/baseballproj.png",
    tags: ["Python", "APIs", "Scraping", "Statistics", "Optimization"],
    details:
      "Built a daily fantasy baseball assistant that compiles MLB probable starters, hitter matchups, injuries, off days, and waiver-wire targets into a single morning email. The workflow pulls live data, evaluates roster context, and surfaces the decisions that matter before lineups lock.\n\nThe system also includes matchup acquisition optimization, using recent performance, opponent context, and team needs to highlight pickup opportunities with the strongest short-term upside.",
  },
  {
    id: "nba-stats-predictor",
    category: "Machine Learning",
    title: "NBA Stats Predictor",
    description:
      "CatBoost models trained on 10,000+ games from 60 players, improving held-out MAE by 0.62%–1.90% over a 10-game rolling baseline.",
    image: "/projects/NBAML.png",
    tags: ["Python", "CatBoost", "FastAPI", "React", "SQLite"],
    context: "Personal Project",
    details: "Used 19 rolling, opponent, venue, and rest features to predict player statistics, comparing held-out mean absolute error against a 10-game rolling baseline.\n\nServed predictions through FastAPI and React with SQLite caching, Pydantic validation, retry/backoff, rate limiting, and interactive performance views.",
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
    <article className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-900/70">
      {/* image */}
      <div className="relative h-44 w-full overflow-hidden border-b border-zinc-800">
        {p.image ? (
          <Image
            src={p.image}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-950 via-zinc-950 to-zinc-900">
            <span className="font-mono text-2xl font-semibold tracking-[0.3em] text-zinc-200">
              {p.title.toUpperCase()}
            </span>
          </div>
        )}

        {/* subtle image overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/10 to-transparent" />

        {/* category pill */}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-xs font-semibold text-zinc-200">
            {p.category}
          </span>
        </div>

        {/* top-right actions */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {p.href && (
            <Link
              href={p.href}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/80 text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white"
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/80 text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white"
              aria-label="View code"
              title="Code"
            >
              <IconCode className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={`/projects/${p.id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950/80 text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white"
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

        <p className="mt-2 text-sm leading-6 text-zinc-400">{p.description}</p>

        {/* tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={`${p.id}-${t}`}
              className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1 font-mono text-xs text-zinc-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <div className="relative w-full">
      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-400 md:text-lg">
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
