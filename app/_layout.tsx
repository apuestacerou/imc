/**
 * LAYOUT RAÍZ DE LA APP
 * Envuelve la navegación (Stack) en un Error Boundary para capturar
 * errores de JavaScript y mostrarlos en pantalla en lugar de una pantalla en blanco.
 */

import { Stack } from "expo-router";
import React from "react";
import { ScrollView, Text } from "react-native";

/** Captura errores en la app y muestra mensaje y stack en pantalla */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#c00", marginBottom: 10 }}>
            Error:
          </Text>
          <Text style={{ fontSize: 14, color: "#333", marginBottom: 8 }}>
            {this.state.error.message}
          </Text>
          <Text style={{ fontSize: 12, color: "#666" }}>
            {this.state.error.stack}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack />
    </ErrorBoundary>
  );
}
