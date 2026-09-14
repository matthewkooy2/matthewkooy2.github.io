export const stack = [
  { name: "Languages", symbol: "</>", summary: "Applications, pipelines, and statistical models.", items: ["Python", "TypeScript", "JavaScript", "C++", "SQL", "R"] },
  { name: "Frameworks", symbol: "{ }", summary: "Interfaces, APIs, and account-scoped workflows.", items: ["React", "Next.js", "FastAPI", "Express", "Node.js"] },
  { name: "Data & ML", symbol: "Σ", summary: "Warehouses, player predictions, and computer vision.", items: ["PostgreSQL", "DuckDB", "Parquet", "CatBoost", "YOLO", "OpenCV"] },
  { name: "Tools", symbol: "→_", summary: "Version control, deployments, and integrations.", items: ["Git", "Docker", "GitHub Actions", "Cloud Run", "Microsoft Graph", "SharePoint"] },
] as const;

// Campus involvement shown on the homepage.
export const extracurriculars = [
  {
    id: "michigan-blockchain",
    name: "Michigan Blockchain Club",
    role: "Software Engineer, Development Team",
    date: "January 2025 — Present",
    highlights: [
      "Automated smart-contract metric ingestion in Python/pandas, cleaning 25K+ rows into analytics-ready tables.",
      "Coordinated Git reviews with three teammates across eight pull requests, keeping changes traceable and outputs reproducible.",
    ],
    tools: ["Python", "pandas", "Git", "Data Engineering"],
    href: "#club-michigan-blockchain",
  },
  {
    id: "wolverine-sports",
    name: "Wolverine Sports Analytics",
    role: "Project Team Lead",
    date: "January 2025 — Present",
    highlights: [
      "Modeled NBA player-stat forecasts with Python regression across 1K+ games for repeatable weekly analysis.",
      "Built 20+ matchup and defense features with validation checks and structured feature tables for error tracking.",
    ],
    tools: ["Python", "Regression", "Sports Analytics", "Feature Engineering"],
    href: "#club-wolverine-sports",
  },
  {
    id: "ipo-investing",
    name: "IPO Investing Club",
    role: "Junior Analyst",
    date: "January 2024 — Present",
    highlights: [
      "Built Excel reporting packs comparing 12 metrics per company across KPIs, growth, and margins.",
      "Standardized valuation templates and assumption logs to keep recurring company coverage consistent.",
    ],
    tools: ["Excel", "Financial Analysis", "Valuation", "Reporting"],
    href: "#club-ipo-investing",
  },
] as const;

export const experiences = [
  {
    id: "team-financial-group",
    name: "Team Financial Group",
    role: "Software Engineer Intern",
    date: "March 2026 – Present",
    location: "Hybrid",
    description: "A multi-tenant customer portal for agreements, payments, and documents, backed by guarded Python ETL.",
    tools: ["React", "Express", "Python", "Supabase", "Microsoft Graph", "Cloud Run"],
    highlights: [
      { title: "Customer portal", description: "Account-scoped access, invitations and roles, and SharePoint documents with fail-closed authorization." },
      { title: "Data pipelines", description: "Python ETL across LeaseWorks, Salesforce, Supabase, and SharePoint, with validation and manual-review gates." },
      { title: "Releases & operations", description: "Health-gated Cloud Run releases and an operations cockpit for pipeline status, run details, and database diffs." },
    ],
    href: "#work-team-financial-group",
  },
  {
    id: "airplai",
    name: "AirPLAi Sports",
    role: "Sports Operations Intern",
    date: "July 2026 – Present",
    location: "Remote",
    description: "Player and team analytics, video-enabled shot charts, and a reproducible basketball tracking pipeline.",
    tools: ["Next.js", "TypeScript", "PostgreSQL", "Python", "YOLO", "TrackEval"],
    highlights: [
      { title: "Player analytics", description: "Production improvements to responsive player/team profiles and video-enabled shot-chart workflows." },
      { title: "Query performance", description: "Batched PostgreSQL reads replaced per-record query fan-out, with real-database regression coverage." },
      { title: "Basketball tracking", description: "YOLO detection, active-player filtering, identity linking, MOT validation, and TrackEval evaluation." },
    ],
    href: "#work-airplai",
  },
] as const;

export const volumes = [
  { name: "Shots", value: 6.3, description: "Shot-level records for basketball analysis." },
  { name: "Possessions", value: 6.1, description: "Possession-level records across the warehouse." },
  { name: "Player-matchup rows", value: 2.1, description: "Player-to-player matchup records." },
];
