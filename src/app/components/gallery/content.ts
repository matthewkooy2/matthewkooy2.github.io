export const stack = [
  { name: "Languages", symbol: "</>", summary: "Applications, pipelines, and statistical models.", items: ["Python", "TypeScript", "JavaScript", "C++", "SQL", "R"] },
  { name: "Frameworks", symbol: "{ }", summary: "Interfaces, APIs, and account-scoped workflows.", items: ["React", "Next.js", "FastAPI", "Express", "Node.js"] },
  { name: "Data & ML", symbol: "Σ", summary: "Warehouses, player predictions, and computer vision.", items: ["PostgreSQL", "DuckDB", "Parquet", "CatBoost", "YOLO", "OpenCV"] },
  { name: "Tools", symbol: "→_", summary: "Version control, deployments, and integrations.", items: ["Git", "Docker", "GitHub Actions", "Cloud Run", "Microsoft Graph", "SharePoint"] },
];

export const projects = [
  { name: "AirPLAi Sports", label: "Player analytics & computer vision", role: "Sports Operations Intern", date: "July 2026 – Present", description: "Player and team analytics, video-enabled shot charts, and a reproducible basketball tracking pipeline.", proof: "Batched PostgreSQL reads with real-database regression coverage.", tools: ["Next.js", "TypeScript", "PostgreSQL", "YOLO"], steps: ["Detect players", "Link identities", "Validate tracking"], href: "/experience#airplai" },
  { name: "Team Financial Group", label: "Account-scoped financial software", role: "Software Engineer Intern", date: "March 2026 – Present", description: "A multi-tenant customer portal for agreements, payments, and documents, backed by guarded Python ETL.", proof: "Fail-closed authorization, review gates, and health-gated Cloud Run releases.", tools: ["React", "Express", "Supabase", "Microsoft Graph"], steps: ["Authenticate", "Authorize account", "Access documents"], href: "/projects/tfg-customer-portal" },
  { name: "Lewis", label: "Local-first AI engineering assistant", role: "Personal project", date: "2026", description: "An AI assistant with durable memory and isolated Git worktrees. Proposed changes go through validation and human approval.", proof: "Deterministic patch checks, allowlisted commands, and rollback-aware application.", tools: ["Python", "FastAPI", "Git"], steps: ["Propose in worktree", "Validate patch", "Approve & apply"], href: "/projects/lewis" },
];

export const volumes = [
  { name: "Shots", value: 6.3, description: "Shot-level records for basketball analysis." },
  { name: "Possessions", value: 6.1, description: "Possession-level records across the warehouse." },
  { name: "Player-matchup rows", value: 2.1, description: "Player-to-player matchup records." },
];
