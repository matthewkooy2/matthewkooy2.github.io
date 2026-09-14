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
