import type { stack } from "./content";

export type TechnologyUsage = {
  focus: string;
  description: string;
  examples: { title: string; description: string; href: string }[];
};

type Technology = (typeof stack)[number]["items"][number];

// Keep usage grounded in the portfolio and resume evidence audit. Do not add
// private performance figures or infer a project from a technology's presence.
export const stackDetails: Record<Technology, TechnologyUsage> = {
  Python: {
    focus: "Pipelines, APIs & applied ML",
    description: "My main language for moving data, serving models, and building local-first tools.",
    examples: [
      { title: "Team Financial Group", description: "Guarded ETL across LeaseWorks, Salesforce, Supabase, and SharePoint, with validation and manual-review gates.", href: "#project-tfg-customer-portal" },
      { title: "NBA Analytics Warehouse", description: "Resumable ingestion, identity reconciliation, and data-quality checks across 30 NBA seasons.", href: "#project-nba-analytics-warehouse" },
    ],
  },
  TypeScript: {
    focus: "Production interfaces & APIs",
    description: "Typed application code for player analytics, responsive interfaces, and data-backed workflows.",
    examples: [
      { title: "AirPLAi Sports", description: "Next.js player and team profiles, video-enabled shot charts, and batched profile API reads.", href: "#work-airplai" },
      { title: "This portfolio", description: "React components, typed project content, and the scroll-driven Gallery experience you’re using now.", href: "#hero" },
    ],
  },
  JavaScript: {
    focus: "Interactive full-stack applications",
    description: "Connecting frontend interactions to backend services and account-scoped business data.",
    examples: [
      { title: "TFG Customer Portal", description: "React interfaces and Express services for agreements, payments, documents, and customer accounts.", href: "#project-tfg-customer-portal" },
    ],
  },
  "C++": {
    focus: "Data structures & systems fundamentals",
    description: "Building core algorithms and data structures directly, including query processing and search.",
    examples: [
      { title: "SQL Database Emulator", description: "An in-memory query engine with parsing, indexing, and test-driven validation.", href: "#project-sql-emulator" },
      { title: "3D Puzzle Solver", description: "Breadth-first and depth-first search for exploring puzzle states.", href: "#project-puzzle-solver" },
    ],
  },
  SQL: {
    focus: "Application queries & analytical data",
    description: "Working with relational data in customer-facing products and large basketball datasets.",
    examples: [
      { title: "AirPLAi Sports", description: "Replaced per-record query fan-out with batched PostgreSQL reads while preserving authorization behavior.", href: "#work-airplai" },
      { title: "TFG Customer Portal", description: "Supabase/PostgreSQL-backed account data, authorization, and aggregate database diffs for operations.", href: "#project-tfg-customer-portal" },
    ],
  },
  R: {
    focus: "Statistical computing",
    description: "Part of my statistical computing toolkit. The applied modeling and data-pipeline projects featured here primarily use Python.",
    examples: [],
  },
  React: {
    focus: "Interfaces for real workflows",
    description: "Turning backend capabilities into interfaces people can use to manage accounts or explore predictions.",
    examples: [
      { title: "TFG Customer Portal", description: "Customer-facing agreements, payments, documents, and account-access workflows.", href: "#project-tfg-customer-portal" },
      { title: "NBA Stats Predictor", description: "Interactive prediction and performance views connected to a FastAPI backend.", href: "#project-nba-stats-predictor" },
    ],
  },
  "Next.js": {
    focus: "Data-backed web applications",
    description: "Building React applications with routes, server-side data access, and responsive pages.",
    examples: [
      { title: "AirPLAi Sports", description: "Player/team analytics profiles, shot-chart workflows, and route migrations in the production product.", href: "#work-airplai" },
      { title: "This portfolio", description: "The single-page Gallery, interactive project cards, and section-by-section navigation.", href: "#hero" },
    ],
  },
  FastAPI: {
    focus: "Python services behind the interface",
    description: "Exposing Python workflows through structured APIs for AI tools and prediction applications.",
    examples: [
      { title: "Lewis", description: "The service layer for a local-first assistant with chat, memory, artifacts, and guarded coding workflows.", href: "#project-lewis" },
      { title: "NBA Stats Predictor", description: "Prediction endpoints with Pydantic validation, caching, retry/backoff, and rate limiting.", href: "#project-nba-stats-predictor" },
    ],
  },
  Express: {
    focus: "Account-scoped backend services",
    description: "Connecting authenticated web clients to financial data and Microsoft document services.",
    examples: [
      { title: "TFG Customer Portal", description: "Backend services for account permissions, agreements, documents, and administrative workflows.", href: "#project-tfg-customer-portal" },
    ],
  },
  "Node.js": {
    focus: "JavaScript server runtime",
    description: "Running the server-side JavaScript behind full-stack web applications.",
    examples: [
      { title: "TFG Customer Portal", description: "The runtime behind Express services that connect the React portal to account data and document integrations.", href: "#project-tfg-customer-portal" },
    ],
  },
  PostgreSQL: {
    focus: "Relational data for production products",
    description: "Supporting application queries, account access, and reproducible database checks.",
    examples: [
      { title: "AirPLAi Sports", description: "Batched profile reads and real-database regression coverage for player analytics.", href: "#work-airplai" },
      { title: "TFG Customer Portal", description: "Supabase/PostgreSQL data supporting multi-tenant customer workflows and guarded ETL.", href: "#project-tfg-customer-portal" },
    ],
  },
  DuckDB: {
    focus: "Local analytical queries",
    description: "The analytical database behind my reproducible NBA warehouse.",
    examples: [
      { title: "NBA Analytics Warehouse", description: "Querying basketball data across 30 seasons, including 18.3M play-by-play events and separate shot, possession, and matchup datasets.", href: "#project-nba-analytics-warehouse" },
    ],
  },
  Parquet: {
    focus: "Columnar warehouse storage",
    description: "Storing analytical datasets alongside DuckDB for repeatable basketball analysis.",
    examples: [
      { title: "NBA Analytics Warehouse", description: "A DuckDB/Parquet warehouse with resumable backfills, source provenance, coverage tracking, and data-quality quarantines.", href: "#project-nba-analytics-warehouse" },
    ],
  },
  CatBoost: {
    focus: "Player-stat prediction",
    description: "Training and evaluating models against a concrete rolling-average baseline.",
    examples: [
      { title: "NBA Stats Predictor", description: "Models trained on 10,000+ games from 60 players using 19 features. Held-out MAE improved 0.62%–1.90% over a 10-game rolling baseline.", href: "#project-nba-stats-predictor" },
    ],
  },
  YOLO: {
    focus: "Basketball player detection",
    description: "Detecting people as the first stage of a reproducible multi-object-tracking pipeline.",
    examples: [
      { title: "Basketball tracking / AirPLAi", description: "Detection feeds active-player filtering, persistent tracking, identity linking, MOT validation, and TrackEval evaluation.", href: "#work-airplai" },
    ],
  },
  OpenCV: {
    focus: "Video & computer-vision workflows",
    description: "Working with video frames in the basketball tracking toolkit.",
    examples: [
      { title: "Basketball tracking / AirPLAi", description: "Video processing within the detection and tracking workflow, alongside YOLO and reproducible evaluation tools.", href: "#work-airplai" },
    ],
  },
  Git: {
    focus: "Isolated changes & reviewable history",
    description: "Version control for shipped applications—and a safety boundary inside my AI engineering assistant.",
    examples: [
      { title: "Lewis", description: "Model-proposed edits stay in isolated Git worktrees until validation and human approval allow them to be applied.", href: "#project-lewis" },
      { title: "This portfolio", description: "Local branches preserve design alternatives while I iterate on the Gallery experience.", href: "#hero" },
    ],
  },
  Docker: {
    focus: "Portable execution environments",
    description: "Packaging a business-data workflow so it can run in a consistent operator environment.",
    examples: [
      { title: "Team Financial Group", description: "A portable Docker/Windows operator workflow for the guarded customer-data pipeline.", href: "#project-tfg-customer-portal" },
    ],
  },
  "GitHub Actions": {
    focus: "Repository automation",
    description: "Included in my developer toolkit for repository workflows. The release work featured here is described under Cloud Run.",
    examples: [],
  },
  "Cloud Run": {
    focus: "Health-gated releases",
    description: "Deploying financial software with explicit checks around release and operations.",
    examples: [
      { title: "Team Financial Group", description: "Staged Cloud Run releases with health gates, plus an operations cockpit for pipeline status, run details, and aggregate database diffs.", href: "#project-tfg-customer-portal" },
    ],
  },
  "Microsoft Graph": {
    focus: "Microsoft 365 document integration",
    description: "Connecting authenticated portal workflows to documents in the Microsoft ecosystem.",
    examples: [
      { title: "TFG Customer Portal", description: "Graph-backed SharePoint document access within account-scoped, fail-closed authorization workflows.", href: "#project-tfg-customer-portal" },
    ],
  },
  SharePoint: {
    focus: "Business documents & data workflows",
    description: "Bringing customer documents and operational outputs into guarded business processes.",
    examples: [
      { title: "TFG Customer Portal", description: "Account-scoped access to customer documents, integrated with Microsoft Graph.", href: "#project-tfg-customer-portal" },
      { title: "TFG data pipelines", description: "SharePoint participates in guarded ETL and document workflows with validation and explicit production-write controls.", href: "#project-tfg-customer-portal" },
    ],
  },
};
