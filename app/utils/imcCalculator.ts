export function calcularIMCLogica (
    peso: number,
    altura:number){
        const imc = peso/(altura*altura);

        let categoria= "";
        let color= "";
        let posicion= 0;

        if (imc < 18.5){
            categoria = "Bajo peso";
            color = "blue";
            posicion= 10;
        }else if (imc <25){
            categoria="Normal";
            color="green";
            posicion=35;
        }else if (imc<30){
            categoria="Sobrepeso";
            color="orange";
            posicion=60
        }else {
            categoria="Obesidad";
            color="red";
            posicion=85;
        }

        return{
            imc,
            categoria,
            color,
            posicion
        };
    }