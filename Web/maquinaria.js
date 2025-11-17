// Variables globales
let filteredMachines = [];
let selectedMachine = null;

// Máquinas y Espacios organizados por activo con su historial
const ACTIVOS = [
    {
        id: 'TR-001',
        nombre: 'Tractor John Deere 5075E',
        numeroActivo: 'TR-001-JD',
        tipoActivo: 'Maquinaria Agrícola',
        ubicacion: 'Chañe - Almacén Principal',
        estado: 'en-progreso', // Estado actual basado en la orden más reciente
        estadoOperativo: 'mantenimiento',
        fechaInstalacion: '2020-01-15',
        costoTotalAcumulado: 18650, // 5 años de mantenimientos + reparaciones
        horasMantenimiento: 145,
        proximoMantenimiento: '2024-11-20',
        criticidad: 'Media', // No puede ser alta si está en mantenimiento programado
        icon: '🚜',
        ordenesActivas: ['OT-2024-001'],
        ultimoMantenimiento: '2024-11-10',
        historialOrdenes: [
            {
                id: 'OT-2024-001',
                tipo: 'correctivo',
                prioridad: 'Media',
                estado: 'en-progreso',
                fecha: '2024-11-13',
                descripcion: 'Ajuste sistema hidráulico',
                responsable: 'Carlos Méndez',
                tareas: ['Revisar presión hidráulica', 'Cambiar filtro hidráulico', 'Calibrar válvulas'],
                horas: 6,
                costo: 450
            },
            {
                id: 'OT-2024-012',
                tipo: 'preventivo',
                prioridad: 'Baja',
                estado: 'hecho',
                fecha: '2024-11-10',
                descripcion: 'Mantenimiento preventivo programado',
                responsable: 'Carlos Méndez',
                tareas: ['Cambio aceite motor', 'Revisión filtros aire', 'Inspección neumáticos'],
                horas: 4,
                costo: 280
            },
            {
                id: 'OT-2024-008',
                tipo: 'correctivo',
                prioridad: 'Alta',
                estado: 'hecho',
                fecha: '2024-09-22',
                descripcion: 'Reparación transmisión',
                responsable: 'Luis Rodríguez',
                tareas: ['Desmontar caja cambios', 'Reemplazar sincronizadores', 'Ajustar embrague'],
                horas: 18,
                costo: 2850
            },
            {
                id: 'OT-2024-005',
                tipo: 'preventivo',
                prioridad: 'Media',
                estado: 'hecho',
                fecha: '2024-08-15',
                descripcion: 'Mantenimiento 500 horas',
                responsable: 'Ana García',
                tareas: ['Cambio filtros combustible', 'Revisión sistema eléctrico', 'Lubricación general'],
                horas: 6,
                costo: 420
            },
            {
                id: 'OT-2023-045',
                tipo: 'correctivo',
                prioridad: 'Media',
                estado: 'hecho',
                fecha: '2023-12-10',
                descripcion: 'Sustitución neumáticos traseros',
                responsable: 'Carlos Méndez',
                tareas: ['Desmontaje neumáticos gastados', 'Montaje neumáticos nuevos', 'Equilibrado ruedas'],
                horas: 3,
                costo: 1200
            },
            {
                id: 'OT-2023-031',
                tipo: 'preventivo',
                prioridad: 'Baja',
                estado: 'hecho',
                fecha: '2023-09-18',
                descripcion: 'Inspección anual obligatoria',
                responsable: 'Inspector Técnico',
                tareas: ['Revisión seguridad', 'Verificación emisiones', 'Control documentación'],
                horas: 2,
                costo: 150
            },
            {
                id: 'OT-2023-018',
                tipo: 'correctivo',
                prioridad: 'Alta',
                estado: 'hecho',
                fecha: '2023-06-05',
                descripcion: 'Avería sistema refrigeración',
                responsable: 'Luis Rodríguez',
                tareas: ['Reparar radiador', 'Cambiar termostato', 'Rellenar líquido refrigerante'],
                horas: 8,
                costo: 680
            },
            {
                id: 'OT-2022-089',
                tipo: 'correctivo',
                prioridad: 'Media',
                estado: 'hecho',
                fecha: '2022-11-30',
                descripcion: 'Reparación sistema de dirección',
                responsable: 'Ana García',
                tareas: ['Cambiar rótulas dirección', 'Ajustar convergencia', 'Verificar servo-dirección'],
                horas: 12,
                costo: 1450
            },
            {
                id: 'OT-2022-067',
                tipo: 'preventivo',
                prioridad: 'Media',
                estado: 'hecho',
                fecha: '2022-08-22',
                descripcion: 'Mantenimiento mayor 1000 horas',
                responsable: 'Técnico Especializado',
                tareas: ['Revisión completa motor', 'Cambio correas distribución', 'Actualización software'],
                horas: 16,
                costo: 2200
            },
            {
                id: 'OT-2021-123',
                tipo: 'correctivo',
                prioridad: 'Crítica',
                estado: 'hecho',
                fecha: '2021-03-15',
                descripcion: 'Avería grave motor - Reconstrucción',
                responsable: 'Taller Especializado',
                tareas: ['Desmontaje completo motor', 'Rectificado cilindros', 'Montaje con piezas nuevas'],
                horas: 45,
                costo: 8500
            }
        ]
    },
    {
        id: 'PV-001',
        nombre: 'Pulverizador Apache AS1220',
        numeroActivo: 'PV-001-AP',
        tipoActivo: 'Maquinaria Tratamientos',
        ubicacion: 'Fuente el Olmo - Sector B',
        estado: 'por-hacer',
        estadoOperativo: 'programado',
        fechaInstalacion: '2020-05-10',
        costoTotalAcumulado: 24750, // 5 años de mantenimientos
        horasMantenimiento: 187,
        proximoMantenimiento: '2024-11-15',
        criticidad: 'Baja', // Programado no puede ser crítico
        icon: '💧',
        ordenesActivas: ['OT-2024-002'],
        ultimoMantenimiento: '2024-10-20',
        historialOrdenes: [
            {
                id: 'OT-2024-002',
                tipo: 'preventivo',
                prioridad: 'Baja',
                estado: 'por-hacer',
                fecha: '2024-11-15',
                descripcion: 'Calibración sistema de pulverización',
                responsable: 'Ana García',
                tareas: ['Cambiar filtros principales', 'Verificar presión bomba', 'Limpiar boquillas'],
                horas: 4,
                costo: 280
            },
            {
                id: 'OT-2024-015',
                tipo: 'preventivo',
                prioridad: 'Baja',
                estado: 'hecho',
                fecha: '2024-10-20',
                descripcion: 'Mantenimiento preventivo estacional',
                responsable: 'Ana García',
                tareas: ['Cambiar filtros secundarios', 'Calibración sistema', 'Limpieza general tanque'],
                horas: 3,
                costo: 200
            },
            {
                id: 'OT-2024-009',
                tipo: 'correctivo',
                prioridad: 'Media',
                estado: 'hecho',
                fecha: '2024-08-12',
                descripcion: 'Reparación bomba presión',
                responsable: 'Luis Rodríguez',
                tareas: ['Desmontar bomba', 'Cambiar sellos', 'Ajustar presión trabajo'],
                horas: 8,
                costo: 650
            },
            {
                id: 'OT-2023-078',
                tipo: 'correctivo',
                prioridad: 'Alta',
                estado: 'hecho',
                fecha: '2023-09-18',
                descripcion: 'Sustitución brazos pulverización',
                responsable: 'Carlos Méndez',
                tareas: ['Desmontar brazos dañados', 'Instalar brazos nuevos', 'Calibrar sistema'],
                horas: 12,
                costo: 2800
            },
            {
                id: 'OT-2023-052',
                tipo: 'preventivo',
                prioridad: 'Media',
                estado: 'hecho',
                fecha: '2023-04-15',
                descripcion: 'Mantenimiento mayor anual',
                responsable: 'Técnico Especializado',
                tareas: ['Revisión completa hidráulica', 'Cambio mangueras', 'Actualización software'],
                horas: 14,
                costo: 1850
            },
            {
                id: 'OT-2022-134',
                tipo: 'correctivo',
                prioridad: 'Media',
                estado: 'hecho',
                fecha: '2022-11-22',
                descripcion: 'Reparación tanque principal',
                responsable: 'Luis Rodríguez',
                tareas: ['Soldadura grietas', 'Prueba estanqueidad', 'Pintura protectora'],
                horas: 16,
                costo: 1200
            },
            {
                id: 'OT-2021-156',
                tipo: 'correctivo',
                prioridad: 'Crítica',
                estado: 'hecho',
                fecha: '2021-08-05',
                descripcion: 'Avería grave sistema hidráulico',
                responsable: 'Taller Especializado',
                tareas: ['Reconstrucción bomba principal', 'Cambio cilindros hidráulicos', 'Renovación circuito'],
                horas: 28,
                costo: 4500
            }
        ]
    },
    {
        id: 'NV-001',
        nombre: 'Nave Almacén 1',
        numeroActivo: 'NV-001-AL',
        tipoActivo: 'Infraestructura',
        ubicacion: 'Toro - Zona Industrial',
        estado: 'hecho',
        estadoOperativo: 'operativo',
        fechaInstalacion: '2015-06-20',
        costoTotalAcumulado: 35600, // 5 años de mantenimientos
        horasMantenimiento: 89,
        proximoMantenimiento: '2024-12-10',
        criticidad: 'Baja',
        icon: '🏢',
        ordenesActivas: [],
        ultimoMantenimiento: '2024-11-10',
        historialOrdenes: [
            {
                id: 'OT-2024-003',
                tipo: 'correctivo',
                prioridad: 'Baja',
                estado: 'hecho',
                fecha: '2024-11-10',
                descripcion: 'Falta de iluminación en sector norte',
                responsable: 'Luis Rodríguez',
                tareas: ['Revisar fusibles', 'Cambiar fluorescentes', 'Verificar cableado'],
                horas: 5,
                costo: 320
            }
        ]
    },
    {
        id: 'SR-001',
        nombre: 'Sistema Riego Central A',
        numeroActivo: 'SR-001-RC',
        tipoActivo: 'Sistema de Riego',
        ubicacion: 'Chañe - Sector Central',
        estado: 'hecho',
        estadoOperativo: 'operativo',
        fechaInstalacion: '2018-04-12',
        costoTotalAcumulado: 28950, // 5 años de mantenimientos
        horasMantenimiento: 156,
        proximoMantenimiento: '2024-12-08',
        criticidad: 'Baja', // Operativo no puede ser crítico
        icon: '💧',
        ordenesActivas: [],
        ultimoMantenimiento: '2024-11-08',
        historialOrdenes: [
            {
                id: 'OT-2024-004',
                tipo: 'preventivo',
                prioridad: 'Alta',
                estado: 'hecho',
                fecha: '2024-11-08',
                descripcion: 'Mantenimiento preventivo sistema riego',
                responsable: 'Miguel Torres',
                tareas: ['Inspección general', 'Limpieza filtros', 'Calibración sensores'],
                horas: 3,
                costo: 150
            }
        ]
    },
    {
        id: 'GN-006',
        nombre: 'Generador Caterpillar C15',
        numeroActivo: 'GN-006-CAT',
        tipoActivo: 'Grupo Electrógeno',
        ubicacion: 'Fuente el Olmo - Caseta Técnica',
        estado: 'hecho',
        estadoOperativo: 'operativo',
        fechaInstalacion: '2017-09-08',
        costoTotalAcumulado: 52100, // 5 años de mantenimientos
        horasMantenimiento: 234,
        proximoMantenimiento: '2024-11-25',
        criticidad: 'Baja', // Operativo no puede ser crítico
        icon: '⚡',
        ordenesActivas: [],
        ultimoMantenimiento: '2024-10-20',
        historialOrdenes: [
            {
                id: 'OT-2024-005',
                tipo: 'preventivo',
                prioridad: 'Baja',
                estado: 'hecho',
                fecha: '2024-10-20',
                descripcion: 'Mantenimiento preventivo generador',
                responsable: 'Carlos Méndez',
                tareas: ['Cambio aceite motor', 'Revisión filtros aire', 'Test carga completo'],
                horas: 4,
                costo: 350
            }
        ]
    }
];

