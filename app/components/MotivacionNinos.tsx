import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { WhoSex } from "../logic/whoBmiLmsData";

type Props = {
  sexo: WhoSex | "";
  /** Categoría OMS del resultado (define qué ilustración mostrar). */
  categoria: string;
};

function mensajeEjercicioObesidad(sexo: WhoSex | ""): string {
  if (sexo === "masculino") {
    return (
      "Según la curva OMS, tu hijo está en rango de obesidad para su edad. " +
      "Es importante que haga más ejercicio y actividad física (juego, deporte, caminatas en familia), " +
      "siempre con el plan que indique pediatra o nutricionista."
    );
  }
  if (sexo === "femenino") {
    return (
      "Según la curva OMS, tu hija está en rango de obesidad para su edad. " +
      "Es importante que haga más ejercicio y actividad física (juego, deporte, caminatas en familia), " +
      "siempre con el plan que indique pediatra o nutricionista."
    );
  }
  return (
    "Según la curva OMS, hay obesidad para la edad. Es recomendable que hagan más ejercicio " +
    "y actividad física (juego, deporte, caminatas en familia), siempre con el plan que indique " +
    "pediatra o nutricionista."
  );
}

function mensajeDelgadez(
  sexo: WhoSex | "",
  severa: boolean,
  esBajoPesoAdulto: boolean
): string {
  if (esBajoPesoAdulto) {
    if (sexo === "masculino") {
      return (
        "El IMC indica bajo peso. Refuerza comidas regulares y nutritivas para tu hijo " +
        "y consulta con un profesional de la salud para orientación adecuada."
      );
    }
    if (sexo === "femenino") {
      return (
        "El IMC indica bajo peso. Refuerza comidas regulares y nutritivas para tu hija " +
        "y consulta con un profesional de la salud para orientación adecuada."
      );
    }
    return (
      "El IMC indica bajo peso en menor de edad. Conviene comidas completas, alimentación " +
      "nutritiva y valoración con pediatría o nutrición."
    );
  }

  const urgencia = severa
    ? "El resultado sugiere delgadez importante respecto a la referencia OMS. "
    : "La curva OMS indica delgadez para la edad. ";

  if (sexo === "masculino") {
    return (
      urgencia +
      "Prioriza comidas completas y regulares para tu hijo, snacks nutritivos y valoración " +
      "con pediatra o nutrición infantil; el crecimiento sano se apoya en energía y nutrientes de calidad."
    );
  }
  if (sexo === "femenino") {
    return (
      urgencia +
      "Prioriza comidas completas y regulares para tu hija, snacks nutritivos y valoración " +
      "con pediatra o nutrición infantil; el crecimiento sano se apoya en energía y nutrientes de calidad."
    );
  }
  return (
    urgencia +
    "Conviene comidas completas y regulares, alimentos nutritivos y valoración con pediatría " +
    "o nutrición infantil para acompañar un crecimiento saludable."
  );
}

/**
 * Ilustración + mensaje según categoría OMS (sin venta).
 */
