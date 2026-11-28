# Apostrophe — Nocturne Editorial Revamp

Working plan for the full visual and motion redesign of the Apostrophe official website.
Stack: Nuxt 4 · Tailwind 4 · GSAP 3.15.1 · Lenis · Netlify static.

---

## 1. Direction

**Nocturne editorial** — restrained, typographic, cinematic. No glows, no glassmorphism, no
gradient-mesh backgrounds. The only violet is the Release section's existing halo.

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#0A0A0B` | Base background |
| Bone | `#F3EEE5` | Primary text, About interlude background |
| Champagne | `#C6B08C` | Hairlines, micro-accents, cursor |
| Ash | `#8C877E` | Secondary text |
| Violet | `#8B5CF6` | Release section only |

- **Display:** Instrument Serif (400 + italic).
- **Body/UI:** Inter Tight (300–600).
- **Micro-labels/indices:** Oxanium (keep the local files).
- **Materials:** 3–4% film grain overlay, 1px hairlines at 12–14% opacity, 2px corner radius,
  buttons that fill with an ivory sweep, no pills.
- **Grid:** 12-column, `max-w-7xl`, asymmetric editorial placement, `py-32` → `py-44` rhythm.
- **Image grade:** warm monochrome for hero and Members; unified warm grade for Gallery; color
  returns only on Member hover.
- **About interlude:** one bone section, ink text, giant serif `'` watermark. The header inverts
  automatically over it.

---

## 2. Motion system

- **Engine:** Lenis (native scroll + inertia) integrated with the GSAP ticker and ScrollTrigger.
- **Plugins:** ScrollTrigger, SplitText, Flip, ScrollToPlugin (all ship with GSAP 3.15.1).
- **Tokens:** `power3.out` / `expo.out` for reveals, `power2.inOut` for scrubs; 0.3s micro,
  0.6–0.8s standard, 1.0–1.4s hero; stagger 0.06–0.12.
- **Only one true pin:** Gallery. Release uses CSS sticky, not a ScrollTrigger pin. No preloader.
- **Reduced motion:** every animation wrapped in `gsap.matchMedia()`. Content is visible by
  default — never `opacity-0` in the template — so no-JS and reduced-motion users get the full site.
- **Mobile (<1024px):** no pins, no scrubbed horizontal motion; native scroll-snap gallery;
  reveals and hero parallax retained; grain/blur reduced.
- **Custom cursor:** champagne dot with contextual labels ("Play", "View", "Drag"), fine-pointer
  desktop only, never hides the native cursor for keyboard users.

---

## 3. Section behavior

### Chrome
Floating header, logo left, `01–05` numbered links, hairline scroll-progress line.
Mobile opens a full-screen serif overlay with staggered links.

### Hero
Full-bleed warm-monochrome live shot, bottom-left serif title ("We are" italic / "Apostrophe"
huge), right-edge meta (`EST. 2023 / TASIKMALAYA / POP · ROCK · ALT`), genre marquee, one
"Hubungi Kami" sweep CTA, scroll cue. Social icons move to the footer.

Motion: image 1.06→1 scale + slow drift, masked line reveal, marquee loop, title parallax.

### Release
Sticky cover + spinning vinyl on the left, staged copy and player on the right, ghost
"BACK TO ME" text, violet palette confined here. Vinyl spins only while audio plays; waveform
stays audio-reactive; the existing sticky player is retained when scrolling away.

### About
Bone interlude, oversized serif statement, hairline rules, giant `'` watermark, pure type.
Motion: SplitText line-mask reveal, watermark parallax.

### Members
Alternating editorial rows, `01–05`, serif names, Oxanium role labels, 4/5 monochrome live
shots, clip-path image reveal, color-on-hover on desktop, generous spacing.

### Gallery
Two counter-scrolling rows of 12 images each, varied widths, unified grade. Pinned section
(~180vh) with scrubbed horizontal motion. Any image opens the Flip lightbox containing all 24.
Mobile: native scroll-snap rows, no pin.

