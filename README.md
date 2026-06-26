# Invitación de Boda - Fernanda & Diego

Una hermosa invitación de boda digital interactiva creada con React, Vite y Tailwind CSS.

## 🚀 Características

- 🎨 Diseño elegante con acuarelas y efectos visuales
- ⏰ Cuenta regresiva interactiva
- 📍 Mapas interactivos de ubicaciones
- 📝 Formulario de confirmación de asistencia (RSVP)
- 🎵 Música de fondo opcional
- 👥 Panel de administración para gestionar RSVPs
- 📱 Diseño responsive para todos los dispositivos

## 🛠️ Tecnología

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Testing**: Vitest + React Testing Library

## 📋 Requisitos

Node.js 18 o superior

## 🏃‍♂️ Ejecutar el Proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar el build de producción
npm run preview
```

## 🧪 Testing

El proyecto incluye tests automatizados para verificar que el sitio funciona correctamente:

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests una sola vez
npm run test:run

# Ejecutar tests con interfaz gráfica
npm run test:ui
```

### ¿Qué prueban los tests?

Los tests verifican que:
- ✅ La aplicación se carga sin errores
- ✅ Los nombres de los novios se muestran correctamente
- ✅ La fecha y hora de la ceremonia son correctas
- ✅ Los detalles del evento se muestran
- ✅ El formulario de RSVP está presente
- ✅ La sección de mapas funciona
- ✅ El contador regresivo se renderiza
- ✅ La estructura general del sitio es correcta

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── AdminPanel.tsx  # Panel de administración
│   ├── BackgroundMusic.tsx
│   ├── Countdown.tsx   # Cuenta regresiva
│   ├── LocationMap.tsx # Mapas interactivos
│   ├── RSVPForm.tsx    # Formulario de RSVP
│   └── WishesWall.tsx  # Muro de deseos
├── assets/             # Imágenes y recursos
├── App.tsx             # Componente principal
├── types.ts            # Definiciones de tipos TypeScript
└── test/               # Configuración de tests
```

## 🎨 Personalización

- **Colores**: Los colores están definidos en Tailwind CSS (olive, gold tones)
- **Imágenes**: Reemplaza las imágenes en la carpeta `public/`
- **Texto**: El contenido está hardcodeado en `App.tsx`
- **Fecha**: Modifica la fecha en `Countdown.tsx`

## 🔧 Configuración

El proyecto utiliza localStorage para guardar las confirmaciones de asistencia. No requiere backend para funcionamiento básico.

## 📄 Licencia

Copyright © 2027 Fernanda & Diego - Hecho con ❤️