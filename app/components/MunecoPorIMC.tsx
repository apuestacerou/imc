import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type TipoMuneco = "flaco" | "normal" | "obeso";

export function tipoMunecoDesdeIMC(imc: number): TipoMuneco {
  if (imc < 18.5) return "flaco";
  if (imc < 25) return "normal";
  return "obeso";
}

type Props = {
  imc: number;
};

function etiquetaDesde(imc: number, tipo: TipoMuneco): string {
  if (tipo === "flaco") return "Delgado";
  if (tipo === "normal") return "Equilibrado";
  return imc >= 30 ? "Obesidad" : "Sobrepeso";
}

/** Ojos + boca en la cara */
function Rostro() {
  return (
    <View style={r.rostro} pointerEvents="none">
      <View style={r.ojosFila}>
        <View style={r.ojo} />
        <View style={[r.ojo, r.ojoDer]} />
      </View>
      <Text style={r.bocaTexto}>‿</Text>
    </View>
  );
}

function MunecoFlaco() {
  return (
    <View style={f.contenedor}>
      {/* Cabello */}
      <View style={f.pelo} />
      <View style={f.cabeza}>
        <Rostro />
      </View>
      <View style={f.cuello} />
      {/* Torso estrecho */}
      <View style={f.torso}>
        <View style={f.cuelloCamisa} />
        <View style={f.lineaCamisa} />
      </View>
      <View style={f.brazoIzqWrap}>
        <View style={f.brazoBar} />
        <View style={f.mano} />
      </View>
      <View style={f.brazoDerWrap}>
        <View style={f.brazoBar} />
        <View style={f.mano} />
      </View>
      {/* Cintura / pantalón */}
      <View style={f.cinturon} />
      <View style={f.piernas}>
        <View style={f.pierna}>
          <View style={f.zapato} />
        </View>
        <View style={[f.pierna, f.piernaDer]}>
          <View style={f.zapato} />
        </View>
      </View>
    </View>
  );
}

function MunecoNormal() {
  return (
    <View style={n.contenedor}>
      <View style={n.pelo} />
      <View style={n.cabeza}>
        <View style={n.orejaIzq} />
        <View style={n.orejaDer} />
        <Rostro />
      </View>
      <View style={n.cuello} />
      <View style={n.hombros} />
      <View style={n.filaTorso}>
        <View style={n.brazoIzqWrap}>
          <View style={n.brazoBar} />
          <View style={n.mano} />
        </View>
        <View style={n.torso}>
          <View style={n.cuelloCamisa} />
          <View style={n.bolsillo} />
        </View>
        <View style={n.brazoDerWrap}>
          <View style={n.brazoBar} />
          <View style={n.mano} />
        </View>
      </View>
      <View style={n.cinturon} />
      <View style={n.piernas}>
        <View style={n.pierna}>
          <View style={n.zapato} />
        </View>
        <View style={[n.pierna, n.piernaDer]}>
          <View style={n.zapato} />
        </View>
      </View>
    </View>
  );
}

function MunecoObeso({ imc }: { imc: number }) {
  const muyObeso = imc >= 35;
  return (
    <View style={o.contenedor}>
      <View style={o.pelo} />
      <View style={o.peloLateral} />
      <View style={o.peloLateralDer} />

      <View style={o.cara}>
        <View style={o.mejillaIzq} />
        <View style={o.mejillaDer} />
        <Rostro />
      </View>

      <View style={o.papada} />
      <View style={[o.hombros, muyObeso && o.hombrosAncho]} />

      <View style={o.filaCuerpo}>
        <View style={o.brazoLado}>
          <View style={o.mangaSisa} />
          <View style={o.brazoGrueso} />
        </View>

        <View style={[o.vientre, muyObeso ? o.vientreExtra : null]}>
          <View style={[o.pechoSombra, muyObeso && o.pechoSombraGrande]} />
          <View style={[o.pliegueVientre, muyObeso && o.pliegueAncho]} />
          <View style={[o.cinturaLinea, muyObeso && o.cinturaAncha]} />
        </View>

        <View style={o.brazoLado}>
          <View style={[o.mangaSisa, o.mangaSisaDer]} />
          <View style={o.brazoGrueso} />
        </View>
      </View>

      <View style={[o.cinturon, muyObeso && o.cinturonAncho]} />
      <View style={o.botonesFila}>
        <View style={o.boton} />
        <View style={[o.boton, o.botonSep]} />
        <View style={[o.boton, o.botonSep]} />
      </View>

      <View style={o.piernas}>
        <View style={o.pierna}>
          <View style={o.zapato} />
        </View>
        <View style={[o.pierna, o.piernaDer]}>
          <View style={o.zapato} />
        </View>
      </View>
    </View>
  );
}

export default function MunecoPorIMC({ imc }: Props) {
  const tipo = tipoMunecoDesdeIMC(imc);
  const etiqueta = etiquetaDesde(imc, tipo);

  return (
    <View style={s.wrap} accessibilityLabel={`Figura esquemática: ${etiqueta}`}>
      <View style={s.cajaFigura}>
        {tipo === "flaco" && <MunecoFlaco />}
        {tipo === "normal" && <MunecoNormal />}
        {tipo === "obeso" && <MunecoObeso imc={imc} />}
      </View>
      <Text style={s.miniEtiqueta}>{etiqueta}</Text>
    </View>
  );
}

