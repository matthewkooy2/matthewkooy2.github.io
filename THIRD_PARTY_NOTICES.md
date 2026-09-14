# Design references and third-party notices

Scroll behavior uses Motion (https://motion.dev/docs/scroll).
The bar reveal is inspired by Bklit UI (https://bklit.com/docs/components/bar-chart);
the editorial type pairing is inspired by Manus (https://manus.im/features/webapp).
Those references are design inspiration, not installed UI components.

## Gallery iteration and preserved design studies

Gallery is the homepage on `codex/gallery-iteration`. Its active components,
styles, and motion bindings are in `src/app/components/gallery/`. The original
three studies at `/designs` remain on `codex/portfolio-scroll-redesign` at commit
`e3d5460`. All use Motion and custom React, CSS, and SVG implementations. No
Motion+ source or paid templates were copied. Their references are preserved below:

- Editorial: [Kokonut Scroll Text](https://kokonutui.com/docs/texts/scroll-text)
  for progressive word highlighting; Manus for editorial layout and typography.
- Signal: [Kokonut Background Paths](https://kokonutui.com/docs/backgrounds/background-paths)
  for restrained path motion and [Bklit Bar Chart](https://bklit.com/docs/components/bar-chart)
  for interactive dataset highlighting. Signal's path geometry is custom.
- Gallery: [Kokonut Card Stack](https://kokonutui.com/docs/cards/card-stack)
  for a stack that opens, adapted here to scroll; [Motion scroll pinning](https://motion.dev/examples/js-scroll-pinning)
  for horizontal motion during vertical scroll; [Bklit Ring Chart](https://bklit.com/docs/components/ring-chart)
  for animated concentric arcs and a linked legend.

The charts show supplied resume metrics. Dataset volumes are explicitly
non-additive; ring lengths use the largest displayed dataset as their scale.

Section 01's Magnetic Shelf takes interaction inspiration from
[Kokonut Spotlight Cards](https://kokonutui.com/docs/cards/spotlight-cards)
and use [Motion springs](https://motion.dev/docs/react-use-spring) for bounded
pointer attraction and tilt. It is a custom implementation; no component source
or additional UI package was copied.

The expanding-card trial uses [Motion layout animation](https://motion.dev/docs/react-layout-animations)
to move the same technology labels from horizontal to vertical positions without
stretching the text. Card height and work-detail opacity are animated separately.

## Temporary Michigan hero mark

`public/block-m.png` was sourced from the University of Michigan Center for RNA
Biomedicine [brand downloads](https://rna.umich.edu/resources/center-for-rna-biomedicine-brand-downloads/)
([original PNG](https://rna.umich.edu/wp-content/uploads/2024/07/block_m-hex.png)).
The block M is a University of Michigan trademark, not an MIT-licensed asset.
It is used here at the user's request for a local animation prototype. Review
the university's permitted-use and modification requirements or replace it with
a personal mark before public deployment; no endorsement or blanket license is
implied. The grayscale/blue particle treatment is part of this local experiment.

The image-to-particle-sphere interaction is independently implemented in canvas
from the user's supplied screen recording of a Motion example. No paid Motion+
source, photograph, or template was accessed or copied.

## Kokonut UI Background Paths

Path-generation geometry in `src/app/components/ScrollPortfolio.tsx` is adapted from
Background Paths by @dorianbaffier: https://kokonutui.com/r/background-paths.json.
The animation is adapted to follow page scroll.

MIT License

Copyright (c) 2025 kokonutUI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
