# Matthew Kooy — Gallery Portfolio

## Local Gallery iteration

Active branch: `codex/gallery-iteration`. Gallery is now the homepage, without
the design switcher or comparison screens. Its typography, fan-to-grid stack,
horizontal project reel, and animated ring chart are retained.

```bash
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open [the Gallery homepage](http://127.0.0.1:3000).
The former `/designs/gallery` URL redirects to `/`.
About, experience, project details, and contact remain available.

### Where to iterate

All active Gallery code is in `src/app/components/gallery/`:

- `GalleryPortfolio.tsx`: page composition, navigation, hero, and footer.
- `GallerySections.tsx`: technology cards and project reel.
- `WarehouseChart.tsx`: interactive concentric-ring chart.
- `useGalleryMotion.ts`: scroll bindings and reduced-motion fallbacks.
- `Gallery.module.css`: Gallery-only styles and responsive layouts.
- `content.ts`: technologies, project summaries, and verified data volumes.

Run `npm run build` and `npm run lint` to validate changes. Short/narrow screens
use normal flow or a native horizontal reel; reduced-motion users retain complete
text, charts, and project navigation.

### Preserved comparison version

The original homepage and all three design studies are saved on
`codex/portfolio-scroll-redesign` at commit `e3d5460`. Switch to that branch to
revisit `/designs`; do not discard uncommitted iteration work when switching.
No commits have been pushed and no deployment configuration was changed.

See `THIRD_PARTY_NOTICES.md` for design references. Before public deployment,
address the existing Next.js 16.1.5 dependency advisories reported by `npm audit`.

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
