/**
 * Tarjeta que muestra el resultado del IMC:
 * valor numérico, categoría (con color), recomendación y barra visual con indicador.
 */

import { StyleSheet, Text, View } from "react-native";
import IMCBar from "./IMCBar";

export default function ResultCard({
  imc,
  categoria,
  color,
  recomendacion,
  posicion,
}: any) {
  return (
    <View style={styles.card}>
      <Text>Tu IMC es:</Text>
      <Text style={styles.imc}>{imc.toFixed(2)}</Text>
      <Text style={[styles.categoria, { color }]}>{categoria}</Text>
      <Text style={styles.recomendacion}>{recomendacion}</Text>
      <IMCBar posicion={posicion} />
    </View>
  );
}

const styles=StyleSheet.create({
    card:{
        marginTop:20
    },

    imc:{
        fontSize:30,
        fontWeight:"bold"
    },

    categoria:{
        fontSize:18
    },

    recomendacion:{
        marginTop:10
    }
});