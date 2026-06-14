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
    <div className="relative w-full">
      <main className="relative mx-auto max-w-4xl px-6 py-16 md:py-24">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to projects</span>
        </Link>

        {/* Project header */}
        <div className="mt-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-300">
              {project.category}
            </span>
            <span className="text-xs text-zinc-500">
              {project.context ?? "Academic Project"}
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
            {project.title}
          </h1>
        </div>

        {/* Project image */}
        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800">
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
              className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 font-mono text-sm text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            About this project
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-300">
            {project.description}
          </p>

          {/* Extended description - this will be customized per project */}
          {project.details && (
            <div className="mt-6 space-y-4 text-base leading-relaxed text-zinc-400">
              {project.details.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>

        {/* Code notice */}
        <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-4 w-4 flex-none text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3.75m0 3.75h.008M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.3 2.25h17.76a1.5 1.5 0 0 0 1.3-2.25L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
              />
            </svg>
            <div>
              <h3 className="font-medium text-amber-200">Source Code Not Public</h3>
              <p className="mt-1 text-sm text-amber-200/70">
                The repository for this project is not linked publicly here. I&apos;m happy to discuss the
                implementation, architecture, and tradeoffs in more detail during an interview or conversation.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Get in touch
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
          >
            View other projects
          </Link>
        </div>
      </main>
    </div>
  );
}
