---
name: Luminous Wellness
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bacac5'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#859490'
  outline-variant: '#3c4a46'
  surface-tint: '#3cddc7'
  primary: '#57f1db'
  on-primary: '#003731'
  primary-container: '#2dd4bf'
  on-primary-container: '#00574d'
  inverse-primary: '#006b5f'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#d5d7ff'
  on-tertiary: '#131e8c'
  tertiary-container: '#b3b9ff'
  on-tertiary-container: '#3641a9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#62fae3'
  primary-fixed-dim: '#3cddc7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005047'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#e0e0ff'
  tertiary-fixed-dim: '#bdc2ff'
  on-tertiary-fixed: '#000767'
  on-tertiary-fixed-variant: '#2f3aa3'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  h1:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  h2:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  h3:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style

This design system is built to evoke a sense of digital serenity and proactive vitality. The brand personality is clinical yet empathetic, balancing the precision of health data with the warmth of personal wellness coaching. 

The aesthetic direction is **Modern Minimalist with Glassmorphic accents**. By utilizing a deep, dark canvas, we reduce eye strain during late-night habit tracking or early-morning meditation. The visual language uses soft gradients and translucent layers to create a sense of breathability and depth, ensuring the interface feels like a living organism rather than a static spreadsheet. High-contrast typography and vibrant teal accents provide a clear path for the user’s eye, making complex health metrics immediately digestible.

## Colors

The color palette is anchored by a core "Vitality Teal" (#2DD4BF), which symbolizes health and clarity. This is set against a deep "Midnight Navy" (#0F172A) background to maximize comfort and contrast. 

- **Primary (Teal):** Used for primary actions, progress indicators, and successful health states.
- **Secondary (Sky):** Used for informational accents and secondary data visualizations.
- **Surface Tones:** Layers are built using progressively lighter shades of navy (#1E293B) to create visual hierarchy without breaking the dark-mode immersion.
- **Gradients:** Subtle linear gradients (Teal to Sky) are applied to primary cards and active states to provide a sense of movement and energy.

## Typography

Lexend is the exclusive typeface for this design system. Designed specifically to reduce visual stress and improve reading proficiency, it aligns perfectly with the wellness objective. 

Headlines utilize tighter letter-spacing and heavier weights to create a strong information scent. Body text maintains a generous line height to ensure readability of long-form health articles or workout instructions. Labels are set in medium weights with slight tracking (letter-spacing) to ensure they remain legible even at small sizes against dark backgrounds.

## Layout & Spacing

The design system employs a **fluid grid** model based on an 8px spacing rhythm. This ensures consistency across mobile and desktop views while maintaining a balanced "breathable" feel.

- **Mobile:** 4-column grid with 20px side margins.
- **Desktop:** 12-column grid with a maximum content width of 1200px.
- **Vertical Rhythm:** Elements are spaced using the `md` (16px) and `lg` (24px) units to group related health metrics, while `xxl` (48px) is reserved for separating major sections like "Daily Summary" and "Recommended Activities."

## Elevation & Depth

Depth is communicated through **Tonal Layering and Glassmorphism** rather than traditional heavy shadows.

- **Level 0 (Background):** The base navy color (#0F172A).
- **Level 1 (Cards/Containers):** A slightly lighter navy (#1E293B) with a 1px subtle stroke (#334155) to define edges.
- **Level 2 (Modals/Overlays):** Utilizes a backdrop-blur (20px) with a semi-transparent fill (Surface color at 80% opacity).
- **Shadows:** Where used, shadows are highly diffused (20-40px blur) and tinted with the Primary Teal color at very low opacity (5-10%) to create a "glow" effect rather than a dark cast.

## Shapes

The shape language is defined by **Rounded (Level 2)** corners, reinforcing the "soft" and "approachable" brand personality. 

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Main dashboard cards and content modules use `rounded-lg` (1rem / 16px).
- **Feature Elements:** Progress rings and specific call-to-action buttons may use `rounded-xl` (1.5rem / 24px) to stand out as touch-friendly, organic shapes.
- **Consistency:** All borders should maintain a soft profile; sharp 90-degree angles are strictly prohibited.

## Components

### Buttons
Primary buttons use a vibrant Teal-to-Sky linear gradient with white (#FFFFFF) text for maximum contrast. Secondary buttons use a ghost style: a 1px teal border with teal text. Interaction states should include a subtle "glow" (outer shadow) on hover.

### Cards
Health data cards should use the Level 1 surface color. Header sections within cards may use a very subtle gradient background to distinguish between the title and the data points.

### Inputs & Selectors
Form fields utilize the dark navy surface with a 1px border that illuminates to Teal on focus. No manual age selection components are included; user profiles will dynamically adjust the interface goals based on backend data.

### Chips & Tags
Used for categories like "Cardio," "High Intensity," or "Sleep." These should be pill-shaped with a low-opacity Teal fill and high-opacity Teal text to remain legible without competing with primary buttons.

### Progress Indicators
Circular and linear progress bars must use the Primary Teal. For "completed" states, a subtle outer glow is added to the progress line to signify achievement.

### Lists
List items should be separated by soft dividers (#1E293B) rather than harsh lines. Each item should have a generous 16px internal padding to ensure touch targets are accessible for active users.