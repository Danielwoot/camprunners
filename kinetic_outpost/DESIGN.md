---
name: Kinetic Outpost
colors:
  surface: '#101414'
  surface-dim: '#101414'
  surface-bright: '#363a3a'
  surface-container-lowest: '#0b0f0f'
  surface-container-low: '#181c1c'
  surface-container: '#1c2020'
  surface-container-high: '#272b2b'
  surface-container-highest: '#313635'
  on-surface: '#e0e3e2'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e0e3e2'
  inverse-on-surface: '#2d3131'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#d3fbff'
  on-secondary: '#00363a'
  secondary-container: '#00eefc'
  on-secondary-container: '#00686f'
  tertiary: '#ffffff'
  on-tertiary: '#1f3434'
  tertiary-container: '#d0e7e6'
  on-tertiary-container: '#536868'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#7df4ff'
  secondary-fixed-dim: '#00dbe9'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#d0e7e6'
  tertiary-fixed-dim: '#b4cbca'
  on-tertiary-fixed: '#091f1f'
  on-tertiary-fixed-variant: '#354b4a'
  background: '#101414'
  on-background: '#e0e3e2'
  surface-variant: '#313635'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
spacing:
  grid-unit: 4px
  gutter: 24px
  margin-sm: 16px
  margin-md: 40px
  margin-lg: 80px
  container-max: 1440px
---

## Brand & Style

The design system is engineered for the high-performance explorer. It translates the raw energy of off-grid adventure into a digital HUD (Heads-Up Display) experience. The aesthetic is rooted in **Neo-Brutalism** and **Technical Futurism**, emphasizing utility, precision, and high-velocity navigation.

The target audience consists of modern campers and "overlanders" who view gear as equipment rather than lifestyle accessories. The UI should evoke a sense of operational readiness—clean, high-contrast, and strictly functional. Visuals are dominated by a dark tactical base, accented by high-visibility "electric" signals, mimicking the look of night-vision equipment or tactical navigation systems.

## Colors

The palette is optimized for low-light legibility and high-impact hierarchy. 

- **Primary (Electric Lime):** Used exclusively for critical actions, active states, and essential data points. It is the "signal" in the noise.
- **Secondary (Tactical Cyan):** Used for data visualization, secondary interactive elements, and subtle glow effects that simulate a backlit display.
- **Neutral / Background:** A deep, near-black "Obsidian" forms the foundation. Surfaces use a "Stealth Teal" (#101616) to provide subtle separation from the background without losing the dark-mode immersion.
- **Grid Accent:** A muted teal (#0A2A2A) is used for the structural background grid, reinforcing the technical, mapped nature of the interface.

## Typography

Typography functions as a data-delivery system. The hierarchy is steep to ensure immediate recognition of information.

- **Headlines:** Use **Space Grotesk** for its aggressive, geometric architecture. All-caps is preferred for primary section headers to mimic tactical signage.
- **Body:** **Geist** provides a clean, technical sans-serif experience that remains readable even in high-density data views.
- **Labels & Data:** **JetBrains Mono** is utilized for coordinates, timestamps, and equipment specs, grounding the UI in a developer/technical aesthetic.

## Layout & Spacing

This design system uses a **Rigid Grid** model inspired by topographical maps and architectural blueprints.

- **Global Grid:** A persistent 24px background grid is visible on the primary background layer. All components must snap to this grid.
- **Desktop (12 columns):** 24px gutters, 80px side margins. Content is often organized into "modules" that take up specific column spans (e.g., 4 columns for filters, 8 for results).
- **Mobile (4 columns):** 16px gutters and margins. Top-level navigation collapses into a "Command Hub" (bottom navigation) to keep the thumb-zone clear for map interaction.
- **Rhythm:** Spacing follows a 4px baseline, but large-scale layout transitions should use 40px or 80px increments to create a bold, intentional structure.

## Elevation & Depth

Depth is conveyed through **Hard Layers** and **Luminous Accents** rather than traditional shadows.

- **Tonal Layering:** The background is the darkest layer (#080C0C). "Containers" are slightly lighter (#101616). Active elements use a very subtle inner-glow in the primary color.
- **Technical Borders:** Elevation is marked by 1px solid borders in #1A2F2F. When an element is focused or active, the border switches to the Primary Electric Lime.
- **HUD Overlays:** Modals and tooltips use a semi-transparent dark teal backdrop with a 10px blur, making them feel like glass overlays on a digital scope.

## Shapes

The shape language is **Strictly Geometric**. 

- **Corners:** 0px radius (Sharp) for all buttons, containers, and input fields. This reinforces the rugged, industrial feel of camping gear.
- **Bevels:** For distinctive elements like primary CTA buttons, use a 45-degree "clipped corner" (using CSS clip-path) on the top-right to mimic military-spec equipment.
- **Stroke:** Consistent 1px or 2px strokes are used to define boundaries. No soft edges or organic curves are permitted.

## Components

- **Buttons:** Primary buttons are solid Electric Lime with black text. Secondary buttons are outlined in Tactical Cyan with a subtle glow on hover. No rounded corners.
- **Inputs:** Dark backgrounds with a bottom-only border that glows when focused. Labels should always be in the `label-caps` mono font style above the field.
- **Cards:** Use a "modular frame" look. 1px border, no shadow, with a header section separated by a horizontal rule. Metadata (e.g., trail distance, weather) should use `data-mono`.
- **Chips/Tags:** Small rectangular boxes with 1px borders. If a status is "Active" (e.g., Camp Open), use a solid Electric Lime fill.
- **Status Indicators:** Small 8px squares (not circles) to indicate availability or connectivity status.
- **Progress Bars:** Segmented bars rather than a continuous line, mimicking a battery or signal strength indicator.