### Finale
Giant serif "Hubungi Kami", one sweep button, slow
`APOSTROPHE · POP · ROCK · ALTERNATIVE` marquee, then a footer with an oversized Instrument
Serif wordmark, socials, and a hairline copyright row.

---

## 4. Technical plan

### New files
- `app/composables/useSmoothScroll.ts` — Lenis + ScrollTrigger ticker, anchor scrolling,
  reduced-motion bypass.
- `app/assets/data/motion.ts` — durations, eases, stagger tokens.
- `app/components/ui/AppButton.vue` — sweep-fill button/link.
- `app/components/ui/CustomCursor.vue`
- `app/components/ui/Marquee.vue`
- `app/components/ui/SectionLabel.vue`
- `app/components/ui/GrainOverlay.vue`
- `app/components/ui/ScrollProgress.vue`

### Modified files
- `package.json` — add `lenis`.
- `nuxt.config.ts` — Instrument Serif + Inter Tight font families.
- `app/plugins/gsap.client.ts` — register Flip and ScrollToPlugin.
- `app/composables/useGsap.ts` — expose Flip and SplitText.
- `app/assets/css/tailwind.css` — theme tokens, base styles, grain, focus-visible, scrollbar,
  reduced-motion rules.
- `app/layouts/default.vue` — grain, cursor, theme state, header/footer.
- `AppHeader`, `AppFooter`, `SocialMediaLinks`.
- `sections/Home`, `sections/Release`, `sections/About`, `sections/Members`, `sections/Gallery`,
  `sections/CTA`.
- `music/CoverArt`, `music/SeekBar`, `music/Waveform`, `music/StickyPlayer` — restyle only, keep
  player logic.
- `ImageViewer.vue` — Flip transition, focus trap, keyboard, focus return.
- `useAudioPlayer.ts` — behavior unchanged; wiring only.

### Assets
- Hero is **1.7MB**. Generate `hero-2400/1600/1200/800.webp` variants with ImageMagick and serve
  via `<img srcset sizes>` with explicit dimensions.
- Gallery totals **4.3MB** across 24 files; optionally re-encode at q≈72. Lazy-load everything
  below the fold.
- Keep plain `<img>` (not NuxtImg) to avoid the regression fixed in `38fff68`; add `width`,
  `height`, `loading`, `decoding`.
- Member images are 864² live shots; crop to 4/5 with `object-fit`, never upscale.

### Preserved
All section IDs and nav anchors, the audio player and waveform, `tests/release.test.mjs`,
Netlify config, SEO metadata, Indonesian body copy.

---

## 5. Build order — three review checkpoints

1. **Foundation + chrome + hero** — tokens, fonts, Lenis, GSAP plugins, grain, cursor, header,
   hero, responsive hero assets.
2. **Release + About + Members** — sticky listening room, bone interlude, editorial member rows.
3. **Gallery + finale + QA** — pinned counter-scroll rows, Flip lightbox, CTA/footer,
   reduced-motion audit, Lighthouse, `bun run generate`, existing test.

Isolated worktree + feature branch; nothing on `main` until approved. Local preview at each
checkpoint; Netlify deploy preview only on request.

---

## 6. Definition of done

- Lighthouse mobile: performance ≥ 90, accessibility and best practices 100.
- No CLS from fonts or images.
- 60fps scroll and gallery strip on a mid-range Android.
- Full keyboard access (nav, player, lightbox), visible focus states.
- Complete `prefers-reduced-motion` path: scrubs and pins removed, content visible.
- `tests/release.test.mjs` passes.
- `bun run generate` succeeds; no hydration warnings.
- Checked in Chrome, iOS Safari, Firefox.

---

## 7. Assumptions

Dark only. Indonesian body copy with English editorial labels. Light copy edits that do not
change facts. No new sections or features. Existing assets only. Modern browsers. Section order
and anchors unchanged. Local preview per checkpoint.
