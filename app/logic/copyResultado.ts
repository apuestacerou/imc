/** Etiqueta corta tipo diseño “tu resultado”. */
export function etiquetaCategoriaIMC(categoria: string): string {
  switch (categoria) {
    case "Normal":
      return "Peso normal";
    case "Bajo peso":
      return "Bajo peso";
    case "Sobrepeso":
      return "Sobrepeso";
    case "Obesidad":
      return "Obesidad";
    default:
      return categoria;
  }
}

export function tituloMotivacionAdulto(categoria: string): string {
  switch (categoria) {
    case "Normal":
      return "¡Lo estás haciendo increíble!";
    case "Bajo peso":
      return "Cuidemos tu energía y tus hábitos";
    case "Sobrepeso":
      return "Cada paso cuenta";
    case "Obesidad":
      return "Tu bienestar es prioridad";
    default:
      return "Tu resultado de IMC";
  }
}

export function parrafoResumenAdulto(categoria: string): string {
  switch (categoria) {
    case "Normal":
      return (
        "Tu composición corporal se encuentra en el rango saludable. " +
        "Mantén este ritmo para asegurar una longevidad óptima."
      );
    case "Bajo peso":
      return (
        "Tu IMC está por debajo del rango habitualmente asociado a un peso saludable en adultos. " +
        "Si no es intencional, conviene revisarlo con un profesional."
      );
    case "Sobrepeso":
      return (
        "Tu IMC sugiere sobrepeso. Pequeños cambios sostenibles en movimiento y alimentación " +
        "suelen marcar una gran diferencia con el tiempo."
      );
    case "Obesidad":
      return (
        "Tu IMC está en el rango de obesidad. Un plan gradual y apoyo profesional " +
        "ayudan a mejorar salud cardiovascular y calidad de vida."
      );
    default:
      return "Consulta la recomendación detallada más abajo.";
  }
}
