# Puntos de Interés 📍

Una aplicación web interactiva para descubrir y compartir puntos de interés en diferentes ciudades españolas. Los usuarios pueden explorar lugares destacados en un mapa interactivo, añadir nuevos puntos y valorar los existentes.

## ✨ Características

- 🗺️ **Mapa Interactivo**: Navega por diferentes ciudades españolas con un mapa basado en Leaflet
- 📍 **Puntos de Interés**: Descubre lugares interesantes añadidos por la comunidad
- 🏷️ **Categorías**: Organiza los puntos por diferentes categorías
- ⭐ **Sistema de Valoraciones**: Vota y valora los puntos de interés
- 🔐 **Autenticación**: Sistema de usuarios para añadir y valorar contenido
- 📱 **Responsive**: Diseño adaptativo para dispositivos móviles y desktop

## 🛠️ Tecnologías

- **Framework**: Next.js 15 con App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Mapas**: Leaflet con react-leaflet
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: Better Auth
- **Validación**: Zod con React Hook Form

## 🚀 Instalación y Uso

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/ferrandisme/puntos-interes.git
   cd puntos-interes
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   Crea un archivo `.env.local` con la configuración necesaria para MongoDB y autenticación.

4. **Ejecuta el servidor de desarrollo**

   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   Ve a [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 📂 Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── points/         # Componentes del mapa y puntos
│   └── ui/             # Componentes UI base (shadcn/ui)
├── hooks/              # Custom hooks
├── lib/                # Utilidades y configuraciones
├── models/             # Modelos de datos
├── types/              # Definiciones de tipos TypeScript
└── utils/              # Funciones auxiliares
```

## 🛣️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter de código

## 👥 Contribuidores

Este proyecto ha sido desarrollado y diseñado por:

- [**ferrandisme**](https://github.com/ferrandisme)
- [**manDarina13**](https://github.com/manDarina13)
- [**udreif**](https://github.com/udreif)

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia que se especifique.

---

¡Contribuciones y sugerencias son bienvenidas! 🎉