// Para compatibilidad con funciones existentes
// const ACTIVOS ya está definido arriba

// Historial de mantenimiento basado en las órdenes de trabajo reales
const ORDENES_TRABAJO = [
    {
        id: 'OT-2024-001',
        numeroActivo: 'TR-001',
        activo: '🚜 Tractor John Deere 5075E',
        tipoMantenimiento: 'correctivo',
        tipoAveria: 'Motor',
        descripcionAveria: 'No arranca por las mañanas, hace ruido extraño',
        prioridad: 'Alta',
        responsable: 'Carlos Méndez',
        fechaInicio: '2024-11-13',
        fechaFin: '2024-11-14',
        estado: 'en-progreso',
        tareas: ['Revisar sistema de encendido', 'Verificar batería', 'Comprobar motor de arranque'],
        fechaCreacion: '2024-11-13',
        descripcion: 'Revisión urgente del sistema de arranque',
        horas: 6,
        costo: 450
    },
    {
        id: 'OT-2024-002',
        numeroActivo: 'PV-001',
        activo: '💧 Pulverizador Apache AS1220',
        tipoMantenimiento: 'preventivo',
        tipoAveria: null,
        descripcionAveria: null,
        prioridad: 'Media',
        responsable: 'Ana García',
        fechaInicio: '2024-11-15',
        fechaFin: '2024-11-15',
        estado: 'por-hacer',
        tareas: ['Cambiar filtros', 'Verificar presión', 'Limpiar boquillas'],
        fechaCreacion: '2024-11-12',
        descripcion: 'Mantenimiento programado mensual',
        horas: 4,
        costo: 280
    },
    {
        id: 'OT-2024-003',
        numeroActivo: 'NV-001',
        activo: '🏢 Nave Almacén 1',
        tipoMantenimiento: 'correctivo',
        tipoAveria: 'Eléctrico',
        descripcionAveria: 'Falta de iluminación en sector norte',
        prioridad: 'Baja',
        responsable: 'Luis Rodríguez',
        fechaInicio: '2024-11-10',
        fechaFin: '2024-11-10',
        estado: 'hecho',
        tareas: ['Revisar fusibles', 'Cambiar fluorescentes', 'Verificar cableado'],
        fechaCreacion: '2024-11-09',
        descripcion: 'Reparación sistema eléctrico',
        horas: 5,
        costo: 320
    },
    {
        id: 'OT-2024-004',
        numeroActivo: 'SR-001',
        activo: '💧 Sistema Riego Central A',
        tipoMantenimiento: 'preventivo',
        tipoAveria: null,
        descripcionAveria: null,
        prioridad: 'Alta',
        responsable: 'Miguel Torres',
        fechaInicio: '2024-11-08',
        fechaFin: '2024-11-08',
        estado: 'hecho',
        tareas: ['Inspección general', 'Limpieza filtros', 'Calibración sensores'],
        fechaCreacion: '2024-11-05',
        descripcion: 'Mantenimiento preventivo sistema riego',
        horas: 3,
        costo: 150
    },
    {
        id: 'OT-2024-005',
        numeroActivo: 'GN-006',
        activo: '⚡ Generador Caterpillar C15',
        tipoMantenimiento: 'preventivo',
        tipoAveria: null,
        descripcionAveria: null,
        prioridad: 'Crítica',
        responsable: 'Carlos Méndez',
        fechaInicio: '2024-10-20',
        fechaFin: '2024-10-20',
        estado: 'hecho',
        tareas: ['Cambio aceite', 'Revisión filtros', 'Test carga'],
        fechaCreacion: '2024-10-15',
        descripcion: 'Mantenimiento preventivo generador',
        horas: 2,
        costo: 200
    }
];