const r = StyleSheet.create({
  rostro: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    paddingTop: 10,
    zIndex: 3,
  },
  ojosFila: {
    flexDirection: "row",
    alignItems: "center",
  },
  ojo: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3e2723",
  },
  ojoDer: {
    marginLeft: 8,
  },
  bocaTexto: {
    marginTop: 0,
    fontSize: 12,
    lineHeight: 14,
    color: "#5d4037",
    fontWeight: "600",
  },
});

const f = StyleSheet.create({
  contenedor: {
    width: 88,
    height: 138,
    alignItems: "center",
  },
  pelo: {
    position: "absolute",
    top: 0,
    width: 34,
    height: 14,
    backgroundColor: "#5d4037",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    zIndex: 5,
  },
  cabeza: {
    marginTop: 8,
    width: 26,
    height: 28,
    borderRadius: 13,
    backgroundColor: "#ffcc80",
    borderWidth: 1.5,
    borderColor: "#e65100",
    zIndex: 4,
    position: "relative",
    overflow: "hidden",
  },
  cuello: {
    width: 10,
    height: 8,
    backgroundColor: "#ffcc80",
    marginTop: -2,
    zIndex: 3,
  },
  torso: {
    width: 16,
    height: 42,
    backgroundColor: "#7e9fd4",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#5c7cba",
    alignItems: "center",
    paddingTop: 4,
    marginTop: -2,
    zIndex: 2,
  },
  cuelloCamisa: {
    width: 14,
    height: 4,
    backgroundColor: "#fff",
    opacity: 0.9,
    borderRadius: 1,
  },
  lineaCamisa: {
    marginTop: 6,
    width: 10,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  brazoIzqWrap: {
    position: "absolute",
    left: 6,
    top: 42,
    alignItems: "center",
    zIndex: 3,
  },
  brazoDerWrap: {
    position: "absolute",
    right: 6,
    top: 42,
    alignItems: "center",
    zIndex: 3,
  },
  brazoBar: {
    width: 5,
    height: 30,
    backgroundColor: "#ffcc80",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#e65100",
  },
  mano: {
    marginTop: -1,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#ffcc80",
    borderWidth: 1,
    borderColor: "#e65100",
  },
  cinturon: {
    width: 20,
    height: 4,
    backgroundColor: "#37474f",
    borderRadius: 1,
    marginTop: -2,
    zIndex: 2,
  },
  piernas: {
    flexDirection: "row",
    marginTop: 0,
  },
  pierna: {
    width: 7,
    height: 28,
    backgroundColor: "#455a64",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    alignItems: "center",
  },
  piernaDer: {
    marginLeft: 4,
  },
  zapato: {
    position: "absolute",
    bottom: -2,
    width: 10,
    height: 5,
    backgroundColor: "#212121",
    borderRadius: 2,
  },
});

const n = StyleSheet.create({
  contenedor: {
    width: 96,
    height: 142,
    alignItems: "center",
  },
  pelo: {
    position: "absolute",
    top: 0,
    width: 38,
    height: 16,
    backgroundColor: "#4e342e",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    zIndex: 5,
  },
  cabeza: {
    marginTop: 10,
    width: 30,
    height: 32,
    borderRadius: 15,
    backgroundColor: "#ffcc80",
    borderWidth: 1.5,
    borderColor: "#ef6c00",
    zIndex: 4,
    position: "relative",
    overflow: "visible",
  },
  orejaIzq: {
    position: "absolute",
    left: -5,
    top: 12,
    width: 8,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffb74d",
    zIndex: 0,
  },
  orejaDer: {
    position: "absolute",
    right: -5,
    top: 12,
    width: 8,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffb74d",
    zIndex: 0,
  },
  cuello: {
    width: 14,
    height: 8,
    backgroundColor: "#ffcc80",
    marginTop: -2,
    zIndex: 3,
  },
  hombros: {
    width: 52,
    height: 8,
    backgroundColor: "#546e7a",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginTop: -2,
    zIndex: 2,
  },
  filaTorso: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: -4,
    zIndex: 2,
  },
  torso: {
    width: 32,
    height: 44,
    backgroundColor: "#42a5f5",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#1565c0",
    alignItems: "center",
    paddingTop: 6,
  },
  cuelloCamisa: {
    width: 22,
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 2,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: "#e3f2fd",
  },
  bolsillo: {
    width: 12,
    height: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 2,
    marginTop: 4,
  },
  brazoIzqWrap: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
    marginRight: -1,
  },
  brazoDerWrap: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
    marginLeft: -1,
  },
  brazoBar: {
    width: 10,
    height: 34,
    backgroundColor: "#ffcc80",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ef6c00",
  },
  mano: {
    marginTop: -2,
    width: 10,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#ffcc80",
    borderWidth: 1,
    borderColor: "#ef6c00",
  },
  cinturon: {
    width: 52,
    height: 5,
    backgroundColor: "#37474f",
    borderRadius: 2,
    marginTop: -2,
    zIndex: 2,
  },
  piernas: {
    flexDirection: "row",
    marginTop: 0,
  },
  pierna: {
    width: 11,
    height: 30,
    backgroundColor: "#37474f",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    alignItems: "center",
  },
  piernaDer: {
    marginLeft: 6,
  },
  zapato: {
    position: "absolute",
    bottom: -3,
    width: 14,
    height: 6,
    backgroundColor: "#263238",
    borderRadius: 3,
  },
});

