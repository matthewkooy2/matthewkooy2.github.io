export default function ExperiencePage() {
  const experience = [
    {
      title: "Role Title",
      org: "Company / Organization",
      dates: "Month YYYY — Month YYYY",
      bullets: [
        "Impact-focused bullet with an outcome metric if possible.",
        "Second bullet describing scope, tools, or scale.",
      ],
    },
    {
      title: "Role Title",
      org: "Company / Organization",
      dates: "Month YYYY — Month YYYY",
      bullets: [
        "Impact-focused bullet.",
        "Second bullet describing what you built or improved.",
      ],
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Experience
        </h1>
        <p className="mt-3 text-zinc-600">
          A quick snapshot of roles and work I’ve done across software, data,
          and analytics.
        </p>
      </header>

      <section className="mt-10 space-y-6">
        {experience.map((item) => (
          <div
            key={`${item.title}-${item.org}-${item.dates}`}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  {item.title}
                </h2>
                <p className="text-sm font-medium text-zinc-700">{item.org}</p>
              </div>
              <p className="text-sm text-zinc-500">{item.dates}</p>
            </div>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700">
              {item.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
