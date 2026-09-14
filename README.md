# Matthew Kooy — Gallery Portfolio

## Local Gallery iteration

Active branch: `codex/gallery-iteration`. Gallery is now the homepage, without
the design switcher or comparison screens. Its typography, fan-to-grid stack,
horizontal project reel, and animated ring chart are retained.

The current color treatment uses silver and graphite sections, light-to-dark
neutral cards, a charcoal data section, and cobalt accents. Shared colors live in
`src/app/globals.css`; Gallery's section-specific colors are in `Gallery.module.css`.

```bash
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open [the Gallery homepage](http://127.0.0.1:3000).
The former `/designs/gallery` URL redirects to `/`.
Legacy `/about`, `/experience`, `/projects`, `/projects/:id`, and `/contact` URLs return to their matching homepage anchors. Employer and club fragments on old experience links are preserved. Project details expand within the homepage cards; external source, social, and email links retain their destinations.

### Where to iterate

All active Gallery code is in `src/app/components/gallery/`:

- `GalleryPortfolio.tsx`: page composition, navigation, hero, and footer.
- `GalleryExtracurriculars.tsx`: section 03's college-club roles, contribution summaries, and skills.
- `GallerySections.tsx`: the toolkit export and section 02 work-experience reel.
- `GalleryProjects.tsx`: section 04's complete project grid, with scroll-entry motion and blue hover/focus accents.
- `src/app/projects/data.ts`: the shared project catalog for homepage summaries and inline details. Add a record here to list a new project.
- `GalleryStack.tsx`: section 01's Magnetic Shelf with one expanding card at a
  time. Hover, keyboard focus, or tapping selects content.
- `HoverStackCard.tsx` / `stackMotion.ts` / `HoverStack.module.css`: bounded
  magnetic attraction, downward card expansion, label reflow, and their local styles.
- `StackDetailDialog.tsx`: optional “More detail” view for the selected technology.
- `stackDetails.ts`: evidence-grounded usage copy for the 23 listed technologies.
- `WarehouseChart.tsx`: interactive concentric-ring chart.
- `useGalleryMotion.ts`: scroll bindings and reduced-motion fallbacks.
- `Gallery.module.css`: Gallery-only styles and responsive layouts.
- `content.ts`: technologies, work-experience summaries, and verified data volumes.

Run `npm run build` and `npm run lint` to validate changes. Short/narrow screens
use normal flow or a native horizontal reel; reduced-motion users retain complete
text, charts, and project navigation.

Section 01 is testing an expanding-card variation of Magnetic Shelf. There is no
separate panel below the cards. Hover/focus/tap grows one card downward from 9.5rem
to its natural content height. The same technology labels move from a wrapped horizontal row to a
vertical list using position-only layout animation, followed by the work details
fading in inside that card. There is no height cap or inner scrolling area: the
grid and section grow with the card so the complete text remains in normal page
flow. The optional deep dive retains the complete technology explanation.
The fan still spreads on scroll entry, but no longer pins this section to a
viewport-sized frame. Its entry offsets use the section top so expansion cannot
rewind the scroll animation. The project reel's pinning is unchanged.

A 220ms leave grace period keeps links reachable, and keyboard focus keeps the
card open while navigating it. Escape, the close button, and an outside press
collapse it. Hidden content is inert. Desktop card tops and magnetic measurement
areas stay stable; mobile rows make room for the expanded card. Magnetic motion
still reaches 200px beyond each card and is bounded to 24px/18px with up to 5 degrees
of tilt. The pre-expansion version is saved locally at
`/tmp/magnetic-shelf-before-expand.HhBG7o` for this design trial (temporary backup).
Fine-pointer and reduced-motion checks disable proximity effects when unsuitable.
The optional deep dive retains Escape/backdrop dismissal and focus restoration.
Run `node --test tests/gallery-stack.test.cjs` for content, rendering, and motion
bounds checks. R and GitHub Actions remain general descriptions pending specific
user-confirmed examples. Other sections are unchanged; the toolkit's natural
height does not disable the project reel.

Section 03 is Extracurriculars: Michigan Blockchain Club, Wolverine Sports
Analytics, and IPO Investing Club. Role titles and dates match the existing
Experience page; concise contribution summaries and skills live in the
`extracurriculars` array in `content.ts`. Three light-to-dark neutral rows enter
on scroll, retain all text in normal flow, and stack their columns on mobile.
Blue hover/focus accents match the Gallery, with reduced-motion support.

Section 02 is Work Experience, with Team Financial Group first and AirPLAi
Sports second. Each card includes the internship title, dates, location, tools,
and three contribution highlights. Employer anchors use the reel’s own scroll model to reveal the correct card.
The contribution highlights sit side-by-side on wider screens so full cards fit
without clipping or inner scrolling. Scroll-driven pinning has its own 720px
width breakpoint, independent of section 01's 900×740 threshold; it measures the
complete reel in normal flow before pinning and uses the horizontal travel
distance for its scroll length. Short windows or enlarged text that cannot fit
the full reel, phones, and reduced-motion users retain native horizontal
navigation. Resize and font-load changes remeasure the reel. The hook regression
tests cover the 838×814 split preview, 1280×700 laptop, navigation, and fallbacks.
Personal projects remain in the homepage’s Projects section.

Section 04 lists all nine existing projects in a two-column gallery, becoming a
single column below 720px. Each entry includes its category, description, full
technology list, expandable details when documented, and a source link when one is already documented.
The staggered lateral/vertical entry motion settles as each card enters; content
stays readable without JavaScript or with reduced motion. The warehouse feature
is preserved immediately after the project grid as section 05.

### Interactive hero mark

The hero automatically cycles sphere → block M → sphere → C++ → sphere →
computer vision (an eye with tracking brackets). Each 11.2-second beat holds the
rotating sphere for 3.2 seconds, morphs for 2.8 seconds, holds the symbol for 2.4
seconds, and returns to the sphere over 2.8 seconds. Quintic easing brings each
morph to rest smoothly. Pointer distance does not affect the sequence. Click,
tap, or Enter/Space pauses/resumes; Escape pauses. The same grains persist across
all shapes, with destinations generated once by `heroLoop.ts`. Fifteen small dotted
motifs cover the sphere: code brackets, Python, React-style orbits, Git branching,
C++, a database, Java-style coffee, a terminal, a chip, a container, a Rust-style
gear, braces, a network, a lightning
bolt, and a vision eye. Equal-area spacing distributes them across both hemispheres;
great-circle mapping keeps each contour on the sphere's surface. Each grain
uses the sphere's rotation and perspective, staying visible on both hemispheres
with smoothly reduced contrast on the far side and
no text labels or backing panels. The details fade before morphing or departing.
The animation fills the hero's open right-hand area between the navigation and
bottom introduction, with no fixed desktop width cap. Its square canvas fits
the stage's smaller dimension so neither the M nor the sphere is stretched.
The name and introduction remain alongside it, stacking above/below on phones.
`HeroParticleMark.tsx` owns the shared viewport canvas lifecycle; `heroParticles.ts`
contains deterministic silhouette sampling and 3D projection. No animation
dependency was added. The hero loop freezes its current shape and orientation on scroll and resumes on return; below it, a critically damped scroll follower and slow orbital currents keep the
cloud moving naturally. Hidden tabs pause rendering. Reduced motion and canvas/image failure retain a static
logo and static section markers. The source image is a temporary
local-prototype asset; see its provenance and publishing caveat in the notices.

### Scroll-driven particle checkpoints

The same sampled grains arc across the viewport in overlapping currents and regroup
at Stack (code brackets), Experience (linked rings), Clubs (connected nodes),
Projects (a four-tile grid), Data (bars), and the footer (the block M). Scroll guides the sequence through a critically damped follower, so grains carry
momentum and settle after input stops. Traveling grains continue to drift; docked
symbols breathe subtly. Curved transitions vary by grain instead of turning at a
right angle. During travel, `particleBackdrops.ts` copies the cloud into visible
section backgrounds below all text, cards, and controls. Hero and settled checkpoint
formations retain their original foreground canvas. Navigation and the horizontal
reel remain clipped out. The hero pause control also pauses ambient motion, and
reduced motion retains the static fallbacks.

`particleJourney.ts` defines the checkpoint list, formations, and pure scroll/path
math. `ParticleCheckpoint.tsx` reserves each destination in the section heading.
`mountParticleJourney.ts` renders the shared cloud and remeasures after
resizing, font loading, or section-height changes, including expanded toolkit
cards. Native section-link offsets are included in checkpoint timing. Keep the
Experience marker compact so the entire pinned reel still fits short desktops.

### Preserved comparison version

The original homepage and all three design studies are saved on
`codex/portfolio-scroll-redesign` at commit `e3d5460`. Switch to that branch to
revisit `/designs`; do not discard uncommitted iteration work when switching.
No commits have been pushed and no deployment configuration was changed.

See `THIRD_PARTY_NOTICES.md` for design references. Next.js and its ESLint
configuration are pinned to 16.3.5. Compatible dependency patches were applied;
the full `npm audit` reported zero vulnerabilities on September 13, 2026.

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
