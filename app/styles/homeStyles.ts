import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#f5f5f5",
        padding:20,
        justifyContent:"center"
    },

    /** Pantalla con ScrollView: sin centrar para permitir scroll fluido. */
    scrollRoot:{
        flex:1,
        backgroundColor:"#f5f5f5"
    },

    scrollContent:{
        padding:20,
        paddingBottom:56,
        flexGrow:1
    },

    secondaryButton:{
        marginTop:16,
        padding:14,
        borderRadius:16,
        borderWidth:2,
        borderColor:"#0f6d3c",
        alignItems:"center",
        backgroundColor:"#fff"
    },

    secondaryButtonText:{
        color:"#0f6d3c",
        fontSize:16,
        fontWeight:"600"
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
        fontSize:20,
        marginLeft:-11,
        width:22,
        textAlign:"center"
    },

    barraNinoFila:{
        flexDirection:"row",
        width:"100%",
        height:20,
        marginTop:20,
        borderRadius:10,
        overflow:"hidden"
    },

    cursoCard:{
        marginTop:20,
        padding:16,
        backgroundColor:"#e8f5e9",
        borderRadius:16,
        borderWidth:1,
        borderColor:"#c8e6c9"
    },

    cursoTitulo:{
        fontSize:14,
        color:"#555",
        marginBottom:4
    },

    cursoNombre:{
        fontSize:18,
        fontWeight:"700",
        color:"#0f6d3c"
    },

    cursoDescripcion:{
        marginTop:8,
        fontSize:14,
        color:"#333",
        lineHeight:20
    },

    cursoBoton:{
        marginTop:14,
        backgroundColor:"#0f6d3c",
        padding:14,
        borderRadius:14,
        alignItems:"center"
    },

    cursoBotonTexto:{
        color:"#fff",
        fontSize:16,
        fontWeight:"600"
    },

    cursoAviso:{
        marginTop:10,
        fontSize:11,
        color:"#777"
    },

    leyendaBarra:{
        marginTop:6,
        fontSize:11,
        color:"#888"
    },

    categoria:{
        
    },

    link:{
        color:"#0f6d3c",
        textAlign:"center",
        marginBottom:16,
        fontSize:16,
        textDecorationLine:"underline"
    },

    inicioContainer:{
        flex:1,
        backgroundColor:"#f5f5f5",
        padding:24,
        justifyContent:"center",
        alignItems:"stretch"
    },

    inicioBotonera:{
        marginTop:8,
        width:"100%",
        maxWidth:400,
        alignSelf:"center"
    },

    menuButtonPrimario:{
        backgroundColor:"#35b558",
        paddingVertical:20,
        paddingHorizontal:20,
        borderRadius:20,
        marginBottom:16,
        borderWidth:2,
        borderColor:"#2a9d47"
    },

    menuButtonPrimarioTexto:{
        color:"#fff",
        fontSize:20,
        fontWeight:"700",
        textAlign:"center"
    },

    menuButtonSecundario:{
        backgroundColor:"#fff",
        paddingVertical:20,
        paddingHorizontal:20,
        borderRadius:20,
        borderWidth:2,
        borderColor:"#0f6d3c"
    },

    menuButtonSecundarioTexto:{
        color:"#0f6d3c",
        fontSize:20,
        fontWeight:"700",
        textAlign:"center"
    },

    menuButtonSub:{
        marginTop:8,
        fontSize:14,
        lineHeight:20,
        textAlign:"center",
        color:"rgba(255,255,255,0.92)"
    },

    menuButtonSubOscuro:{
        marginTop:8,
        fontSize:14,
        lineHeight:20,
        textAlign:"center",
        color:"#555"
    },

    errorText:{
        color:"#b71c1c",
        marginTop:12
    }
});