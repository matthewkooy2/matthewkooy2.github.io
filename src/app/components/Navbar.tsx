"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const pages = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

function Navigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-nav">
        <Link href="/" className="site-brand" onClick={() => setOpen(false)}>Matthew Kooy.</Link>
        <nav className="site-links" aria-label="Main navigation">
          <Link href="/#stack" onClick={() => setOpen(false)}>Stack</Link>
          <Link href="/#work" onClick={() => setOpen(false)}>Work</Link>
          <span className="site-page-links">
            <Link href="/#data">Data</Link>
            {pages.map(({ href, label }) => (
              <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
            ))}
          </span>
          <button type="button" className="site-menu-toggle" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
        </nav>
      </div>
      {open && <nav id="mobile-navigation" className="site-mobile-links" aria-label="More pages">
        {pages.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
      </nav>}
    </header>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Navigation key={pathname} pathname={pathname} />;
}
