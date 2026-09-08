export const designs = [
  { id: "editorial", number: "01", name: "Editorial", character: "Light. Typographic. Considered.", description: "A bright, editorial portfolio with serif headlines, scroll-highlighted text, and sticky case studies.", features: ["Word-by-word scroll reveal", "Vertical stack chapters", "Sticky case-study layouts", "Oversized data counters"], sources: "Manus · Kokonut Scroll Text · Motion" },
  { id: "signal", number: "02", name: "Signal", character: "Dark. Precise. Technical.", description: "A midnight-blue engineering portfolio with assembling stack tiles, traced pipelines, and interactive charts.", features: ["Parallax system panels", "Staggered stack assembly", "Scroll-drawn pipeline paths", "Interactive data bars"], sources: "Kokonut Background Paths · Bklit · Motion" },
  { id: "gallery", number: "03", name: "Gallery", character: "Bold. Spatial. Expressive.", description: "Cobalt typography, technology cards that unfold into a grid, and a full-width horizontal project reel.", features: ["Split-heading parallax", "Fan-to-grid stack cards", "Scroll-pinned project reel", "Animated concentric rings"], sources: "Kokonut Card Stack · Motion pinning · Bklit rings" },
] as const;

export type DesignId = typeof designs[number]["id"];

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

export const references = [
  { name: "Motion / scroll pinning", href: "https://motion.dev/examples/js-scroll-pinning" },
  { name: "Kokonut / scroll text", href: "https://kokonutui.com/docs/texts/scroll-text" },
  { name: "Kokonut / card stack", href: "https://kokonutui.com/docs/cards/card-stack" },
  { name: "Kokonut / background paths", href: "https://kokonutui.com/docs/backgrounds/background-paths" },
  { name: "Bklit / bar charts", href: "https://bklit.com/docs/components/bar-chart" },
  { name: "Bklit / ring charts", href: "https://bklit.com/docs/components/ring-chart" },
  { name: "Manus / layout & typography", href: "https://manus.im/features/webapp" },
];
