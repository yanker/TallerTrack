# Sistema de Gestión de Mantenimiento de Vehículos

## ✅ Funcionalidades Implementadas

### 🚗 Gestión de Vehículos

- Agregar, editar y eliminar vehículos
- Información completa: marca, modelo, matrícula, fecha de compra, km iniciales

### 🔧 Registros de Mantenimiento

- Crear, editar y eliminar registros de mantenimiento
- Búsqueda y filtrado por vehículo
- Exportación a CSV
- Cálculo automático de edad del vehículo

### 📅 Mantenimiento Programado

- Programar mantenimientos por tiempo (años) o distancia (km)
- Alertas automáticas de mantenimientos próximos o vencidos
- Activar/desactivar programaciones

### 📊 Dashboard

- Resumen de estadísticas
- Alertas de mantenimientos próximos
- Historial de mantenimientos recientes

### 👥 Gestión de Usuarios (Solo Admins)

- Ver todos los usuarios
- Cambiar roles (Admin/Usuario)
- Eliminar usuarios y sus datos
- **Clonación de datos** entre usuarios
- **Gestión de perfiles** de usuario

### 📤 Exportación de Datos

- Exportación a XLS (Excel) con formato mejorado
- Exportación de registros de mantenimiento
- Exportación de vehículos
- Personalización de columnas

### 📱 PWA (Progressive Web App)

- Instalable en dispositivos móviles y escritorio
- Funcionamiento offline parcial
- Notificaciones push
- Actualizaciones automáticas
- Sincronización en segundo plano

### 📖 Documentación y Guías

- Manual de usuario integrado
- Acceso directo al manual desde la aplicación
- Vista independiente del manual
- Guías contextuales en cada sección
- Ejemplos de uso

### 🔐 Autenticación y Perfiles

- Sistema de login con email/contraseña
- Validación de contraseña reforzada
- Roles de usuario (Admin/Usuario)
- Perfiles personalizables
- Protección de rutas según permisos

### 📱 Interfaz Móvil

- Diseño responsive
- Navegación inferior optimizada para móviles
- Modales para formularios

### 📝 Notas Internas

- Sistema de notas y comentarios
- Registro de observaciones importantes
- Organización por fecha y título
- Editor de texto enriquecido
- Búsqueda y filtrado de notas
- Vinculación con mantenimientos

# TallerTracker Tracking PWA

This is a project built with using [Convex](https://convex.dev) as its backend.

This project is connected to the Convex deployment named [`knowing-hyena-923`](https://dashboard.convex.dev/d/knowing-hyena-923).

## Project structure

The frontend code is in the `app` directory and is built with [Vite](https://vitejs.dev/).

The backend code is in the `convex` directory.

`npm run dev` will start the frontend and backend servers.

## App authentication

Chef apps use [Convex Auth](https://auth.convex.dev/) with Anonymous auth for easy sign in. You may wish to change this before deploying your app.

## Developing and deploying your app

Check out the [Convex docs](https://docs.convex.dev/) for more information on how to develop with Convex.

- If you're new to Convex, the [Overview](https://docs.convex.dev/understanding/) is a good place to start
- Check out the [Hosting and Deployment](https://docs.convex.dev/production/) docs for how to deploy your app
- Read the [Best Practices](https://docs.convex.dev/understanding/best-practices/) guide for tips on how to improve you app further

## HTTP API

User-defined http routes are defined in the `convex/router.ts` file. We split these routes into a separate file from `convex/http.ts` to allow us to prevent the LLM from modifying the authentication routes.
