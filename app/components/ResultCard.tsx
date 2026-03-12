import React from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/homeStyles";

export default function ({
    imc,
    categoria,
    recomendacion,
    colorResultado,
    posicionIndiador
}: any) {
    if (!imc)
        return null;

    return (
        <View style={styles.card}>
            <Text>Tu IMC ES:</Text>

            <Text style={{
                fontSize: 30,
                fontWeight: "bold"
            }}>
                {imc.toFixed(2)}
            </Text>

            <Text style={[styles.categoria, { color: colorResultado }]}>
                {categoria}
            </Text>

            <Text style={{ marginTop: 10 }}>
                Recomendacion: {recomendacion}
            </Text>

            <View style={styles.barraIMC}>
                <View style={[styles.seccion, { backgroundColor: "blue" }]} />
                <View style={[styles.seccion, { backgroundColor: "green" }]} />
                <View style={[styles.seccion, { backgroundColor: "orange" }]} />
                <View style={[styles.seccion, { backgroundColor: "red" }]} />
            </View>

            <View style={styles.indicadorContainer}>
                <Text style={[styles.indicador,{left:`${posicionIndiador}%`}]}>
                    ▲
                </Text>
            </View>
        </View>
    );
}