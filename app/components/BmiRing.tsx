import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { colors, typography } from "../theme/vitality";
import { font } from "../theme/fonts";

type Props = {
  /** Valor IMC mostrado en el centro. */
  imc: number;
  /** 0–1 fracción del anillo “progreso” (p. ej. posición en escala 14–45). */
  progress: number;
  /** Subtítulo bajo el número (categoría corta). */
  subtitulo: string;
};

const SIZE = 220;
const STROKE_BG = 6;
const STROKE_FG = 8;
const R = (SIZE - STROKE_FG) / 2 - 4;
const CX = SIZE / 2;
const CY = SIZE / 2;
const CIRC = 2 * Math.PI * R;

export default function BmiRing({ imc, progress, subtitulo }: Props) {
  const p = Math.min(1, Math.max(0, progress));
  const dashOffset = CIRC * (1 - p);

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} style={styles.svg}>
        <G rotation={-90} origin={`${CX}, ${CY}`}>
          <Circle
            cx={CX}
            cy={CY}
            r={R}
            stroke={colors.surfaceContainerHigh}
            strokeWidth={STROKE_BG}
            fill="none"
          />
          <Circle
            cx={CX}
            cy={CY}
            r={R}
            stroke={colors.primary}
            strokeWidth={STROKE_FG}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${CIRC}`}
            strokeDashoffset={dashOffset}
          />
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.imc}>{imc.toFixed(1)}</Text>
        <Text style={styles.sub}>{subtitulo.toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {},
  center: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  imc: {
    fontFamily: font.bold,
    fontSize: typography.display.fontSize * 0.75,
    lineHeight: typography.display.lineHeight * 0.75,
    color: colors.primary,
    letterSpacing: typography.display.fontSize * -0.02,
  },
  sub: {
    marginTop: 4,
    fontFamily: font.medium,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.onSurfaceVariant,
  },
});
