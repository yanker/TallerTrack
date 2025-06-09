# TallerTracker - Sistema de Gestión de Mantenimiento de Vehículos

![TallerTracker Logo](/favicon-32x32.png)

TallerTracker es una aplicación web progresiva (PWA) diseñada para ayudar a usuarios particulares y talleres a gestionar el mantenimiento de vehículos de forma eficiente. Permite realizar un seguimiento detallado del historial de mantenimiento, programar tareas futuras y recibir alertas de mantenimientos pendientes.

## 📋 Índice

- [Características principales](#características-principales)
- [Guía de uso](#guía-de-uso)
  - [Registro y acceso](#registro-y-acceso)
  - [Gestión de vehículos](#gestión-de-vehículos)
  - [Registros de mantenimiento](#registros-de-mantenimiento)
  - [Mantenimiento programado](#mantenimiento-programado)
  - [Dashboard](#dashboard)
  - [Gestión de usuarios](#gestión-de-usuarios)
- [Instalación como PWA](#instalación-como-pwa)
- [Preguntas frecuentes](#preguntas-frecuentes)
- [Información técnica](#información-técnica)

## ✨ Características principales

- **Sistema multiusuario** con roles de administrador y usuario estándar
- **Gestión completa de vehículos** con información detallada
- **Historial de mantenimientos** con búsqueda y filtrado avanzado
- **Programación de mantenimientos** por tiempo (años) y/o kilometraje
- **Alertas automáticas** de mantenimientos próximos o vencidos
- **Dashboard** con estadísticas y resumen visual
- **Exportación de datos** en formato CSV
- **Interfaz responsive** optimizada para dispositivos móviles
- **Editor WYSIWYG** para descripciones detalladas con formato
- **Identificación visual** con sistema de colores para vehículos

## 🚀 Guía de uso

### Registro y acceso

1. **Registro de nueva cuenta**:

   - Accede a la página principal de TallerTracker
   - Haz clic en "Registrarse"
   - Completa el formulario con tu correo electrónico y contraseña
   - Haz clic en "Crear cuenta"

2. **Inicio de sesión**:

   - Introduce tu correo electrónico y contraseña en la pantalla de login
   - Haz clic en "Iniciar sesión"
   - Serás redirigido automáticamente al Dashboard

3. **Roles de usuario**:
   - **Usuario estándar**: Puede gestionar sus propios vehículos y mantenimientos
   - **Administrador**: Además, puede gestionar todos los usuarios del sistema

### Gestión de vehículos

1. **Añadir un nuevo vehículo**:

   - Navega a la sección "Vehículos" en el menú lateral
   - Haz clic en el botón "+ Agregar"
   - Completa el formulario con los datos del vehículo:
     - Marca y modelo
     - Matrícula
     - Fecha de compra
     - Kilómetros iniciales
     - Color (para identificación visual)
   - Haz clic en "Guardar"

2. **Editar un vehículo existente**:

   - En la lista de vehículos, haz clic en el icono de lápiz (✏️) junto al vehículo que deseas editar
   - Modifica los campos necesarios
   - Haz clic en "Actualizar"

3. **Eliminar un vehículo**:
   - En la lista de vehículos, haz clic en el icono de papelera (🗑️) junto al vehículo que deseas eliminar
   - Confirma la acción en el diálogo de confirmación
   - **Importante**: Eliminar un vehículo también eliminará todos sus registros de mantenimiento y programaciones asociadas

### Registros de mantenimiento

1. **Añadir un nuevo registro de mantenimiento**:

   - Navega a la sección "Mantenimientos" en el menú lateral
   - Haz clic en el botón "+ Agregar"
   - Selecciona el vehículo al que deseas añadir el mantenimiento
   - Completa el formulario con:
     - Fecha de reparación
     - Kilómetros actuales
     - Coste (opcional)
     - Observaciones (utilizando el editor de texto enriquecido)
   - Haz clic en "Crear"

2. **Buscar y filtrar mantenimientos**:

   - Utiliza el campo de búsqueda para encontrar mantenimientos por descripción
   - Usa el selector de vehículo para filtrar mantenimientos por vehículo específico
   - Los resultados se actualizan automáticamente mientras escribes

3. **Exportar historial de mantenimientos**:
   - En la sección "Mantenimientos", haz clic en el botón "📊 Exportar"
   - Se descargará automáticamente un archivo CSV con todos los mantenimientos
   - Este archivo puede abrirse en Excel u otros programas de hoja de cálculo

### Mantenimiento programado

1. **Programar un nuevo mantenimiento**:

   - Navega a la sección "Mnto Programado" en el menú lateral
   - Haz clic en el botón "+ Programar Mantenimiento"
   - Selecciona el vehículo
   - Configura la frecuencia del mantenimiento:
     - Por tiempo: "Cada X Años" (ej: 1, 0.5 para 6 meses)
     - Por distancia: "Cada X Kilómetros" (ej: 10000, 5000)
     - Puedes configurar uno o ambos criterios
   - Describe el mantenimiento utilizando el editor de texto enriquecido
   - Haz clic en "Crear"

2. **Gestionar mantenimientos programados**:

   - Los mantenimientos programados aparecen en una lista ordenada
   - Puedes filtrarlos por vehículo o buscar por descripción
   - Para editar o desactivar un mantenimiento, haz clic en el icono de lápiz (✏️)
   - Los mantenimientos pueden estar activos o inactivos (solo los activos generan alertas)

3. **Alertas de mantenimiento**:
   - En la parte superior de la sección "Mnto Programado" aparece un panel rojo con los mantenimientos próximos o vencidos
   - También se muestran en el Dashboard para verlos rápidamente al iniciar sesión
   - La aplicación calcula automáticamente:
     - Mantenimientos vencidos por tiempo o kilometraje
     - Mantenimientos próximos (a menos de 6 meses o al 10% del kilometraje programado)

### Notas Internas

- El apartado de notas internas registrará notas, comentarios y otros conceptos que puedan ser importantes para el usuario con respecto a sus mantenimientos u otros aspectos

- Puede crear notas, clickando en el botín de Nueva nota y rellenando los datos de fecha, título y detalles.

### Dashboard

El Dashboard es la pantalla principal de la aplicación y ofrece una visión general de:

1. **Estadísticas generales**:

   - Número total de vehículos
   - Número total de mantenimientos realizados
   - Número de mantenimientos próximos o vencidos
   - Gasto total en mantenimientos

2. **Gráfico de costes**:

   - Visualización de gastos de mantenimiento por vehículo
   - Tendencias de gastos a lo largo del tiempo

3. **Alertas de mantenimientos próximos**:

   - Panel con los mantenimientos que requieren atención
   - Información detallada de cuándo vence cada mantenimiento

4. **Últimos mantenimientos realizados**:
   - Lista de los 5 mantenimientos más recientes
   - Acceso rápido al historial de actividad

### Gestión de usuarios (Solo administradores)

1. **Ver todos los usuarios**:

   - Los administradores pueden acceder a la sección "Usuarios" en el menú lateral
   - Muestra una lista completa de usuarios registrados en el sistema

2. **Cambiar roles de usuario**:

   - Haz clic en el selector de rol junto al usuario
   - Cambia entre "Usuario" y "Administrador"
   - Los cambios se aplican inmediatamente

3. **Eliminar usuarios**:

   - Haz clic en el icono de papelera (🗑️) junto al usuario
   - Confirma la acción en el diálogo de confirmación
   - **Importante**: Eliminar un usuario también eliminará todos sus vehículos, registros y programaciones

4. **Clonación de datos entre usuarios**:
   - Accede a la sección "Admin" en el menú inferior
   - Verás una lista de todos los usuarios del sistema
   - Para cada usuario origen puedes:
     - Ver su email y rol actual
     - Seleccionar un usuario destino del desplegable
     - Clonar todos sus datos con un clic
   - **Restricciones importantes**:
     - No se pueden clonar datos desde un administrador
     - No se pueden clonar datos hacia un administrador
     - No se pueden clonar datos al mismo usuario
   - **Proceso de clonación**:
     - Se borran todos los datos existentes del usuario destino
     - Se copian los vehículos del usuario origen
     - Se copian los registros de mantenimiento
     - Se copian los mantenimientos programados
     - Se copian las notas

### Exportación de datos mejorada

1. **Exportación a Excel (XLS)**:
   - En la sección de mantenimientos, usa el botón "📊 Exportar XLS"
   - El archivo Excel incluirá:
     - Formato profesional con colores y estilos
     - Columnas autoajustadas
     - Filtros predefinidos
     - Fórmulas de totales
   - Datos incluidos:
     - Detalles del vehículo
     - Fecha y kilometraje
     - Costes y totales
     - Observaciones formateadas

### Acceso al Manual de Usuario

1. **Durante el login**:

   - Botón "📖 ¿Cómo usar TallerTracker?"
   - Se abre en un modal para consulta rápida
   - Opción "Ver manual en nueva pestaña"

2. **Durante la sesión**:
   - Acceso directo al manual desde cualquier página
   - Búsqueda integrada de temas
   - Navegación por secciones

### Notas y Comentarios

Los usuarios pueden dejar notas y comentarios en sus registros de mantenimiento y vehículos.

Las notas son texto libre y se pueden usar para cualquier observación adicional.

## ❓ Preguntas frecuentes

**P: ¿Puedo usar TallerTracker sin conexión a internet?**  
R: Parcialmente. La aplicación requiere conexión a internet para guardar y cargar datos, pero algunas funciones básicas pueden estar disponibles sin conexión.

**P: ¿Qué navegadores son compatibles?**  
R: TallerTracker funciona mejor en navegadores modernos como Chrome, Firefox, Safari y Edge en sus versiones más recientes.

**P: ¿Mis datos están seguros?**  
R: Sí, TallerTracker utiliza autenticación segura y tus datos se almacenan en servidores con protección. Solo tú (y los administradores en caso necesario) pueden acceder a tu información.

**P: ¿Puedo transferir un vehículo a otro usuario?**  
R: Actualmente esta funcionalidad no está disponible, pero está planeada para futuras actualizaciones.

**P: ¿Qué significa el punto de color junto a cada vehículo?**  
R: Es un identificador visual que ayuda a reconocer rápidamente cada vehículo. Puedes asignar un color a cada vehículo al crearlo o editarlo.

**P: ¿Cómo funciona la clonación de datos entre usuarios?**  
R: Los administradores pueden copiar todos los datos de un usuario a otro. Ten en cuenta que esto borrará los datos existentes del usuario destino antes de la clonación.

**P: ¿Puedo exportar mis datos en diferentes formatos?**  
R: Sí, la aplicación permite exportar en formato XLS (Excel) con formato mejorado y CSV para mayor compatibilidad.

**P: ¿Cómo accedo al manual de usuario?**  
R: Puedes acceder al manual desde la pantalla de login, durante la sesión, o directamente a través de la URL /guide.

## 🔧 Información técnica

TallerTracker está desarrollado con las siguientes tecnologías:

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Convex (base de datos y lógica de servidor)
- **Autenticación**: Convex Auth
- **Visualización de datos**: Chart.js
- **Editor de texto**: React Quill

El código fuente está organizado siguiendo las mejores prácticas de desarrollo web moderno, con una arquitectura modular y componentes reutilizables.

---

© 2025 TallerTracker. Todos los derechos reservados.
