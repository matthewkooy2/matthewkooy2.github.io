"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS } from "../page";

export default function ProjectDetailPage() {
  const params = useParams();
  const project = PROJECTS.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="relative min-h-screen w-full">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="text-2xl font-semibold text-zinc-50">Project not found</h1>
          <Link href="/projects" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300">
            ← Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute -top-56 left-1/2 h-[850px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/18 via-fuchsia-500/12 to-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 -right-64 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-cyan-500/14 via-indigo-500/10 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/50" />
      </div>

      <main className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <span>←</span>
          <span>Back to projects</span>
        </Link>

        {/* Project header */}
        <div className="mt-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-zinc-200">
              {project.category}
            </span>
            <span className="text-xs text-zinc-500">Academic Project</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50">
            {project.title}
          </h1>
        </div>

        {/* Project image */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <div className="relative aspect-video w-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-zinc-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            About this project
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300">
            {project.description}
          </p>

          {/* Extended description - this will be customized per project */}
          {project.details && (
            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-300">
              {project.details.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        {/* Code notice */}
        <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <span className="text-amber-400">⚠️</span>
            <div>
              <h3 className="font-medium text-amber-200">Source Code Unavailable</h3>
              <p className="mt-1 text-sm text-amber-200/70">
                This project was completed as part of university coursework. Due to academic integrity policies,
                the source code cannot be publicly shared. However, I&apos;m happy to discuss the implementation
                details and my approach during an interview.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 flex gap-4">
          <Link
            href="/contact"
            className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Get in touch
          </Link>
          <Link
            href="/projects"
            className="rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.10]"
          >
            View other projects
          </Link>
        </div>

        <div className="h-24" />
      </main>
    </div>
  );
}
