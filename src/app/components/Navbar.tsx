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
      className={[
        "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
        "border",
        active
          ? "border-white/30 bg-white/10 text-white"
          : "border-white/10 text-zinc-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white",
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
    <header className="sticky top-0 z-50">
      {/* Main navbar container */}
      <div className="border-b border-white/15 bg-white/[0.08] backdrop-blur-xl">
        <div className="flex w-full items-center px-6 py-4">
          {/* Brand (left) */}
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-base font-semibold tracking-tight text-zinc-100 transition-all duration-200 hover:bg-white/[0.05]"
          >
            Matthew Kooy
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
            className="ml-auto inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.05] px-4 py-2 text-sm font-medium text-zinc-200 transition-all duration-200 hover:bg-white/[0.10] hover:border-white/25 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile nav panel */}
        {open && (
          <div className="border-t border-white/10 md:hidden">
            <div className="flex flex-col gap-2 px-5 py-4">
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
