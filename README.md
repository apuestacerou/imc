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

- [Añade aquí los nombres de los integrantes del equipo]

---

## Instrucciones de instalación

### Requisitos

- Node.js (v18 o superior recomendado)
- npm o yarn
- Expo Go en tu móvil (opcional, para probar en dispositivo)

### Pasos

1. **Clonar el repositorio** (si aún no lo tienes):
   ```bash
   git clone https://github.com/Valentinaq-a/calculadoraimc
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

## Captura de pantalla

Añade una captura de la app en ejecución (por ejemplo en `docs/screenshot.png`) y reemplaza el enlace de abajo:

![Captura de la app](./docs/screenshot.png)

*Si aún no tienes la captura, crea la carpeta `docs`, toma una captura desde Expo Go o el emulador y guárdala como `screenshot.png`.*

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
