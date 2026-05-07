/** Paleta Luminous Wellness / Vitality (diseño/app). */
export const colors = {
  background: "#0b1326",
  surface: "#0b1326",
  surfaceContainerLowest: "#060e20",
  surfaceContainerLow: "#131b2e",
  surfaceContainer: "#171f33",
  surfaceContainerHigh: "#222a3d",
  surfaceContainerHighest: "#2d3449",
  surfaceBright: "#31394d",
  onSurface: "#dae2fd",
  onSurfaceVariant: "#bacac5",
  outline: "#859490",
  outlineVariant: "#3c4a46",
  primary: "#57f1db",
  primaryContainer: "#2dd4bf",
  onPrimary: "#003731",
  onPrimaryContainer: "#00574d",
  secondary: "#7bd0ff",
  secondaryContainer: "#00a6e0",
  onSecondaryContainer: "#00374d",
  tertiary: "#d5d7ff",
  tertiaryContainer: "#b3b9ff",
  error: "#ffb4ab",
  slate950: "#020617",
  slate800: "#1e293b",
  gradientStart: "#2dd4bf",
  gradientEnd: "#38bdf8",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  containerMargin: 20,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  display: { fontSize: 48, lineHeight: 56, fontWeight: "700" as const },
  h1: { fontSize: 32, lineHeight: 40, fontWeight: "600" as const },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: "600" as const },
  h3: { fontSize: 20, lineHeight: 28, fontWeight: "500" as const },
  bodyLg: { fontSize: 18, lineHeight: 28, fontWeight: "400" as const },
  bodyMd: { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500" as const,
    letterSpacing: 1,
  },
  button: { fontSize: 16, lineHeight: 20, fontWeight: "600" as const },
};
