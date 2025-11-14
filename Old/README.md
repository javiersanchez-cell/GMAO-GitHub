# GMAO PLANASA - Sistema de Gestión de Órdenes de Trabajo

Sistema modular de gestión de mantenimiento, órdenes de trabajo y equipos para PLANASA.

## 🏗️ Estructura del Proyecto

```
Web/
├── GMO.html                    # Página principal
├── components/
│   └── navbar.html            # Componente navbar reutilizable
├── css/
│   └── styles.css             # Estilos centralizados con branding PLANASA
└── js/
    ├── data.js                # Datos de órdenes de trabajo y funciones utilitarias
    └── app.js                 # Lógica principal de la aplicación
```

## 🎨 Características

### ✅ **Arquitectura Modular**
- Componentes separados y reutilizables
- CSS centralizado
- Datos separados de la lógica

### ✅ **Funcionalidades Principales**
- **📅 Vista Calendario**: Visualización de eventos por fechas con interacción
- **📊 Vista Kanban**: Gestión de estados de órdenes de trabajo
- **📋 Vista Tabla**: Lista completa con ordenamiento y filtros
- **🔍 Sistema de Filtros**: Por estado, prioridad, tipo y fechas
- **🎯 Modales Interactivos**: Detalles y gestión de órdenes de trabajo

### ✅ **Tipos de Órdenes de Trabajo**
- **🔧 Correctivo**: Reparaciones y arreglos urgentes
- **⚙️ Preventivo**: Mantenimiento programado
- **🏗️ Construcción**: Proyectos de construcción e instalación

### ✅ **Estados del Sistema**
- **� Por Hacer**: Nuevas órdenes pendientes
- **⚡ En Progreso**: Órdenes siendo trabajadas
- **� Preventivo**: Mantenimiento programado
- **⛔ Parado**: Órdenes pausadas
- **✅ Hecho**: Órdenes completadas

## 🚀 Funcionalidades del Calendario

- **Eventos Clickeables**: Click en eventos individuales para ver detalles
- **Indicador Multi-Eventos**: Muestra "+X más" cuando hay múltiples eventos por día
- **Modal de Día**: Click en "+X más" para ver todos los eventos del día
- **Filtros Integrados**: Los filtros se aplican también en la vista calendario

## 📊 Funcionalidades de la Tabla

- **Ordenamiento**: Click en headers para ordenar por cualquier columna
- **Filtros Avanzados**: Por estado, prioridad, tipo, fecha y búsqueda
- **Badges de Estado**: Colores diferenciados según tipo y estado
- **Interacción**: Click en filas para abrir detalles

## 🎨 Diseño PLANASA

- **Colores Corporativos**: Verde PLANASA (#00a651) como color principal
- **Responsive**: Adaptado para desktop y móvil
- **Consistencia Visual**: Componentes con diseño unificado

## � Archivos Principales

### `js/data.js`
Contiene toda la información de órdenes de trabajo y funciones utilitarias:
- `WORK_ORDERS`: Array con todas las órdenes de trabajo
- `getWorkOrderById()`: Obtener orden por ID
- `getWorkOrdersByDateRange()`: Filtrar por rango de fechas
- `getWorkOrderStats()`: Estadísticas del sistema

### `js/app.js`
Lógica principal de la aplicación:
- Gestión de vistas (calendario, kanban, tabla)
- Sistema de filtros unificado
- Interacciones con modales
- Renderizado dinámico de contenido

### `css/styles.css`
Estilos centralizados con:
- Variables CSS para colores PLANASA
- Componentes reutilizables
- Diseño responsive
- Animaciones y transiciones

## � Uso

1. Abrir `GMO.html` en un navegador web
2. Navegar entre las diferentes vistas usando la barra de navegación
3. Usar los filtros para encontrar órdenes específicas
4. Click en elementos para ver detalles y gestionar estados

## � Próximas Mejoras

- [ ] Integración con backend/API
- [ ] Notificaciones en tiempo real
- [ ] Export de datos (PDF, Excel)
- [ ] Gestión de usuarios y permisos
- [ ] Dashboard con métricas avanzadas