// Solicitudes activas (basadas en ver-solicitudes.js)
const SOLICITUDES = [
    {
        id: "SOL-001",
        fecha: "2024-11-10",
        nombre: "Carlos Martínez",
        tipoMantenimiento: "Mantenimiento Correctivo",
        importancia: "alta",
        numeroActivo: "TR-001",
        tipoActivo: "Tractor",
        ubicacion: "Sector 1",
        averia: "Sistema Hidráulico",
        tipoAveria: "Hidráulica",
        importanciaAveria: "Crítica",
        estadoActivo: "Parado",
        descripcion: "El tractor presenta problemas en el sistema hidráulico. Se requiere revisión completa del sistema y cambio de filtros."
    },
    {
        id: "SOL-002",
        fecha: "2024-11-09",
        nombre: "Ana García",
        tipoMantenimiento: "Mantenimiento Correctivo",
        importancia: "media",
        numeroActivo: "PV-002",
        tipoActivo: "Pulverizador",
        ubicacion: "Sector 2",
        averia: "Sistema Eléctrico",
        tipoAveria: "Eléctrica",
        importanciaAveria: "Mayor",
        estadoActivo: "En Mantenimiento",
        descripcion: "Fallo en el sistema de dosificación del pulverizador. La bomba no mantiene la presión constante."
    },
    {
        id: "SOL-003",
        fecha: "2024-11-08",
        nombre: "Miguel Rodriguez",
        tipoMantenimiento: "Mantenimiento Preventivo",
        importancia: "baja",
        numeroActivo: "CS-001",
        tipoActivo: "Cosechadora",
        ubicacion: "Campo Norte",
        averia: "Revisión General",
        tipoAveria: "Mecánica",
        importanciaAveria: "Menor",
        estadoActivo: "Operativo",
        descripcion: "Inspección rutinaria pre-temporada de la cosechadora. Revisión de todos los sistemas."
    }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando aplicación de gestión de activos...');
    console.log('📊 Activos disponibles:', ACTIVOS.length);
    
    // Verificar autenticación (sin bloquear si falla el navbar)
    try {
        verificarAutenticacion();
    } catch (error) {
        console.warn('⚠️ Error en verificación de autenticación:', error);
    }
    
    // Añadir flecha atrás a la navbar
    setTimeout(() => {
        añadirFlechaAtras();
    }, 100);
    
    // Cargar activos inmediatamente
    console.log('🔧 Cargando activos...');
    cargarActivos();
    
    console.log('📈 Calculando estadísticas...');
    calcularEstadisticas();
    
    console.log('✅ Aplicación inicializada completamente');
});

