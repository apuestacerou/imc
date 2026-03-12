/**
 * Barra visual del IMC: cuatro segmentos (azul = bajo, verde = normal,
 * naranja = sobrepeso, rojo = obesidad) y un indicador (▲) que se mueve
 * según la posición en porcentaje (0–100).
 */

import { StyleSheet, Text, View } from "react-native";

export default function IMCBar({ posicion }: { posicion: number }) {
  return (
    <>
      <View style={styles.barra}>
        <View style={[styles.seccion, { backgroundColor: "blue" }]} />
        <View style={[styles.seccion, { backgroundColor: "green" }]} />
        <View style={[styles.seccion, { backgroundColor: "orange" }]} />
        <View style={[styles.seccion, { backgroundColor: "red" }]} />
      </View>
      <View style={styles.indicadorContainer}>
        <View style={[styles.indicador, { left: `${posicion}%` }]}>
          <Text style={styles.flecha}>▲</Text>
        </View>
      </View>
    </>
  );
}

const styles=StyleSheet.create({
    barra:{
        flexDirection:"row",
        width:"100%",
        height:20,
        marginTop:20,
        borderRadius:10,
        overflow:"hidden"
    },

    seccion:{
        flex:1
    },

    indicadorContainer:{
        width:"100%",
        height:20,
        position:"relative"
    },

    indicador:{
        position:"absolute",
        alignItems:"center",
        justifyContent:"center"
    },
    flecha:{
        fontSize:20
    }
});