// ------------ COMPONENTE SOLO PARA LOS BOTNOES DE ACTIVIDAD --------------

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props={
    activity:string;
    setActivity:(value:string)=>void;
};

export default function ActivitySelector({
    activity,
    setActivity
}:Props){
    return(
        <View>
            <Text style={styles.label}>Nivel de Actividad</Text>

            <View style={styles.container}>

                <TouchableOpacity
                style={[
                    styles.button,
                    activity === "bajo" && styles.selected
                ]}
                onPress={()=>setActivity("bajo")}
                >
                    <Text>Bajo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[
                    styles.button,
                    activity === "medio" && styles.selected
                ]}
                onPress={()=>setActivity("medio")}
                >
                    <Text>Medio</Text>
                </TouchableOpacity>

                <TouchableOpacity
                style={[
                    styles.button,
                    activity === "alto" && styles.selected
                ]}
                onPress={()=>setActivity("alto")}
                >
                    <Text>Alto</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    label:{
        fontSize:16,
        fontWeight:"600",
        marginTop:10,
        marginBottom:10
    },

    container:{
        padding:10,
        backgroundColor:"#eee",
        borderRadius:10
    },

    selected:{
        backgroundColor:"#35b558"
    },

    button:{

    }
});