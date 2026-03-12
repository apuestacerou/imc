/* -------- BOTONES DE LA SECCION DE NIVEL DE ACTIVIDAD -----------*/

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/homeStyles";

export default function ActivitySelector({ activity, setActivity }: any) {
    return (
        <View style={styles.activityContainer}>

            <TouchableOpacity
                style={[
                    styles.activityButton,
                    activity === "bajo" && styles.selectedButton
                ]}
                onPress={() => setActivity("bajo")}
            >
                <Text style={{fontWeight:"600"}}>Bajo</Text>
                {/*<Text>Bajo</Text>*/}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.activityButton,
                    activity === "medio" && styles.selectedButton
                ]}
                onPress={() => setActivity("medio")}
            >
                <Text style={{fontWeight:"600"}}>Medio</Text>
                {/*<Text>Medio</Text>*/}
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.activityButton,
                    activity === "alto" && styles.selectedButton
                ]}
                onPress={() => setActivity("alto")}
            >
                <Text style={{fontWeight:"600"}}>Alto</Text>
                {/*<Text>Alto</Text>*/}
            </TouchableOpacity>
        </View>
    );
}