import { Redirect } from "expo-router";
import { href } from "./routeHrefs";

/** Ruta legada: modo niños/OMS en la pestaña IMC. */
export default function NinosRedirect() {
  return <Redirect href={href.ninosImc} />;
}
