import Link from "next/link";

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Project Name",
      description:
        "One-sentence description of what it is and why it matters.",
      tags: ["TypeScript", "Next.js", "Tailwind"],
      links: {
        repo: "https://github.com/yourname/your-repo",
        demo: "",
      },
    },
    {
      id: 2, 
      name: "Project Name",
      description: "Another short description (keep it punchy).",
      tags: ["C++", "Algorithms", "Performance"],
      links: {
        repo: "https://github.com/yourname/your-repo",
        demo: "",
      },
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Projects
        </h1>
        <p className="mt-3 text-zinc-600">
          Selected work—focused on performance, data, and clean engineering.
        </p>
      </header>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.id}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-zinc-300"
          >
            <h2 className="text-lg font-semibold text-zinc-950">{p.name}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {p.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={p.links.repo}
                className="text-sm font-semibold text-zinc-900 underline underline-offset-4 hover:text-zinc-950"
                target="_blank"
                rel="noreferrer"
              >
                Repo
              </Link>
              {p.links.demo ? (
                <Link
                  href={p.links.demo}
                  className="text-sm font-semibold text-zinc-900 underline underline-offset-4 hover:text-zinc-950"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
