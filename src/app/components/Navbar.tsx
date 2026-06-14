"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";


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
      aria-current={active ? "page" : undefined}
      className={[
        "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
        active
          ? "bg-zinc-900 text-zinc-50"
          : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setOpen(false);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* Main navbar container */}
      <div className="border-b border-zinc-900 bg-zinc-950/85 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center px-6 py-4">
          {/* Brand (left) */}
          <Link
            href="/"
            className="rounded-md text-base font-semibold tracking-tight text-zinc-100 transition-colors duration-150 hover:text-white"
          >
            Matthew Kooy
          </Link>

          {/* Desktop nav (right) */}
          <nav className="ml-auto hidden items-center justify-end gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          {/* Mobile toggle (right) */}
          <button
            type="button"
            className="ml-auto inline-flex items-center justify-center rounded-md border border-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors duration-150 hover:border-zinc-700 hover:text-zinc-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile nav panel */}
        {open && (
          <div className="border-t border-zinc-900 md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
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
      </div>
    </header>
  );
}
