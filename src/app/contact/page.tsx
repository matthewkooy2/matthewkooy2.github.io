import Link from "next/link";

function IconLinkedIn(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5ZM.5 8H4.5V23H.5V8ZM8 8H11.8V10.1h.05C12.38 9 13.7 7.9 15.9 7.9c4.05 0 4.8 2.66 4.8 6.12V23h-4V15.7c0-1.74-.03-3.98-2.43-3.98-2.43 0-2.8 1.9-2.8 3.86V23H8V8Z"
      />
    </svg>
  );
}

function IconGitHub(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.75 5.62.75 12c0 5.1 3.29 9.42 7.86 10.95.57.11.78-.25.78-.56v-2.1c-3.2.71-3.88-1.58-3.88-1.58-.52-1.36-1.27-1.72-1.27-1.72-1.04-.73.08-.72.08-.72 1.15.08 1.76 1.22 1.76 1.22 1.03 1.8 2.7 1.28 3.36.98.1-.76.4-1.28.73-1.57-2.56-.3-5.25-1.31-5.25-5.83 0-1.29.45-2.35 1.2-3.18-.12-.3-.52-1.53.11-3.2 0 0 .98-.32 3.2 1.21a10.7 10.7 0 0 1 2.92-.4c.99 0 1.98.13 2.92.4 2.22-1.53 3.2-1.21 3.2-1.21.63 1.67.23 2.9.11 3.2.75.83 1.2 1.89 1.2 3.18 0 4.53-2.7 5.53-5.27 5.82.41.37.78 1.1.78 2.22v3.29c0 .31.2.67.79.56A11.28 11.28 0 0 0 23.25 12C23.25 5.62 18.27.5 12 .5Z"
      />
    </svg>
  );
}

function IconMail(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
      />
    </svg>
  );
}

function IconPhone(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={props.className}>
      <path
        fill="currentColor"
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.07 21 3 13.93 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2Z"
      />
    </svg>
  );
}

type ContactItem = {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
};

function ContactRow({ item }: { item: ContactItem }) {
  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur transition hover:bg-white/[0.07]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-zinc-100">
          {item.icon}
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-zinc-50">{item.label}</div>
          <div className="truncate text-sm text-zinc-300">{item.value}</div>
        </div>
      </div>

      <span className="flex-none text-zinc-500 transition group-hover:text-zinc-200">
        ↗
      </span>
    </Link>
  );
}

export default function ContactPage() {
  const socials: ContactItem[] = [
    {
      label: "LinkedIn",
      value: "linkedin.com/in/matthew-kooy",
      href: "https://www.linkedin.com/in/matthew-kooy/",
      icon: <IconLinkedIn className="h-5 w-5" />,
      external: true,
    },
    {
      label: "GitHub",
      value: "github.com/matthewkooy2",
      href: "https://github.com/matthewkooy2",
      icon: <IconGitHub className="h-5 w-5" />,
      external: true,
    },
  ];

  const emails: ContactItem[] = [
    {
      label: "School Email",
      value: "mkooy@umich.edu",
      href: "mailto:mkooy@umich.edu",
      icon: <IconMail className="h-5 w-5" />,
    },
    {
      label: "Personal Email",
      value: "kooymatthew@gmail.com",
      href: "mailto:kooymatthew@gmail.com",
      icon: <IconMail className="h-5 w-5" />,
    },
  ];

  const phone: ContactItem = {
    label: "Phone",
    value: "+1 (616) 252-9113",
    href: "tel:+16162529113",
    icon: <IconPhone className="h-5 w-5" />,
  };

  return (
    // FULL-BLEED WRAPPER (this is what fixes the “square cutoff”)
    <div className="relative w-full">
      {/* Full page glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 h-[780px] w-[780px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/15 to-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-[-360px] left-[-360px] h-[780px] w-[780px] rounded-full bg-gradient-to-br from-fuchsia-500/18 via-indigo-500/12 to-transparent blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-360px] h-[720px] w-[720px] rounded-full bg-gradient-to-br from-cyan-500/14 via-indigo-500/10 to-transparent blur-3xl" />
      </div>

      {/* Content container */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
          Contact
        </h1>

        <p className="mt-4 max-w-3xl text-2xl font-semibold leading-snug tracking-tight text-zinc-100">
          Discover my work and see where you can find me
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur md:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-50">Social</h2>
              <span className="text-xs text-zinc-400">Links open in new tab</span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {socials.map((item) => (
                <ContactRow key={item.label} item={item} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur md:p-6">
            <h2 className="text-sm font-semibold text-zinc-50">Direct</h2>

            <div className="mt-4 flex flex-col gap-3">
              <ContactRow item={emails[0]} />
              <ContactRow item={emails[1]} />
              <ContactRow item={phone} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
