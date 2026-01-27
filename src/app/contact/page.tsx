import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Contact
        </h1>
        <p className="mt-3 text-zinc-600">
          The fastest way to reach me is email. I’m also active on LinkedIn and
          GitHub.
        </p>
      </header>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-950">Email</h2>
          <p className="mt-2 text-sm text-zinc-600">
            <Link
              href="mailto:you@umich.edu"
              className="font-semibold text-zinc-900 underline underline-offset-4"
            >
              you@umich.edu
            </Link>
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-950">Links</h2>
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <Link
              href="https://www.linkedin.com/in/yourname/"
              className="font-semibold text-zinc-900 underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </Link>
            <Link
              href="https://github.com/yourname"
              className="font-semibold text-zinc-900 underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