function añadirFlechaAtras() {
    const headerContent = document.querySelector('.header-content');
    if (headerContent) {
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.onclick = () => window.history.back();
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        
        // Insertarlo después del botón de menú
        const menuToggle = headerContent.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.parentNode.insertBefore(backBtn, menuToggle.nextSibling);
        }
    }
}

function verificarAutenticacion() {
    if (localStorage.getItem('gmao_logged_in') !== 'true') {
        window.location.href = '../index.html';
        return;
    }
    
    const username = localStorage.getItem('gmao_username');
    if (username !== 'gestortaller') {
        alert('❌ Acceso no autorizado para este usuario');
        window.location.href = '../index.html';
        return;
    }
    
    // Mostrar nombre de usuario si el elemento existe
    const userDisplay = document.getElementById('username-display');
    if (userDisplay) {
        userDisplay.textContent = 'Gestor Taller';
    }
}

function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('gmao_logged_in');
        localStorage.removeItem('gmao_username');
        window.location.href = '../index.html';
    }
}

function volverAtras() {
    window.location.href = '../index.html';
}





function cargarMaquinaria() {
    filteredMachines = [...MAQUINAS_ESPACIOS];
    renderizarMaquinaria();
}

function renderizarActivos() {
    const grid = document.getElementById('machine-grid');
    if (!grid) {
        console.error('❌ No se encontró elemento machine-grid');
        return;
    }
    
    grid.innerHTML = '';
    
    if (filteredMachines.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 3rem; color: var(--planasa-gray-600);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3>No se encontraron máquinas</h3>
                <p>Ajuste los filtros para ver más resultados</p>
            </div>
        `;
        return;
    }
    
    filteredMachines.forEach(machine => {
        const card = createMachineCard(machine);
        grid.appendChild(card);
    });
}

function createMachineCard(maquina) {
    const card = document.createElement('div');
    card.className = 'machine-card';
    card.onclick = () => mostrarDetalleMaquina(maquina);
    
    const estadoTexto = getEstadoTexto(maquina.estadoOperativo);
    const estadoClass = getEstadoClass(maquina.estadoOperativo);
    const icon = maquina.icon || getMachineIcon(maquina.tipo);
    
    // Usar coste acumulado de 5 años y horas de mantenimiento
    const costoTotal = maquina.costoTotalAcumulado || 0;
    const horasTotalesMantenimiento = maquina.horasMantenimiento || 0;
    
    // Obtener información de la orden activa
    const ordenActiva = maquina.historialOrdenes.find(orden => orden.estado !== 'hecho');
    const proximoMantenimiento = calculateDaysTo(maquina.proximoMantenimiento);
    
    // Crear indicador de estado con color
    const estadoIndicador = getEstadoIndicador(maquina.estadoOperativo);
    
    // Crear tags informativos
    const tags = [];
    if (maquina.horasTotales) tags.push(`${maquina.horasTotales}h operación`);
    if (maquina.historialOrdenes.length > 0) tags.push(`${maquina.historialOrdenes.length} órdenes`);
    if (ordenActiva) tags.push('Orden activa');
    
    card.innerHTML = `
        <div class="machine-compact-row">
            <div class="machine-basic-info">
                <div class="machine-icon-small">${icon}</div>
                <div class="machine-name-section">
                    <h4 class="machine-name">${maquina.nombre}</h4>
                    <div class="machine-meta">
                        <span class="machine-id">${maquina.id}</span>
                        <span class="machine-location"><i class="fas fa-map-marker-alt"></i>${maquina.ubicacion}</span>
                    </div>
                </div>
            </div>
            
            <div class="machine-kpis-compact">
                <span class="kpi-inline">€${costoTotal.toLocaleString()}</span>
                <span class="kpi-inline">${horasTotalesMantenimiento}h</span>
                <span class="kpi-inline">${maquina.historialOrdenes.length} órdenes</span>
            </div>
            
            <div class="machine-status-compact">
                <div class="status-indicator ${estadoClass}">
                    <i class="fas fa-circle"></i>
                    <span>${getEstadoTexto(maquina.estadoOperativo)}</span>
                </div>
                <div class="criticidad-badge priority-${maquina.criticidad.toLowerCase()}">
                    ${maquina.criticidad}
                </div>
            </div>
            
            ${ordenActiva ? `
                <div class="orden-badge">
                    <i class="fas fa-wrench"></i>
                    <span>Orden Activa</span>
                </div>
            ` : ''}
        </div>
    `;
    
    return card;
}

function getMachineIcon(tipo) {
    const icons = {
        'Tractor': '🚜',
        'Pulverizador': '💧',
        'Cosechadora': '🌾',
        'Infraestructura': '🏢',
        'Sistema de Riego': '💧',
        'Generador': '⚡',
        'Bomba': '💧',
        'Cultivador': '🔨'
    };
    return icons[tipo] || '⚙️';
}



function getEstadoTexto(estado) {
    const textos = {
        'operativo': 'Operativo',
        'en-progreso': 'En Progreso',
        'por-hacer': 'Por Hacer',
        'hecho': 'Completado',
        'mantenimiento': 'En Mantenimiento',
        'parado': 'Parado',
        'fuera-servicio': 'Fuera de Servicio'
    };
    return textos[estado] || estado;
}

function getEstadoClass(estado) {
    const classes = {
        'operativo': 'available',
        'en-progreso': 'maintenance',
        'por-hacer': 'repair',
        'hecho': 'available',
        'mantenimiento': 'maintenance',
        'programado': 'scheduled',
        'parado': 'repair',
        'fuera-servicio': 'outofservice'
    };
    return classes[estado] || 'available';
}

function getEstadoIndicador(estado) {
    const indicadores = {
        'operativo': '<i class="fas fa-check-circle"></i> Operativo',
        'mantenimiento': '<i class="fas fa-tools"></i> En Mantenimiento',
        'programado': '<i class="fas fa-calendar-check"></i> Programado',
        'parado': '<i class="fas fa-stop-circle"></i> Parado',
        'fuera-servicio': '<i class="fas fa-times-circle"></i> Fuera de Servicio'
    };
    return indicadores[estado] || '<i class="fas fa-question-circle"></i> ' + estado;
}

function getCriticidadIcon(criticidad) {
    const iconos = {
        'Crítica': '<i class="fas fa-exclamation-triangle"></i>',
        'Alta': '<i class="fas fa-exclamation-circle"></i>',
        'Media': '<i class="fas fa-info-circle"></i>',
        'Baja': '<i class="fas fa-minus-circle"></i>'
    };
    return iconos[criticidad] || '<i class="fas fa-circle"></i>';
}

function getEstadoColor(estado) {
    const colors = {
        'operativo': '#2e7d32',
        'mantenimiento': '#f7b500',
        'programado': '#2196F3',
        'parado': '#c62828',
        'fuera-servicio': '#9e9e9e'
    };
    return colors[estado] || '#2e7d32';
}

function calculateDaysTo(dateString) {
    if (!dateString || dateString === '—') return null;
    
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

function calculatePMProgress(days) {
    if (days === null) return null;
    
    const PM_WINDOW = 60; // Días de ventana para PM
    const clampedDays = Math.max(0, Math.min(days, PM_WINDOW));
    const percentage = Math.max(0, Math.min(100, 100 - (clampedDays / PM_WINDOW) * 100));
    
    let color = '#388e3c'; // Verde
    if (percentage > 75) color = '#d32f2f'; // Rojo
    else if (percentage > 50) color = '#f57c00'; // Naranja
    else if (percentage > 25) color = '#fbc02d'; // Amarillo
    
    return { percentage, color };
}

function formatearFecha(dateString) {
    if (!dateString || dateString === '—') return dateString;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit',
        year: '2-digit'
    });
}

function calcularEstadisticas() {
    const totalMaquinas = ACTIVOS.length;
    const maquinasOperativas = ACTIVOS.filter(m => m.estadoOperativo === 'operativo').length;
    const maquinasMantenimiento = ACTIVOS.filter(m => m.estadoOperativo === 'mantenimiento').length;
    const maquinasProgramadas = ACTIVOS.filter(m => m.estadoOperativo === 'programado').length;
    
    // Actualizar UI
    document.getElementById('total-machines').textContent = totalMaquinas;
    document.getElementById('available-percentage').textContent = maquinasOperativas;
    document.getElementById('maintenance-soon').textContent = maquinasMantenimiento;
    document.getElementById('avg-hours').textContent = maquinasProgramadas;
}

function aplicarFiltros() {
    const searchTerm = document.getElementById('search-filter').value.toLowerCase();
    const locationFilter = document.getElementById('location-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    
    // Filtrar máquinas/espacios
    filteredMachines = MAQUINAS_ESPACIOS.filter(maquina => {
        const matchesSearch = maquina.nombre.toLowerCase().includes(searchTerm) || 
                            maquina.id.toLowerCase().includes(searchTerm) ||
                            maquina.tipo.toLowerCase().includes(searchTerm);
        const matchesLocation = !locationFilter || maquina.ubicacion === locationFilter;
        const matchesType = !typeFilter || maquina.tipo === typeFilter;
        const matchesStatus = !statusFilter || maquina.estadoOperativo === statusFilter || maquina.estado === statusFilter;
        
        return matchesSearch && matchesLocation && matchesType && matchesStatus;
    });
    
    // Ordenar máquinas por orden inteligente por defecto
    sortMachines('smart');
    
    // Re-renderizar
    renderizarActivos();
}

function sortMachines(sortOption) {
    switch (sortOption) {
        case 'smart':
            filteredMachines.sort((a, b) => {
                // Primero por criticidad
                const criticidadOrder = { 'Crítica': 4, 'Alta': 3, 'Media': 2, 'Baja': 1 };
                const critDiff = criticidadOrder[b.criticidad] - criticidadOrder[a.criticidad];
                if (critDiff !== 0) return critDiff;
                
                // Luego por estado operativo
                const estadoOrder = { 'mantenimiento': 3, 'programado': 2, 'operativo': 1 };
                const estadoDiff = estadoOrder[b.estadoOperativo] - estadoOrder[a.estadoOperativo];
                if (estadoDiff !== 0) return estadoDiff;
                
                // Finalmente por nombre
                return a.nombre.localeCompare(b.nombre);
            });
            break;
        case 'proxpm':
            filteredMachines.sort((a, b) => new Date(a.proximoMantenimiento) - new Date(b.proximoMantenimiento));
            break;
        case 'horasdesc':
            filteredMachines.sort((a, b) => (b.horasTotales || 0) - (a.horasTotales || 0));
            break;
        case 'nombre':
            filteredMachines.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'criticidad':
            const criticidadOrder = { 'Crítica': 4, 'Alta': 3, 'Media': 2, 'Baja': 1 };
            filteredMachines.sort((a, b) => criticidadOrder[b.criticidad] - criticidadOrder[a.criticidad]);
            break;
        case 'estado':
            filteredMachines.sort((a, b) => a.estadoOperativo.localeCompare(b.estadoOperativo));
            break;
    }
}

function limpiarFiltros() {
    document.getElementById('search-filter').value = '';
    document.getElementById('location-filter').value = '';
    document.getElementById('type-filter').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('sort-filter').value = 'smart';
    
    aplicarFiltros();
}

function mostrarDetalleMaquina(maquina) {
    selectedMachine = maquina;
    const modal = document.getElementById('machine-detail-modal');
    const title = document.getElementById('modal-machine-title');
    const body = document.getElementById('modal-machine-body');
    
    title.textContent = `${maquina.nombre}`;
    
    const estadoTexto = getEstadoTexto(maquina.estadoOperativo);
    const proximoPM = formatearFecha(maquina.proximoMantenimiento);
    const diasPM = calculateDaysTo(maquina.proximoMantenimiento);
    const icon = maquina.icon || getMachineIcon(maquina.tipo);
    
    // Usar datos actualizados
    const costoTotal = maquina.costoTotalAcumulado || 0;
    const horasTotalesMantenimiento = maquina.horasMantenimiento || 0;
    const ordenesCompletadas = maquina.historialOrdenes.filter(o => o.estado === 'hecho').length;
    const ordenActiva = maquina.historialOrdenes.find(orden => orden.estado !== 'hecho');
    
    // Datos básicos del activo
    let datosBasicos = `
        <div class="detail-item">
            <span class="detail-label">Número de Activo:</span>
            <span class="detail-value">${maquina.numeroActivo}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Tipo de Activo:</span>
            <span class="detail-value">${maquina.tipoActivo}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Fecha Instalación:</span>
            <span class="detail-value">${formatearFecha(maquina.fechaInstalacion)}</span>
        </div>`;
    
    // Calcular estadísticas adicionales
    const ordenesPorTipo = {
        preventivo: maquina.historialOrdenes.filter(o => o.tipo === 'preventivo').length,
        correctivo: maquina.historialOrdenes.filter(o => o.tipo === 'correctivo').length
    };
    
    const ordenesUltimoAño = maquina.historialOrdenes.filter(o => {
        const fechaOrden = new Date(o.fecha);
        const haceUnAño = new Date();
        haceUnAño.setFullYear(haceUnAño.getFullYear() - 1);
        return fechaOrden >= haceUnAño;
    });
    
    body.innerHTML = `
        <div class="detail-section">
            <h4><i class="fas fa-info-circle"></i> Información del Activo</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">ID del Activo:</span>
                    <span class="detail-value">${icon} ${maquina.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Nombre:</span>
                    <span class="detail-value">${maquina.nombre}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Ubicación:</span>
                    <span class="detail-value"><i class="fas fa-map-marker-alt"></i> ${maquina.ubicacion}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Estado Operativo:</span>
                    <span class="detail-value" style="color: ${getEstadoColor(maquina.estadoOperativo)};">
                        <i class="fas fa-circle"></i> ${estadoTexto}
                    </span>
                </div>
                ${datosBasicos}
            </div>
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-chart-bar"></i> Estadísticas de Mantenimiento (5 años)</h4>
            <div class="stats-overview">
                <div class="stat-box">
                    <div class="stat-number">€${costoTotal.toLocaleString()}</div>
                    <div class="stat-label">Coste Total Acumulado</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${horasTotalesMantenimiento}h</div>
                    <div class="stat-label">Horas Mantenimiento</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${ordenesCompletadas}/${maquina.historialOrdenes.length}</div>
                    <div class="stat-label">Órdenes Completadas</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${ordenesPorTipo.preventivo}/${ordenesPorTipo.correctivo}</div>
                    <div class="stat-label">Preventivo/Correctivo</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${ordenesUltimoAño.length}</div>
                    <div class="stat-label">Órdenes Último Año</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">
                        <span class="criticality-badge ${maquina.criticidad.toLowerCase()}">${maquina.criticidad}</span>
                    </div>
                    <div class="stat-label">Criticidad Actual</div>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-clock"></i> Mantenimiento</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Próximo PM:</span>
                    <span class="detail-value ${diasPM.class}">${proximoPM} (${diasPM.text})</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Último Mantenimiento:</span>
                    <span class="detail-value">${formatearFecha(maquina.ultimoMantenimiento)}</span>
                </div>
            </div>
        </div>
        
        ${ordenActiva ? `
            <div class="detail-section">
                <h4><i class="fas fa-wrench"></i> Orden de Trabajo Activa</h4>
                <div class="active-order-detail">
                    <div class="order-header">
                        <h5>${ordenActiva.id}</h5>
                        <div class="order-priority priority-${ordenActiva.prioridad.toLowerCase()}">${ordenActiva.prioridad}</div>
                    </div>
                    <p><strong>Descripción:</strong> ${ordenActiva.descripcion}</p>
                    <p><strong>Responsable:</strong> ${ordenActiva.responsable}</p>
                    <p><strong>Fecha:</strong> ${formatearFecha(ordenActiva.fecha)}</p>
                    <div class="order-tasks">
                        <strong>Tareas:</strong>
                        <ul>
                            ${ordenActiva.tareas.map(tarea => `<li>${tarea}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="order-costs">
                        <span><i class="fas fa-clock"></i> ${ordenActiva.horas}h</span>
                        <span><i class="fas fa-euro-sign"></i> ${ordenActiva.costo}€</span>
                    </div>
                </div>
            </div>
        ` : ''}
        
        <div class="detail-section">
            <h4><i class="fas fa-wrench"></i> Historial de Mantenimientos</h4>
            <div class="historial-container">
                ${maquina.historialOrdenes.slice(0, 5).map(orden => `
                    <div class="historial-item ${orden.estado}">
                        <div class="historial-header">
                            <div class="historial-info">
                                <span class="historial-id">${orden.id}</span>
                                <span class="historial-fecha">${formatearFecha(orden.fecha)}</span>
                            </div>
                            <div class="historial-badges">
                                <span class="badge tipo-${orden.tipo}">${orden.tipo}</span>
                                <span class="badge prioridad-${orden.prioridad.toLowerCase()}">${orden.prioridad}</span>
                            </div>
                        </div>
                        <div class="historial-descripcion">${orden.descripcion}</div>
                        <div class="historial-detalles">
                            <span class="detalle-item"><i class="fas fa-user"></i> ${orden.responsable}</span>
                            <span class="detalle-item"><i class="fas fa-clock"></i> ${orden.horas}h</span>
                            <span class="detalle-item"><i class="fas fa-euro-sign"></i> €${orden.costo}</span>
                        </div>
                        ${orden.tareas && orden.tareas.length > 0 ? `
                            <div class="historial-tareas">
                                <strong>Tareas:</strong>
                                <ul>
                                    ${orden.tareas.map(tarea => `<li>${tarea}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                ${maquina.historialOrdenes.length > 5 ? `
                    <div class="ver-mas-historial">
                        <button class="btn-link" onclick="verHistorialCompleto('${maquina.id}')">
                            <i class="fas fa-chevron-down"></i> Ver todos los ${maquina.historialOrdenes.length} mantenimientos
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
        

    `;
    
    modal.style.display = 'block';
}

function cerrarModalDetalle() {
    document.getElementById('machine-detail-modal').style.display = 'none';
    selectedMachine = null;
}

function crearOrdenDesdeModal() {
    if (selectedMachine) {
        window.location.href = `crear-orden-trabajo.html?maquina=${selectedMachine.id}`;
    }
}

function verHistorialMantenimiento(activoId) {
    const modal = document.getElementById('maintenance-history-modal');
    const title = document.getElementById('history-modal-title');
    const body = document.getElementById('history-modal-body');
    
    const activo = ACTIVOS.find(a => a.id === activoId);
    // Filtrar órdenes de trabajo por activo
    const historyOrdenes = ORDENES_TRABAJO.filter(ot => ot.numeroActivo === activo.numeroActivo);
    // Filtrar solicitudes por activo
    const historySolicitudes = SOLICITUDES.filter(s => s.numeroActivo === activo.numeroActivo);
    
    title.textContent = `Historial de Mantenimientos - ${activo.nombre}`;
    
    if (historyOrdenes.length === 0 && historySolicitudes.length === 0) {
        body.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>Sin historial de mantenimientos</h3>
                <p>Este activo no tiene registros de mantenimiento previos.</p>
            </div>
        `;
    } else {
        const totalCosto = historyOrdenes.reduce((sum, h) => sum + (h.costo || 0), 0);
        const totalHoras = historyOrdenes.reduce((sum, h) => sum + (h.horas || 0), 0);
        
        body.innerHTML = `
            <div class="detail-section">
                <h4><i class="fas fa-chart-bar"></i> Resumen</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Total Órdenes:</span>
                        <span class="detail-value">${historyOrdenes.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Solicitudes Pendientes:</span>
                        <span class="detail-value">${historySolicitudes.length}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Costo Total:</span>
                        <span class="detail-value">${totalCosto}€</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Horas Totales:</span>
                        <span class="detail-value">${totalHoras}h</span>
                    </div>
                </div>
            </div>
            
            ${historyOrdenes.length > 0 ? `
                <div class="detail-section">
                    <h4><i class="fas fa-wrench"></i> Órdenes de Trabajo</h4>
                    <table class="maintenance-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Orden</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Responsable</th>
                                <th>Prioridad</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${historyOrdenes.map(ot => `
                                <tr>
                                    <td>${formatearFecha(ot.fechaInicio)}</td>
                                    <td>${ot.id}</td>
                                    <td>
                                        <span style="background: ${ot.tipoMantenimiento === 'preventivo' ? '#388e3c' : '#f57c00'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">
                                            ${ot.tipoMantenimiento === 'preventivo' ? 'Preventivo' : 'Correctivo'}
                                        </span>
                                    </td>
                                    <td>${ot.descripcion || ot.descripcionAveria || 'Sin descripción'}</td>
                                    <td>
                                        <span style="color: ${getEstadoOrdenColor(ot.estado)}; font-weight: 600;">
                                            ${getEstadoOrdenTexto(ot.estado)}
                                        </span>
                                    </td>
                                    <td>${ot.responsable}</td>
                                    <td>
                                        <span class="criticality-badge ${ot.prioridad.toLowerCase()}">${ot.prioridad}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}
            
            ${historySolicitudes.length > 0 ? `
                <div class="detail-section">
                    <h4><i class="fas fa-clipboard-list"></i> Solicitudes Pendientes</h4>
                    <table class="maintenance-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Solicitud</th>
                                <th>Solicitante</th>
                                <th>Tipo</th>
                                <th>Avería</th>
                                <th>Importancia</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${historySolicitudes.map(sol => `
                                <tr>
                                    <td>${formatearFecha(sol.fecha)}</td>
                                    <td>${sol.id}</td>
                                    <td>${sol.nombre}</td>
                                    <td>${sol.tipoMantenimiento}</td>
                                    <td>${sol.averia}</td>
                                    <td>
                                        <span class="criticality-badge ${sol.importancia}">${sol.importancia}</span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}
        `;
    }
    
    modal.style.display = 'flex';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function getEstadoOrdenColor(estado) {
    const colors = {
        'hecho': '#2e7d32',
        'en-progreso': '#f57c00',
        'por-hacer': '#1976d2',
        'parado': '#d32f2f'
    };
    return colors[estado] || '#666';
}

function getEstadoOrdenTexto(estado) {
    const textos = {
        'hecho': 'Completado',
        'en-progreso': 'En Progreso',
        'por-hacer': 'Por Hacer',
        'parado': 'Parado'
    };
    return textos[estado] || estado;
}

function getEstadoHistorialColor(estado) {
    const colors = {
        'completado': '#2e7d32',
        'en-progreso': '#f57c00',
        'pendiente': '#d32f2f'
    };
    return colors[estado] || '#666';
}

function getEstadoHistorialTexto(estado) {
    const textos = {
        'completado': 'Completado',
        'en-progreso': 'En Progreso',
        'pendiente': 'Pendiente'
    };
    return textos[estado] || estado;
}

function cerrarModalHistorial() {
    document.getElementById('maintenance-history-modal').style.display = 'none';
}

function crearOrdenTrabajo() {
    // Redirigir a la página de creación de órdenes de trabajo
    alert('Funcionalidad de crear orden de trabajo - redirigir a página correspondiente');
    // window.location.href = '../Tablet/crear-orden-trabajo.html';
}

// Función para ver historial completo de una máquina
function verHistorialCompleto(maquinaId) {
    const maquina = MAQUINAS_ESPACIOS.find(m => m.id === maquinaId);
    if (!maquina) return;
    
    const modal = document.getElementById('maintenance-history-modal');
    const title = document.getElementById('history-modal-title');
    const body = document.getElementById('history-modal-body');
    
    title.textContent = `Historial de ${maquina.nombre}`;
    
    body.innerHTML = `
        <div class="history-overview">
            <div class="history-stats">
                <div class="stat-item">
                    <div class="stat-number">${maquina.historialOrdenes.length}</div>
                    <div class="stat-label">Total Órdenes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${maquina.historialOrdenes.filter(o => o.estado === 'hecho').length}</div>
                    <div class="stat-label">Completadas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${maquina.historialOrdenes.reduce((total, orden) => total + orden.horas, 0)}h</div>
                    <div class="stat-label">Total Horas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${maquina.historialOrdenes.reduce((total, orden) => total + orden.costo, 0)}€</div>
                    <div class="stat-label">Total Costo</div>
                </div>
            </div>
        </div>
        
        <div class="history-timeline">
            ${maquina.historialOrdenes.map(orden => `
                <div class="timeline-item ${orden.estado}">
                    <div class="timeline-marker">
                        <i class="fas ${orden.tipo === 'preventivo' ? 'fa-calendar-check' : 'fa-tools'}"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h4>${orden.id}</h4>
                            <div class="order-badges">
                                <span class="badge badge-${orden.tipo}">${orden.tipo}</span>
                                <span class="badge badge-priority-${orden.prioridad.toLowerCase()}">${orden.prioridad}</span>
                                <span class="badge badge-status-${orden.estado}">${getEstadoTexto(orden.estado)}</span>
                            </div>
                        </div>
                        <div class="timeline-description">${orden.descripcion}</div>
                        <div class="timeline-tasks">
                            <strong>Tareas realizadas:</strong>
                            <ul>
                                ${orden.tareas.map(tarea => `<li>${tarea}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="timeline-footer">
                            <div class="timeline-details">
                                <span><i class="fas fa-calendar"></i> ${formatearFecha(orden.fecha)}</span>
                                <span><i class="fas fa-user"></i> ${orden.responsable}</span>
                                <span><i class="fas fa-clock"></i> ${orden.horas}h</span>
                                <span><i class="fas fa-euro-sign"></i> ${orden.costo}€</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    modal.style.display = 'block';
}

// Función para calcular días hasta fecha
function calculateDaysTo(fecha) {
    const today = new Date();
    const targetDate = new Date(fecha);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return { 
            text: `Vencido (${Math.abs(diffDays)} días)`, 
            class: 'overdue',
            days: diffDays 
        };
    } else if (diffDays === 0) {
        return { 
            text: 'Hoy', 
            class: 'today',
            days: diffDays 
        };
    } else if (diffDays <= 7) {
        return { 
            text: `En ${diffDays} días`, 
            class: 'soon',
            days: diffDays 
        };
    } else {
        return { 
            text: `En ${diffDays} días`, 
            class: 'normal',
            days: diffDays 
        };
    }
}

// Función para formatear fechas
function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para crear orden de trabajo
function crearOrdenTrabajo(maquinaId) {
    const maquina = MAQUINAS_ESPACIOS.find(m => m.id === maquinaId);
    if (!maquina) return;
    
    // Por ahora, mostrar un alert - en una implementación real abriría un formulario
    alert(`Crear nueva orden de trabajo para: ${maquina.nombre}\n\nEsta funcionalidad se implementaría con un formulario completo.`);
}

// Event listeners para cerrar modales con click fuera
window.onclick = function(event) {
    const detailModal = document.getElementById('machine-detail-modal');
    const historyModal = document.getElementById('maintenance-history-modal');
    
    if (event.target === detailModal) {
        cerrarModalDetalle();
    }
    if (event.target === historyModal) {
        cerrarModalHistorial();
    }
}

// Event listeners para teclas
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModalDetalle();
        cerrarModalHistorial();
    }
});