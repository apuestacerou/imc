import { Redirect } from "expo-router";
import { href } from "./routeHrefs";

/** Ruta legada: la calculadora de adultos vive en la pestaña IMC. */
export default function AdultosRedirect() {
  return <Redirect href={href.tabsImc} />;
}