export default function MotivacionNinos({ sexo, categoria }: Props) {
  if (categoria === "Obesidad") {
    return (
      <View
        style={s.wrapObesidad}
        accessibilityLabel="Mensaje sobre más actividad física para niños con obesidad según OMS"
      >
        <Text style={s.tituloObesidad}>¡Hora de moverse más!</Text>

        <View style={s.escenaObesidad}>
          <View style={s.pista} />
          <Text style={s.iconoCorre}>🏃</Text>
          <Text style={s.iconoPelota}>⚽</Text>
          <View style={s.meta} />
        </View>

        <Text style={s.mensajeObesidad}>{mensajeEjercicioObesidad(sexo)}</Text>
      </View>
    );
  }

  const esDelgadezVisual =
    categoria === "Delgadez" ||
    categoria === "Delgadez severa" ||
    categoria === "Bajo peso";

  if (esDelgadezVisual) {
    const severa = categoria === "Delgadez severa";
    return (
      <View
        style={s.wrapDelgadez}
        accessibilityLabel="Ilustración sobre alimentación y crecimiento para delgadez según OMS"
      >
        <Text style={s.tituloDelgadez}>Nutrición y crecimiento</Text>

        <View style={s.escenaDelgadez}>
          <View style={s.brilloSuave} />

          <View style={s.mesaDelgadez} />

          <View style={s.zonaComida}>
            <Text style={s.emojiPlato}>🍽️</Text>
            <Text style={s.emojiFruta}>🍎</Text>
            <Text style={s.emojiLeche}>🥛</Text>
          </View>

          <View style={s.ninoDelgado}>
            <View style={s.cabezaDelgada} />
            <View style={s.cuelloDelgado} />
            <View style={s.torsoDelgado} />
            <View style={s.piernasDelgadas}>
              <View style={s.piernaDelgada} />
              <View style={[s.piernaDelgada, s.piernaDelgadaDer]} />
            </View>
          </View>

          <Text style={s.emojiCorazon}>💜</Text>
        </View>

        <Text style={s.mensajeDelgadez}>
          {mensajeDelgadez(sexo, severa, categoria === "Bajo peso")}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={s.wrap}
      accessibilityLabel="Ilustración motivacional: paisaje con sol y figura"
    >
      <Text style={s.titulo}>¡Sigue así!</Text>

      <View style={s.escena}>
        <View style={s.sol} />
        <View style={s.nube}>
          <View style={s.nubeCirculo} />
          <View style={[s.nubeCirculo, { marginLeft: -8, marginTop: 4 }]} />
          <View style={[s.nubeCirculo, { marginLeft: -8 }]} />
        </View>
        <View style={s.nubeDerecha}>
          <View style={[s.nubeCirculo, { width: 18, height: 18 }]} />
          <View
            style={[s.nubeCirculo, { width: 22, height: 22, marginLeft: -6 }]}
          />
        </View>

        <View style={s.colina} />

        <View style={s.persona}>
          <View style={s.cabeza} />
          <View style={s.cuerpo} />
          <View style={s.piernasFila}>
            <View style={s.pierna} />
            <View style={[s.pierna, s.piernaDer]} />
          </View>
        </View>

        <Text style={s.estrella} accessibilityLabel="Estrella">
          ✨
        </Text>
      </View>

      <Text style={s.mensaje}>
        Moverte, dormir bien y comer variado también es cuidarte. ¡Cada día cuenta!
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#e8f4fc",
    borderWidth: 1,
    borderColor: "#b3d9f2",
  },
  wrapObesidad: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff3e0",
    borderWidth: 1,
    borderColor: "#ffb74d",
  },
  wrapDelgadez: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f3e5f5",
    borderWidth: 1,
    borderColor: "#ce93d8",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1565c0",
    textAlign: "center",
    marginBottom: 12,
  },
  tituloObesidad: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e65100",
    textAlign: "center",
    marginBottom: 12,
  },
  tituloDelgadez: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6a1b9a",
    textAlign: "center",
    marginBottom: 12,
  },
  escena: {
    height: 132,
    borderRadius: 12,
    backgroundColor: "#b3e5fc",
    overflow: "hidden",
    position: "relative",
  },
  escenaObesidad: {
    height: 120,
    borderRadius: 12,
    backgroundColor: "#c8e6c9",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  escenaDelgadez: {
    height: 138,
    borderRadius: 12,
    backgroundColor: "#ede7f6",
    overflow: "hidden",
    position: "relative",
  },
  brilloSuave: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  mesaDelgadez: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: "#d7ccc8",
    borderTopWidth: 3,
    borderColor: "#a1887f",
  },
  zonaComida: {
    position: "absolute",
    bottom: 28,
    left: "50%",
    marginLeft: -48,
    width: 96,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  emojiPlato: {
    fontSize: 36,
  },
  emojiFruta: {
    fontSize: 22,
    marginBottom: 4,
    marginLeft: 4,
  },
  emojiLeche: {
    fontSize: 24,
    marginBottom: 2,
    marginLeft: 4,
  },
  ninoDelgado: {
    position: "absolute",
    bottom: 34,
    left: 14,
    alignItems: "center",
  },
  cabezaDelgada: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffcc80",
    borderWidth: 1.5,
    borderColor: "#e65100",
  },
  cuelloDelgado: {
    width: 8,
    height: 6,
    backgroundColor: "#ffcc80",
    marginTop: -1,
  },
  torsoDelgado: {
    width: 11,
    height: 32,
    backgroundColor: "#7e57c2",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#5e35b1",
  },
  piernasDelgadas: {
    flexDirection: "row",
    marginTop: -2,
  },
  piernaDelgada: {
    width: 4,
    height: 18,
    backgroundColor: "#4e342e",
    borderRadius: 1,
  },
  piernaDelgadaDer: {
    marginLeft: 3,
  },
  emojiCorazon: {
    position: "absolute",
    top: 16,
    left: 12,
    fontSize: 20,
  },
  pista: {
    position: "absolute",
    bottom: 28,
    left: 12,
    right: 12,
    height: 8,
    backgroundColor: "#9e9e9e",
    borderRadius: 4,
  },
  iconoCorre: {
    fontSize: 44,
    marginBottom: 8,
  },
  iconoPelota: {
    position: "absolute",
    bottom: 36,
    right: 24,
    fontSize: 28,
  },
  meta: {
    position: "absolute",
    right: 16,
    bottom: 32,
    width: 16,
    height: 4,
    backgroundColor: "#fff",
    borderRadius: 2,
    borderWidth: 2,
    borderColor: "#ff5722",
  },
  sol: {
    position: "absolute",
    top: 10,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffeb3b",
  },
  nube: {
    position: "absolute",
    top: 18,
    left: 12,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  nubeDerecha: {
    position: "absolute",
    top: 28,
    left: "42%",
    flexDirection: "row",
    alignItems: "center",
  },
  nubeCirculo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  colina: {
    position: "absolute",
    bottom: 0,
    left: -30,
    right: -30,
    height: 48,
    backgroundColor: "#66bb6a",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  persona: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    marginLeft: -14,
    alignItems: "center",
  },
  cabeza: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ffcc80",
    borderWidth: 2,
    borderColor: "#ef8f4c",
  },
  cuerpo: {
    width: 26,
    height: 22,
    marginTop: -2,
    backgroundColor: "#42a5f5",
    borderRadius: 4,
  },
  piernasFila: {
    flexDirection: "row",
    marginTop: -2,
  },
  pierna: {
    width: 7,
    height: 14,
    backgroundColor: "#5d4037",
    borderRadius: 2,
  },
  piernaDer: {
    marginLeft: 4,
  },
  estrella: {
    position: "absolute",
    bottom: 36,
    right: 20,
    fontSize: 22,
  },
  mensaje: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#37474f",
    textAlign: "center",
  },
  mensajeObesidad: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: "#4e342e",
    textAlign: "center",
    fontWeight: "500",
  },
  mensajeDelgadez: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: "#4a148c",
    textAlign: "center",
    fontWeight: "500",
  },
});
