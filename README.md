# Calculadora IMC+

## Nombre de la app

**Calculadora IMC+**

---

## Descripción

Aplicación móvil desarrollada con **Expo** y **React Native** que calcula el **Índice de Masa Corporal (IMC)** a partir del peso (kg) y la altura (m). Incluye:

- Campos para **edad**, **peso** y **altura**
- Selector de **nivel de actividad** (Bajo, Medio, Alto)
- Cálculo del IMC con categorías según la OMS: **Bajo peso**, **Normal**, **Sobrepeso**, **Obesidad**
- Tarjeta de resultado con valor numérico, categoría con color y una **barra visual** con indicador que muestra en qué rango se encuentra el usuario
- Recomendación de hábitos saludables

Puedes ejecutarla en **Expo Go** escaneando el código QR o en **web** / **emulador** con los comandos de Expo.

---

## Integrantes

-Nicolas Fajardo id 409483
-Valentina Quinayas id 386959
-
---

## Instrucciones de instalación

### Requisitos

- Node.js (v24)
- npm o yarn
- Expo Go en tu móvil (opcional, para probar en dispositivo)

### Pasos

1. **Clonar el repositorio** :
   ```bash
   git clone
   cd calculadoraimc
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar la aplicación:**
   ```bash
   npx expo start
   ```

4. **Abrir la app:**
   - En **Expo Go**: escanea el código QR que aparece en la terminal (misma red Wi‑Fi o usa `npx expo start --tunnel` si estás en otra red).
   - En **web**: pulsa `w` en la terminal o abre la URL que muestra Expo.
   - En **Android**: pulsa `a` (con emulador o dispositivo conectado).

### Comandos útiles

| Comando | Descripción |
|--------|-------------|
| `npx expo start` | Inicia el servidor de desarrollo |
| `npx expo start --tunnel` | Inicia con tunnel (útil si el móvil no está en la misma Wi‑Fi) |
| `npx expo start --clear` | Inicia limpiando la caché de Metro |

---


## Tecnologías

- **Expo** (~54)
- **React Native**
- **Expo Router** (navegación basada en archivos)
- **TypeScript**

---

## Estructura del proyecto

```
calculadoraimc/
├── app/
│   ├── _layout.tsx    # Layout raíz y Error Boundary
│   ├── index.tsx       # Pantalla principal (formulario y resultado)
│   ├── components/
│   │   ├── ActivitySelector.tsx  # Botones Bajo / Medio / Alto
│   │   ├── IMCBar.tsx            # Barra de colores e indicador
│   │   └── ResultCard.tsx        # Tarjeta con IMC y categoría
│   └── utils/
│       └── imcCalculator.ts      # Lógica del IMC
├── app.json
├── package.json
└── README.md
```
