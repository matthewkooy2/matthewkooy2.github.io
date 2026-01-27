"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";


const NAV_ITEMS = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "rounded-md px-4 py-2 text-base font-semibold transition",
        "text-zinc-700 hover:text-zinc-950",
        "hover:bg-zinc-100",
        active ? "bg-zinc-100 text-zinc-950" : "",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      {/* FULL-WIDTH BAR */}
      <div className="flex w-full items-center px-6 py-4">
        {/* Brand (left) */}
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-md px-2 py-1"
        >
          <Image
            src="/umich-logo.png"
            alt="University of Michigan"
            width={50}
            height={50}
            className="transition group-hover:scale-105"
            />
          <span className="text-base font-semibold tracking-tight text-zinc-950">
            Matthew Kooy
          </span>
        </Link>

        {/* Desktop nav (right) */}
        <nav className="ml-auto hidden items-center justify-end gap-2 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        {/* Mobile toggle (right) */}
        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-base font-semibold text-zinc-900 transition hover:bg-zinc-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <div className="border-t border-zinc-200/70 bg-white md:hidden">
          <div className="flex flex-col gap-1 px-6 py-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
