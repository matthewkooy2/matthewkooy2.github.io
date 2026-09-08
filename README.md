# Matthew Kooy — Portfolio

## Local scrolling redesign

Branch: `codex/portfolio-scroll-redesign`. This work is local-only; no deployment configuration was changed.

```bash
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open [the local preview](http://127.0.0.1:3000). The homepage uses Motion for scroll-linked technology chapters, layered work cards, a path background, and NBA dataset bars. Chapter buttons and a skip link provide direct navigation. Reduced-motion preferences and short viewports retain readable, unpinned content. The original detail routes remain accessible; Mini Tetris is expandable below the contact section.

The implementation lives in `src/app/components/ScrollPortfolio.tsx` and its CSS module. See `THIRD_PARTY_NOTICES.md` for reference attribution. Run `npm run build` and `npm run lint` to validate changes.

Before public deployment, address the existing Next.js 16.1.5 dependency advisories reported by `npm audit`. The redesign preserves the existing framework version and adds only Motion.

### Compare three alternatives

Open [Design studies](http://127.0.0.1:3000/designs) to compare Editorial, Signal,
and Gallery. The current homepage is unchanged by these alternative studies.
The comparison table links directly to every hero, stack, work, and data section.

Alternative sections live in `src/app/designs/EditorialSections.tsx`,
`SignalSections.tsx`, and `GallerySections.tsx`. Shared content is in `data.ts`;
chart treatments are in `WarehouseDisplay.tsx`, and scroll bindings are in
`useStudyMotion.ts`. This separation supports combining sections after selection.

Reduced motion keeps text and charts complete and the project reel natively
scrollable. On narrow or short screens, full-screen pinning becomes normal flow
or a touch-scrollable reel. The animations do not intercept wheel/touch events.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