const o = StyleSheet.create({
  contenedor: {
    width: 128,
    height: 176,
    alignItems: "center",
  },
  pelo: {
    position: "absolute",
    top: 0,
    width: 48,
    height: 20,
    backgroundColor: "#3e2723",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 8,
  },
  peloLateral: {
    position: "absolute",
    top: 14,
    left: 6,
    width: 10,
    height: 22,
    backgroundColor: "#3e2723",
    borderBottomLeftRadius: 6,
    zIndex: 7,
  },
  peloLateralDer: {
    position: "absolute",
    top: 14,
    right: 6,
    width: 10,
    height: 22,
    backgroundColor: "#3e2723",
    borderBottomRightRadius: 6,
    zIndex: 7,
  },
  cara: {
    marginTop: 12,
    width: 40,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#ffcc80",
    borderWidth: 2,
    borderColor: "#e65100",
    zIndex: 6,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  mejillaIzq: {
    position: "absolute",
    left: 2,
    top: 18,
    width: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: "rgba(255,138,128,0.45)",
  },
  mejillaDer: {
    position: "absolute",
    right: 2,
    top: 18,
    width: 10,
    height: 8,
    borderRadius: 5,
    backgroundColor: "rgba(255,138,128,0.45)",
  },
  papada: {
    width: 36,
    height: 10,
    backgroundColor: "#ffcc80",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginTop: -8,
    borderWidth: 1,
    borderColor: "#ef9a9a",
    zIndex: 5,
  },
  hombros: {
    width: 112,
    height: 15,
    backgroundColor: "#0d47a1",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: -4,
    zIndex: 4,
    borderBottomWidth: 1,
    borderColor: "#01579b",
  },
  hombrosAncho: {
    width: 124,
  },
  filaCuerpo: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: -6,
    zIndex: 3,
  },
  brazoLado: {
    width: 14,
    alignItems: "center",
    paddingTop: 2,
  },
  mangaSisa: {
    width: 14,
    height: 13,
    backgroundColor: "#1565c0",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 2,
  },
  mangaSisaDer: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 8,
  },
  brazoGrueso: {
    marginTop: -1,
    width: 14,
    height: 44,
    backgroundColor: "#ffcc80",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#e65100",
  },
  vientre: {
    position: "relative",
    marginTop: 0,
    marginHorizontal: 0,
    width: 84,
    height: 64,
    borderRadius: 42,
    backgroundColor: "#0d47a1",
    borderWidth: 2,
    borderColor: "#01579b",
    overflow: "hidden",
    alignItems: "center",
    zIndex: 2,
  },
  vientreExtra: {
    width: 96,
    height: 76,
    borderRadius: 48,
  },
  pechoSombra: {
    marginTop: 6,
    width: 58,
    height: 24,
    backgroundColor: "#1976d2",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#42a5f5",
  },
  pechoSombraGrande: {
    width: 72,
    height: 28,
    borderRadius: 16,
  },
  pliegueVientre: {
    position: "absolute",
    bottom: 22,
    width: 48,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 2,
  },
  pliegueAncho: {
    width: 58,
    bottom: 26,
  },
  cinturaLinea: {
    position: "absolute",
    bottom: 10,
    width: 62,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  cinturaAncha: {
    width: 74,
    bottom: 12,
  },
  cinturon: {
    width: 112,
    height: 9,
    backgroundColor: "#263238",
    borderRadius: 3,
    marginTop: -6,
    zIndex: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  cinturonAncho: {
    width: 124,
  },
  botonesFila: {
    flexDirection: "row",
    marginTop: 5,
    zIndex: 5,
    alignItems: "center",
  },
  boton: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#eceff1",
    borderWidth: 1,
    borderColor: "#78909c",
  },
  botonSep: {
    marginLeft: 8,
  },
  piernas: {
    flexDirection: "row",
    marginTop: 4,
    zIndex: 1,
  },
  pierna: {
    width: 20,
    height: 24,
    backgroundColor: "#37474f",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: "center",
  },
  piernaDer: {
    marginLeft: 12,
  },
  zapato: {
    position: "absolute",
    bottom: -4,
    width: 26,
    height: 9,
    backgroundColor: "#212121",
    borderRadius: 4,
    borderTopWidth: 1,
    borderColor: "#424242",
  },
});

const s = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 100,
  },
  cajaFigura: {
    minHeight: 176,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  miniEtiqueta: {
    marginTop: 6,
    fontSize: 10,
    color: "#546e7a",
    textAlign: "center",
    maxWidth: 100,
  },
});
