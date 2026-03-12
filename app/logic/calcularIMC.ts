export function calcularIMClogic(
    peso: string,
    altura: string,
    edad: string,
    activity: string
) {
    if (!peso || !altura || !edad) {
        return { error: "Por favor ingrese todos los campos" };
    }

    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);
    const edadNum = parseFloat(edad);

    const resultado = pesoNum / (alturaNum * alturaNum);
    let posicion = 0;

    if (resultado < 18.5) {
        posicion = 10;
    } else if (resultado < 25) {
        posicion = 35;
    } else if (resultado < 30) {
        posicion = 60;
    } else {
        posicion = 85;
    }

    let categoria = "";
    let recomendacion = "";
    let colorResultado = "black";

    if (edadNum < 18) {
        categoria = "IMC calculado para menor de edad";
    } else {
        categoria = "IMC calculado para adulto";
    }

    if (resultado < 18.5) {
        categoria = "Bajo peso";
        colorResultado = "blue";

        if (activity === "alto") {
            recomendacion = "Tienes actividad alta pero bajo peso. Podrias necesitar aumentar tu consumo calorico.";
        } else {
            recomendacion = "Se recomienda mejorar la alimentacion y ocnsultar conun profesional de la salud.";
        }
    } else if (resultado < 25) {
        categoria = "Normal";
        colorResultado = "green";

        if (activity === "bajo") {
            recomendacion = "Tu IMC es normal, pero aumentar la actividad fisica puede mejorar tu salud.";
        } else {
            recomendacion = "Buen trabajo! Manten tus habitos saludables.";
        }
    } else if (resultado < 30) {
        categoria = "Sobrepeso";
        colorResultado = "orange";

        if (activity === "bajo") {
            recomendacion = "Aumentar la actividad fisica puede ayudarte a mejorar tu IMC.";
        } else {
            recomendacion = "Tu actividad fisica ayud, pero tambien es importante cuidar la alimentacion.";
        }
    } else {
        categoria = "Obesidad";
        colorResultado = "red";

        if (activity === "bajo") {
            recomendacion = "Se recomienda la actividad fisica y consultar con un profesional de la salud."
        } else {
            recomendacion = "Tu actividad fisica es positiva pero seria recomendable asesoria profesional."
        }
    }

    return {
        imc: resultado,
        posicion,
        categoria,
        recomendacion,
        colorResultado
    };
}
