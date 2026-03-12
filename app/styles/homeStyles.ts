import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#f5f5f5",
        padding:20,
        justifyContent:"center"
    },

    title:{
        fontSize:32,
        fontWeight:"bold",
        color:"#0f6d3c",
        textAlign:"center"
    },

    subtitle:{
        fontSize:18,
        textAlign:"center",
        marginBottom:20
    },

    card:{
        backgroundColor:"white",
        padding:20,
        borderRadius:20
    },

    input:{
        borderWidth:1,
        borderColor:"#ddd",
        padding:15,
        borderRadius:10,
        marginBottom:15
    },

    label:{
        fontSize:16,
        fontWeight:"600",
        marginTop:10,
        marginBottom:10
    },

    activityContainer:{
        flexDirection:"row",
        backgroundColor:"#e0e0e0",
        borderRadius:25,
        padding:5,
        marginTop:10
    },

    activityButton:{
        flex:1,
        padding:10,
        alignItems:"center",
        borderRadius:20
    },

    calculateButton:{
        backgroundColor:"#35b558",
        padding:15,
        borderRadius:20,
        marginTop:20,
        alignItems:"center"
    },

    calculateText:{
        color:"white",
        fontSize:18
    },

    selectedButton:{
        backgroundColor:"#35b558"
    },

    barraIMC:{
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
        position:"relative",
        marginTop:5
    },

    indicador:{
        position:"absolute",
        fontSize:20
    },

    categoria:{
        
    }
});