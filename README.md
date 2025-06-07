# TallerTracker - Sistema de Gestión de Mantenimiento de Vehículos

![TallerTracker Logo](/favicon-32x32.png)

TallerTracker es una aplicación web progresiva (PWA) diseñada para ayudar a usuarios particulares y talleres a gestionar el mantenimiento de vehículos de forma eficiente. Permite realizar un seguimiento detallado del historial de mantenimiento, programar tareas futuras y recibir alertas de mantenimientos pendientes.

## 📋 Índice

- [Características principales](#características-principales)
- [Instalación y desarrollo](#instalación-y-desarrollo)
- [Guía rápida de uso](#guía-rápida-de-uso)
- [Documentación completa](#documentación-completa)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Información del proyecto](#información-del-proyecto)

## ✨ Características principales

- **Sistema multiusuario** con roles de administrador y usuario estándar
- **Gestión completa de vehículos** con información detallada y etiquetas de color
- **Historial de mantenimientos** con búsqueda y filtrado avanzado
- **Programación de mantenimientos** por tiempo (años) y/o kilometraje
- **Alertas automáticas** de mantenimientos próximos o vencidos
- **Dashboard** con estadísticas y resumen visual
- **Exportación de datos** en formato CSV
- **Editor WYSIWYG** para descripciones detalladas con formato
- **Diseño responsive** optimizado para dispositivos móviles
- **Instalable como PWA** en dispositivos móviles y ordenadores

## 🚀 Instalación y desarrollo

### Requisitos previos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior)

### Configuración inicial

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tallertracker.git
   cd tallertracker
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

   Esto iniciará tanto el frontend como el backend de Convex.

4. Abre tu navegador en [http://localhost:5173](http://localhost:5173)

## 📘 Guía rápida de uso

### Registro y acceso

1. **Registro**: Crea una nueva cuenta con tu correo electrónico y contraseña
2. **Login**: Accede con tus credenciales

### Gestión de vehículos

1. **Añadir**: Navega a "Vehículos" → "+ Agregar" → Completa el formulario (incluye color para identificación visual)
2. **Editar**: Haz clic en el icono de lápiz ✏️ junto al vehículo
3. **Eliminar**: Haz clic en el icono de papelera 🗑️ (esto eliminará todos los registros asociados)

### Registros de mantenimiento

1. **Añadir**: Navega a "Mantenimientos" → "+ Agregar" → Selecciona vehículo → Completa detalles
2. **Filtrar**: Usa el campo de búsqueda y selector de vehículo
3. **Exportar**: Haz clic en "📊 Exportar" para descargar historial en CSV

### Mantenimiento programado

1. **Programar**: Navega a "Mnto Programado" → "+ Programar Mantenimiento"
2. **Configurar**: Establece frecuencia por tiempo (años) y/o distancia (km)
3. **Alertas**: El sistema notificará automáticamente mantenimientos próximos o vencidos

### Dashboard

El panel principal muestra:
- Estadísticas generales
- Gráfico de costes
- Alertas de mantenimientos próximos
- Últimos mantenimientos realizados

### Gestión de usuarios (Solo administradores)

- Ver todos los usuarios registrados
- Cambiar roles (Admin/Usuario)
- Eliminar usuarios y todos sus datos

## 📖 Documentación completa

Para una guía detallada de todas las funcionalidades, consulta el archivo [USAGE_GUIDE.md](./USAGE_GUIDE.md) que contiene:

- Instrucciones paso a paso para cada función
- Explicación detallada del sistema de alertas
- Guía de instalación como PWA
- Preguntas frecuentes
- Capturas de pantalla con ejemplos

## 🔧 Tecnologías utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: [Convex](https://convex.dev) (base de datos y lógica de servidor)
- **Autenticación**: Convex Auth
- **Visualización de datos**: Chart.js
- **Editor de texto**: React Quill

## ℹ️ Información del proyecto

Este proyecto está conectado al despliegue de Convex llamado [`knowing-hyena-923`](https://dashboard.convex.dev/d/knowing-hyena-923).

### Estructura del proyecto

- `/app`: Código frontend (construido con Vite)
- `/convex`: Código backend (funciones, esquema y API HTTP)
- `/public`: Recursos estáticos (imágenes, favicon, etc.)

### Desarrollo y despliegue

Para más información sobre cómo desarrollar con Convex, consulta la [documentación oficial de Convex](https://docs.convex.dev/).

- Para nuevos desarrolladores: [Overview](https://docs.convex.dev/understanding/)
- Guía de despliegue: [Hosting and Deployment](https://docs.convex.dev/production/)
- Mejores prácticas: [Best Practices](https://docs.convex.dev/understanding/best-practices/)

### API HTTP

Las rutas HTTP definidas por el usuario se encuentran en el archivo `convex/router.ts`. Estas rutas están separadas de `convex/http.ts` para proteger las rutas de autenticación.
