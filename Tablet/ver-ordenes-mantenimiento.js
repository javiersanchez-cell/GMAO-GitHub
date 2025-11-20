// Variables globales
let ordenesDeTrabajoGlobal = [];
let ordenSeleccionada = null;
let modoVista = 'kanban'; // 'kanban', 'tabla', 'calendario'

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarOrdenesExistentes();
    cargarNuevasOrdenes();
    actualizarContadores();
});

function volverAtras() {
    window.location.href = 'jefedetaller.html';
}

// Cargar órdenes existentes (simuladas)
function cargarOrdenesExistentes() {
    const ordenesEjemplo = [
        {
            id: 'OM-2025-001',
            activo: '🚜 Tractor John Deere 5075E',
            categoriaActivo: 'Maquinaria',
            tipoActivo: 'Tractor', 
            ubicacion: 'Fuente el Olmo',           
            tipoMantenimiento: 'correctivo',
            tipoAveria: 'Motor',
            descripcionAveria: 'No arranca por las mañanas, hace ruido extraño',
            acciones: 'Se realizó una inspección visual preliminar. Se comprobó el nivel de combustible y estado de la batería.',
            solicitante: 'Juan Pérez',
            prioridad: 'Alta',
            responsable: 'Carlos Méndez',
            equipoApoyo: ['Ana García'],
            fechaInicio: '2025-11-21',
            fechaFin: '2025-11-25',
            duracionHoras: 32,
            estado: 'en-progreso',
            tareas: ['Revisar sistema de encendido', 'Verificar batería', 'Comprobar motor de arranque'],
            fechaCreacion: new Date('2025-11-21T08:00:00'),
            descripcion: 'Revisión urgente del sistema de arranque',
            descripcionTareas: 'Realizar diagnóstico completo del sistema de arranque y motor',
            historicoMantenimientos: [
                {
                    fecha: '2025-09-15',
                    tipo: 'Preventivo',
                    descripcion: 'Cambio de aceite y filtros',
                    responsable: 'Carlos Méndez',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-06-20',
                    tipo: 'Correctivo',
                    descripcion: 'Reparación sistema hidráulico',
                    responsable: 'Luis Fernández',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-03-10',
                    tipo: 'Preventivo',
                    descripcion: 'Revisión general pre-temporada',
                    responsable: 'Ana García',
                    estado: 'Completado'
                }
            ]
        },
        {
            id: 'OM-2025-002',
            activo: '💧 Pulverizador Apache AS1220',
            categoriaActivo: 'Maquinaria',
            tipoActivo: 'Pulverizador',
            ubicacion: 'Fuente el Olmo',
            tipoMantenimiento: 'preventivo',
            tipoAveria: null,
            descripcionAveria: 'Mantenimiento preventivo mensual programado',
            acciones: null,
            solicitante: 'Sistema Automático',
            prioridad: 'Media',
            responsable: 'Ana García',
            equipoApoyo: [],
            fechaInicio: '2025-11-22',
            fechaFin: '2025-11-22',
            duracionHoras: 4,
            estado: 'por-hacer',
            tareas: ['Cambiar filtros', 'Verificar presión', 'Limpiar boquillas'],
            fechaCreacion: new Date('2025-11-22T14:30:00'),
            descripcion: 'Mantenimiento programado mensual',
            descripcionTareas: 'Mantenimiento preventivo según plan anual',
            historicoMantenimientos: [
                {
                    fecha: '2025-10-15',
                    tipo: 'Preventivo',
                    descripcion: 'Mantenimiento mensual - Cambio filtros',
                    responsable: 'Ana García',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-09-12',
                    tipo: 'Preventivo',
                    descripcion: 'Mantenimiento mensual - Limpieza boquillas',
                    responsable: 'María Ruiz',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-08-08',
                    tipo: 'Correctivo',
                    descripcion: 'Reparación bomba de dosificación',
                    responsable: 'Carlos Méndez',
                    estado: 'Completado'
                }
            ]
        },
        {
            id: 'OM-2025-003',
            activo: '🏢 Nave Almacén 1',
            categoriaActivo: 'Infraestructura',
            tipoActivo: 'Edificio',
            ubicacion: 'Fuente el Olmo',
            tipoMantenimiento: 'correctivo',
            tipoAveria: 'Eléctrico',
            descripcionAveria: 'Falta de iluminación en sector norte',
            acciones: 'Se reinició el cuadro eléctrico general y se verificó el estado de los interruptores.',
            solicitante: 'Miguel Torres',
            prioridad: 'Baja',
            responsable: 'Luis Rodríguez',
            equipoApoyo: ['Diego López'],
            fechaInicio: '2025-11-18',
            fechaFin: '2025-11-19',
            duracionHoras: 2,
            estado: 'hecho',
            tareas: ['Revisar fusibles', 'Cambiar fluorescentes', 'Verificar cableado'],
            fechaCreacion: new Date('2025-11-18T16:20:00'),
            descripcion: 'Reparación sistema eléctrico',
            descripcionTareas: 'Solucionar problema de iluminación en nave',
            historicoMantenimientos: [
                {
                    fecha: '2025-08-20',
                    tipo: 'Preventivo',
                    descripcion: 'Revisión sistema eléctrico general',
                    responsable: 'Luis Rodríguez',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-05-10',
                    tipo: 'Correctivo',
                    descripcion: 'Reparación portón automático',
                    responsable: 'Diego López',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-02-15',
                    tipo: 'Preventivo',
                    descripcion: 'Mantenimiento anual instalaciones',
                    responsable: 'Luis Rodríguez',
                    estado: 'Completado'
                }
            ]
        },
        {
            id: 'OM-2025-004',
            activo: '🚜 Cosechadora Case IH 8250',
            categoriaActivo: 'Maquinaria',
            tipoActivo: 'Cosechadora',
            ubicacion: 'Moguer',
            tipoMantenimiento: 'preventivo',
            tipoAveria: null,
            descripcionAveria: 'Revisión pre-campaña de cosecha',
            acciones: null,
            solicitante: 'Sistema Automático',
            prioridad: 'Crítica',
            responsable: 'Carlos Méndez',
            equipoApoyo: ['Ana García', 'Luis Rodríguez'],
            fechaInicio: '2025-11-24',
            fechaFin: '2025-11-28',
            duracionHoras: 32,
            estado: 'por-hacer',
            tareas: ['Revisar sistema de corte', 'Verificar motor', 'Calibrar sensores', 'Cambiar aceite hidráulico', 'Inspeccionar cadenas'],
            fechaCreacion: new Date('2025-11-24T09:00:00'),
            descripcion: 'Preparación completa para campaña',
            descripcionTareas: 'Revisión exhaustiva de todos los sistemas antes de iniciar la campaña de cosecha',
            historicoMantenimientos: [
                {
                    fecha: '2025-05-20',
                    tipo: 'Preventivo',
                    descripcion: 'Mantenimiento post-campaña anterior',
                    responsable: 'Carlos Méndez',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-03-15',
                    tipo: 'Correctivo',
                    descripcion: 'Reparación sistema de trilla',
                    responsable: 'Pedro Sánchez',
                    estado: 'Completado'
                }
            ]
        },
        {
            id: 'OM-2025-005',
            activo: '❄️ Sistema Climatización Cámara 3',
            categoriaActivo: 'Equipamiento',
            tipoActivo: 'Sistema HVAC',
            ubicacion: 'Moguer',
            tipoMantenimiento: 'correctivo',
            tipoAveria: 'Climatización',
            descripcionAveria: 'Temperatura no se mantiene estable, pérdida de gas refrigerante',
            acciones: 'Se detectó fuga en tubería de cobre. Se aisló el sistema y se programó reparación.',
            solicitante: 'Laura Martínez',
            prioridad: 'Crítica',
            responsable: 'María López',
            equipoApoyo: ['Diego López'],
            fechaInicio: '2025-11-20',
            fechaFin: '2025-11-23',
            duracionHoras: 24,
            estado: 'en-progreso',
            tareas: ['Localizar fuga exacta', 'Reparar tubería', 'Recargar gas refrigerante', 'Verificar presiones', 'Test 24h'],
            fechaCreacion: new Date('2025-11-20T07:30:00'),
            descripcion: 'Reparación urgente sistema refrigeración',
            descripcionTareas: 'Solucionar fuga y restablecer condiciones óptimas de cámara frigorífica',
            historicoMantenimientos: [
                {
                    fecha: '2025-09-01',
                    tipo: 'Preventivo',
                    descripcion: 'Revisión trimestral sistema climatización',
                    responsable: 'María López',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-06-15',
                    tipo: 'Preventivo',
                    descripcion: 'Limpieza condensadores y filtros',
                    responsable: 'Diego López',
                    estado: 'Completado'
                }
            ]
        },
        {
            id: 'OM-2025-006',
            activo: '🔧 Sistema Riego Automático Sector B',
            categoriaActivo: 'Infraestructura',
            tipoActivo: 'Sistema de riego',
            ubicacion: 'Huelva',
            tipoMantenimiento: 'correctivo',
            tipoAveria: 'Hidráulico',
            descripcionAveria: 'Electroválvula 7 no abre correctamente, riego irregular',
            acciones: 'Revisión manual de electroválvula. Se confirmó obstrucción parcial.',
            solicitante: 'Roberto García',
            prioridad: 'Media',
            responsable: 'Luis Rodríguez',
            equipoApoyo: [],
            fechaInicio: '2025-11-25',
            fechaFin: '2025-11-26',
            duracionHoras: 6,
            estado: 'por-hacer',
            tareas: ['Desmontar electroválvula', 'Limpiar membrana', 'Revisar solenoide', 'Montar y probar'],
            fechaCreacion: new Date('2025-11-25T11:00:00'),
            descripcion: 'Reparación electroválvula sector B',
            descripcionTareas: 'Limpieza y ajuste de electroválvula para restablecer riego uniforme',
            historicoMantenimientos: [
                {
                    fecha: '2025-10-01',
                    tipo: 'Preventivo',
                    descripcion: 'Revisión general sistema riego',
                    responsable: 'Luis Rodríguez',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-07-20',
                    tipo: 'Correctivo',
                    descripcion: 'Reparación tubería principal',
                    responsable: 'Ana García',
                    estado: 'Completado'
                }
            ]
        },
        {
            id: 'OM-2025-007',
            activo: '⚡ Generador Eléctrico Caterpillar 350kVA',
            categoriaActivo: 'Equipamiento',
            tipoActivo: 'Generador',
            ubicacion: 'Huelva',
            tipoMantenimiento: 'preventivo',
            tipoAveria: null,
            descripcionAveria: 'Mantenimiento programado 1000 horas',
            acciones: null,
            solicitante: 'Sistema Automático',
            prioridad: 'Alta',
            responsable: 'Carlos Méndez',
            equipoApoyo: ['Pedro Sánchez'],
            fechaInicio: '2025-11-26',
            fechaFin: '2025-11-27',
            duracionHoras: 12,
            estado: 'por-hacer',
            tareas: ['Cambio aceite motor', 'Cambio filtros aire/combustible', 'Revisar batería', 'Verificar alternador', 'Test carga'],
            fechaCreacion: new Date('2025-11-26T13:45:00'),
            descripcion: 'Mantenimiento 1000h según fabricante',
            descripcionTareas: 'Mantenimiento preventivo programado cada 1000 horas de funcionamiento',
            historicoMantenimientos: [
                {
                    fecha: '2025-08-10',
                    tipo: 'Preventivo',
                    descripcion: 'Mantenimiento 500 horas',
                    responsable: 'Carlos Méndez',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-05-05',
                    tipo: 'Correctivo',
                    descripcion: 'Reparación sistema arranque',
                    responsable: 'Pedro Sánchez',
                    estado: 'Completado'
                }
            ]
        },
        {
            id: 'OM-2025-008',
            activo: '🚚 Carretilla Elevadora Toyota 02-8FDF25',
            categoriaActivo: 'Maquinaria',
            tipoActivo: 'Carretilla',
            ubicacion: 'Moguer',
            tipoMantenimiento: 'correctivo',
            tipoAveria: 'Hidráulico',
            descripcionAveria: 'Horquillas no suben, pérdida de fuerza hidráulica',
            acciones: 'Inspección visual detectó fuga aceite en cilindro elevación.',
            solicitante: 'Francisco Ruiz',
            prioridad: 'Alta',
            responsable: 'Ana García',
            equipoApoyo: [],
            fechaInicio: '2025-11-27',
            fechaFin: '2025-11-29',
            duracionHoras: 15,
            estado: 'en-progreso',
            tareas: ['Desmontar cilindro hidráulico', 'Cambiar retenes', 'Rellenar aceite hidráulico', 'Purgar sistema', 'Probar elevación'],
            fechaCreacion: new Date('2025-11-27T08:00:00'),
            descripcion: 'Reparación sistema hidráulico elevación',
            descripcionTareas: 'Cambio de retenes y restablecimiento presión hidráulica',
            historicoMantenimientos: [
                {
                    fecha: '2025-09-25',
                    tipo: 'Preventivo',
                    descripcion: 'Revisión general + cambio aceite',
                    responsable: 'Ana García',
                    estado: 'Completado'
                },
                {
                    fecha: '2025-06-10',
                    tipo: 'Correctivo',
                    descripcion: 'Reparación freno mano',
                    responsable: 'Luis Rodríguez',
                    estado: 'Completado'
                }
            ]
        }
    ];

    ordenesDeTrabajoGlobal = [...ordenesEjemplo];
    renderizarOrdenes();
}

// Cargar nuevas órdenes desde localStorage
function cargarNuevasOrdenes() {
    const nuevasOrdenes = JSON.parse(localStorage.getItem('nuevasOrdenesCreadas') || '[]');
    
    nuevasOrdenes.forEach(orden => {
        // Verificar que no existe ya
        if (!ordenesDeTrabajoGlobal.find(o => o.id === orden.id)) {
            ordenesDeTrabajoGlobal.push(orden);
        }
    });
    
    // Limpiar localStorage después de cargar
    localStorage.removeItem('nuevasOrdenesCreadas');
    
    renderizarOrdenes();
}

// Función para cambiar de vista
function cambiarVista(vista) {
    modoVista = vista;
    
    // Actualizar botones
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#f3f4f6';
        btn.style.color = '#374151';
    });
    
    const btnActivo = document.getElementById(`btn-${vista}`);
    btnActivo.classList.add('active');
    btnActivo.style.background = 'var(--planasa-green)';
    btnActivo.style.color = 'white';
    
    // Mostrar/ocultar vistas
    document.querySelector('.kanban-board').style.display = vista === 'kanban' ? 'flex' : 'none';
    document.getElementById('vista-tabla').style.display = vista === 'tabla' ? 'block' : 'none';
    document.getElementById('vista-calendario').style.display = vista === 'calendario' ? 'block' : 'none';
    
    // Renderizar según vista
    if (vista === 'kanban') {
        renderizarOrdenes();
    } else if (vista === 'tabla') {
        renderizarTabla();
    } else if (vista === 'calendario') {
        renderizarCalendario();
    }
}

// Renderizar todas las órdenes en sus columnas correspondientes
function renderizarOrdenes() {
    const columnas = {
        'por-hacer': document.getElementById('column-por-hacer'),
        'en-progreso': document.getElementById('column-en-progreso'),
        'parado': document.getElementById('column-parado'),
        'hecho': document.getElementById('column-hecho')
    };

    // Limpiar todas las columnas
    Object.keys(columnas).forEach(estado => {
        columnas[estado].innerHTML = '';
    });

    // Renderizar órdenes por estado
    ordenesDeTrabajoGlobal.forEach(orden => {
        const tarjeta = crearTarjetaOrden(orden);
        const columna = columnas[orden.estado];
        
        if (columna) {
            columna.appendChild(tarjeta);
        }
    });

    // Añadir placeholders si las columnas están vacías
    Object.keys(columnas).forEach(estado => {
        if (columnas[estado].children.length === 0) {
            columnas[estado].appendChild(crearPlaceholder(estado));
        }
    });

    // Configurar drag and drop después de renderizar
    configurarDragAndDrop();
    
    // Agregar event listeners de dragend a todas las tarjetas
    document.querySelectorAll('.orden-card').forEach(tarjeta => {
        tarjeta.addEventListener('dragend', handleDragEnd);
    });

    actualizarContadores();
}

// Crear tarjeta de orden
function crearTarjetaOrden(orden) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'orden-card';
    tarjeta.setAttribute('data-orden-id', orden.id);
    tarjeta.draggable = true; // Hacer la tarjeta arrastrable
    
    // Usar addEventListener en lugar de onclick para mejor control
    tarjeta.addEventListener('click', (e) => {
        // Solo mostrar detalles si no se está arrastrando
        if (!tarjeta.classList.contains('dragging')) {
            mostrarDetalleOrden(orden);
        }
    });

    const prioridadClass = {
        'Crítica': 'prioridad-critica',
        'Alta': 'prioridad-alta',
        'Media': 'prioridad-media',
        'Baja': 'prioridad-baja'
    }[orden.prioridad] || 'prioridad-baja';

    const tipoTexto = orden.tipoMantenimiento === 'preventivo' ? 
        'Preventivo' : 
        `Correctivo - ${orden.tipoAveria || 'General'}`;

    const duracionTexto = orden.duracionHoras ? `${orden.duracionHoras}h` : (orden.fechaInicio && orden.fechaFin ? `${Math.max(0.5, ((new Date(orden.fechaFin)) - (new Date(orden.fechaInicio))) / (1000*60*60)).toFixed(1)}h` : '');
    tarjeta.innerHTML = `
        <div class="orden-header">
            <div class="orden-numero">${orden.id}</div>
            <div class="orden-prioridad ${prioridadClass}">
                ${getPrioridadIcon(orden.prioridad)} ${orden.prioridad}
            </div>
        </div>
        <div class="orden-activo">${orden.activo}</div>
        <div class="orden-tipo">${tipoTexto}</div>
        ${orden.descripcionAveria ? `<div class="orden-descripcion" style="font-size: 0.8rem; color: #666; margin-bottom: 8px; font-style: italic;">"${orden.descripcionAveria}"</div>` : ''}
        <div class="orden-fecha">
            <i class="fas fa-calendar"></i>
            ${formatearFecha(orden.fechaInicio)}${duracionTexto ? ' · ' + duracionTexto : ''}
        </div>
        <div class="orden-responsable">
            <i class="fas fa-user"></i>
            ${orden.responsable}
        </div>
        ${orden.tareas && orden.tareas.length > 0 ? `
            <div class="orden-tags">
                <div class="orden-tag">${orden.tareas.length} tareas</div>
            </div>
        ` : ''}
    `;

    // Agregar event listeners para drag and drop
    tarjeta.addEventListener('dragstart', handleDragStart);

    return tarjeta;
}

// Crear placeholder para columnas vacías
function crearPlaceholder(estado) {
    const placeholder = document.createElement('div');
    placeholder.className = 'orden-placeholder';
    
    const iconos = {
        'por-hacer': 'fas fa-clipboard-list',
        'en-progreso': 'fas fa-wrench',
        'parado': 'fas fa-hand-paper',
        'hecho': 'fas fa-check-circle'
    };
    
    const mensajes = {
        'por-hacer': 'No hay órdenes pendientes',
        'en-progreso': 'No hay órdenes en progreso',
        'parado': 'No hay órdenes paradas',
        'hecho': 'No hay órdenes completadas'
    };
    
    placeholder.innerHTML = `
        <i class="${iconos[estado]}"></i>
        <p>${mensajes[estado]}</p>
    `;
    
    return placeholder;
}

// Obtener icono de prioridad
function getPrioridadIcon(prioridad) {
    const iconos = {
        'Crítica': '🔴',
        'Alta': '🟠',
        'Media': '🟡',
        'Baja': '🟢'
    };
    return iconos[prioridad] || '🟢';
}

// Formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit' 
    });
}

// Mostrar detalle de orden
function mostrarDetalleOrden(orden) {
    ordenSeleccionada = orden;
    const modal = document.getElementById('modal-detalle');
    const titulo = document.getElementById('modal-titulo');
    const contenido = document.getElementById('modal-contenido');
    
    titulo.textContent = `Orden ${orden.id}`;

    // Obtener datos del activo
    const activoTexto = orden.activo || '';
    const categoriaActivo = orden.activoDetalle?.CatActivo || orden.categoriaActivo || '';
    const tipoActivo = orden.activoDetalle?.NomActivo || orden.tipoActivo || '';
    const ubicacionActivo = orden.activoDetalle?.ubicacion || orden.ubicacion?.nombre || orden.ubicacion || '';
    
    const duracionMostrar = orden.duracionHoras ? orden.duracionHoras : (orden.fechaInicio && orden.fechaFin ? Math.max(0.5, (new Date(orden.fechaFin) - new Date(orden.fechaInicio))/(1000*60*60)).toFixed(1) : '');
    
    contenido.innerHTML = `
        <!-- ============ SECCIÓN: ORDEN DE TRABAJO ============ -->
        <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 3px solid var(--planasa-green); border-radius: 16px; padding: 24px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 20px 0; color: var(--planasa-green-dark); font-size: 1.3rem; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-clipboard-check"></i>
                Orden de Trabajo ${orden.id}
            </h3>

            <!-- Estado y Programación -->
            <div class="modal-section" style="margin-bottom: 20px;">
                <div class="modal-section-title" style="margin-bottom: 12px;">
                    <i class="fas fa-calendar-check"></i>
                    Estado y Programación
                </div>
                <div class="modal-section-grid">
                    <div class="modal-info-item">
                        <div class="modal-info-label">Estado</div>
                        <select class="modal-select" id="edit-estado">
                            <option value="por-hacer" ${orden.estado === 'por-hacer' ? 'selected' : ''}>⏰ Por Hacer</option>
                            <option value="en-progreso" ${orden.estado === 'en-progreso' ? 'selected' : ''}>▶️ En Progreso</option>
                            <option value="parado" ${orden.estado === 'parado' ? 'selected' : ''}>⏸️ Parado</option>
                            <option value="hecho" ${orden.estado === 'hecho' ? 'selected' : ''}>✅ Hecho</option>
                        </select>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Prioridad</div>
                        <select class="modal-select" id="edit-prioridad">
                            <option value="Crítica" ${orden.prioridad === 'Crítica' ? 'selected' : ''}>🔴 Crítica</option>
                            <option value="Alta" ${orden.prioridad === 'Alta' ? 'selected' : ''}>🟠 Alta</option>
                            <option value="Media" ${orden.prioridad === 'Media' ? 'selected' : ''}>🟡 Media</option>
                            <option value="Baja" ${orden.prioridad === 'Baja' ? 'selected' : ''}>🟢 Baja</option>
                        </select>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Fecha de inicio</div>
                        <input type="date" class="modal-input" id="edit-fechaInicio" value="${orden.fechaInicio ? new Date(orden.fechaInicio).toISOString().split('T')[0] : ''}">
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Duración (horas)</div>
                        <input type="number" step="0.5" min="0.5" class="modal-input" id="edit-duracionHoras" value="${duracionMostrar || ''}" placeholder="Ej: 4">
                    </div>
                </div>
            </div>

            <!-- Responsable y Equipo -->
            <div class="modal-section" style="margin-bottom: 20px;">
                <div class="modal-section-title" style="margin-bottom: 12px;">
                    <i class="fas fa-users"></i>
                    Responsables
                </div>
                <div class="modal-section-grid">
                    <div class="modal-info-item">
                        <div class="modal-info-label">Técnico responsable</div>
                        <select class="modal-select" id="edit-responsable">
                            <option value="Carlos Méndez" ${orden.responsable === 'Carlos Méndez' ? 'selected' : ''}>👨‍🔧 Carlos Méndez</option>
                            <option value="Ana García" ${orden.responsable === 'Ana García' ? 'selected' : ''}>👩‍🔧 Ana García</option>
                            <option value="Luis Fernández" ${orden.responsable === 'Luis Fernández' ? 'selected' : ''}>👨‍🔧 Luis Fernández</option>
                            <option value="María Ruiz" ${orden.responsable === 'María Ruiz' ? 'selected' : ''}>👩‍🔧 María Ruiz</option>
                            <option value="Diego López" ${orden.responsable === 'Diego López' ? 'selected' : ''}>👨‍🔧 Diego López</option>
                        </select>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Equipo de apoyo</div>
                        <select class="modal-select" id="edit-equipoApoyo" multiple size="3">
                            <option value="Carlos Méndez">👨‍🔧 Carlos Méndez</option>
                            <option value="Ana García">👩‍🔧 Ana García</option>
                            <option value="Luis Fernández">👨‍🔧 Luis Fernández</option>
                            <option value="María Ruiz">👩‍🔧 María Ruiz</option>
                            <option value="Diego López">👨‍🔧 Diego López</option>
                        </select>
                        <small style="color: var(--planasa-gray-600); font-size: 0.75rem; margin-top: 4px; display: block;">Mantén Ctrl para seleccionar varios</small>
                    </div>
                </div>
            </div>

            <!-- Tareas Editables -->
            <div class="modal-section" style="margin-bottom: 20px;">
                <div class="modal-section-title" style="margin-bottom: 12px;">
                    <i class="fas fa-tasks"></i>
                    Tareas a realizar
                </div>
                <div id="lista-tareas-editables" class="lista-tareas-editables">
                    ${orden.tareas && orden.tareas.length > 0 ? orden.tareas.map((tarea, index) => {
                        const tareaTexto = typeof tarea === 'string' ? tarea : (tarea.descripcion || '');
                        return `
                        <div class="tarea-item-editable" data-index="${index}">
                            <input type="checkbox" id="tarea-check-${index}" class="tarea-checkbox" ${tarea.completada ? 'checked' : ''}>
                            <input type="text" class="tarea-input" id="tarea-${index}" value="${tareaTexto}" placeholder="Descripción de la tarea">
                            <button type="button" class="btn-eliminar-tarea" onclick="eliminarTarea(${index})" title="Eliminar tarea">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `}).join('') : '<p style="color: var(--planasa-gray-600); font-size: 0.9rem; margin: 0;">No hay tareas definidas.</p>'}
                </div>
                <button type="button" class="btn-agregar-tarea" onclick="agregarNuevaTarea()" style="margin-top: 12px;">
                    <i class="fas fa-plus-circle"></i> Agregar tarea
                </button>
            </div>

            <!-- Descripción Editable -->
            <div class="modal-section">
                <div class="modal-section-title" style="margin-bottom: 12px;">
                    <i class="fas fa-file-alt"></i>
                    Descripción del trabajo
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Descripción general</div>
                    <textarea class="modal-textarea" id="edit-descripcion-general" rows="4" placeholder="Describe el trabajo a realizar...">${orden.descripcionTareas || orden.descripcion || ''}</textarea>
                </div>
                <div class="modal-info-item" style="margin-top: 12px;">
                    <div class="modal-info-label">Observaciones adicionales</div>
                    <textarea class="modal-textarea" id="edit-observaciones" rows="3" placeholder="Notas, recomendaciones...">${orden.observaciones || ''}</textarea>
                </div>
            </div>
        </div>

        <!-- ============ SECCIÓN: DATOS DE LA INCIDENCIA ORIGINAL ============ -->
        <div style="background: linear-gradient(135deg, #fff5f5 0%, #fef2f2 100%); border: 3px solid #fca5a5; border-radius: 16px; padding: 24px;">
            <h3 style="margin: 0 0 20px 0; color: #dc2626; font-size: 1.3rem; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-circle"></i>
                Datos de la Incidencia Original
            </h3>

            <!-- Información de la Incidencia -->
            <div class="modal-section" style="margin-bottom: 20px;">
                <div class="modal-section-title" style="margin-bottom: 12px;">
                    <i class="fas fa-info-circle"></i>
                    Información de la Incidencia
                </div>
                <div class="modal-section-grid">
                    <div class="modal-info-item">
                        <div class="modal-info-label">Fecha creación</div>
                        <div class="modal-input-readonly">${orden.fechaCreacion ? formatearFechaCompleta(new Date(orden.fechaCreacion)) : 'No especificada'}</div>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Solicitante</div>
                        <div class="modal-input-readonly">${orden.solicitante || 'Sistema'}</div>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Tipo de Mantto.</div>
                        <div class="tipo-mantenimiento-badge ${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'preventivo' : 'correctivo'}">
                            ${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'PREVENTIVO' : 'CORRECTIVO'}
                            <i class="fas ${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'fa-calendar-check' : 'fa-wrench'}"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activo Afectado -->
            <div class="modal-section" style="margin-bottom: 20px;">
                <div class="modal-section-title" style="margin-bottom: 12px;">
                    <i class="fas fa-cogs"></i>
                    Activo Afectado
                </div>
                <div class="modal-section-grid">
                    <div class="modal-info-item">
                        <div class="modal-info-label">Activo</div>
                        <div class="modal-input-readonly">${activoTexto}</div>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Categoría</div>
                        <div class="modal-input-readonly">${categoriaActivo}</div>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Tipo</div>
                        <div class="modal-input-readonly">${tipoActivo}</div>
                    </div>
                    <div class="modal-info-item">
                        <div class="modal-info-label">Ubicación</div>
                        <div class="modal-input-readonly">${ubicacionActivo}</div>
                    </div>
                </div>
            </div>

            <!-- Descripción de la Avería -->
            <div class="modal-section">
                <div class="modal-section-title" style="margin-bottom: 12px;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Detalles de la Avería/Problema
                </div>
                ${orden.tipoAveria ? `
                <div class="modal-info-item" style="margin-bottom: 12px;">
                    <div class="modal-info-label">Tipo de avería</div>
                    <div class="modal-input-readonly" style="background: white; padding: 12px; border-radius: 8px; font-weight: 600; color: #dc2626;">
                        ${orden.tipoAveria}
                    </div>
                </div>
                ` : ''}
                <div class="modal-info-item" style="margin-bottom: 12px;">
                    <div class="modal-info-label">Descripción detallada</div>
                    <div class="modal-input-readonly" style="background: white; padding: 16px; border-radius: 8px; min-height: 80px; line-height: 1.6; white-space: pre-wrap;">
                        ${orden.descripcionAveria || orden.descripcion || 'No especificada'}
                    </div>
                </div>
                ${(orden.acciones && typeof orden.acciones === 'string' && orden.acciones.trim() !== '' && orden.acciones !== 'Ninguna acción registrada aún') ? `
                <div class="modal-info-item" style="margin-bottom: 12px;">
                    <div class="modal-info-label">Acciones ya tomadas</div>
                    <div class="modal-input-readonly" style="background: #f0fdf4; padding: 14px; border-radius: 8px; line-height: 1.6; border-left: 4px solid var(--planasa-green); white-space: pre-wrap;">
                        ${orden.acciones}
                    </div>
                </div>
                ` : ''}
                ${orden.fotografias && orden.fotografias.length > 0 ? `
                <div class="modal-info-item" style="margin-top: 12px;">
                    <div class="modal-info-label">Fotografías adjuntas (${orden.fotografias.length})</div>
                    <div class="fotos-grid">
                        ${orden.fotografias.map((foto, idx) => `
                            <div class="foto-thumbnail-wrapper">
                                ${foto.dataUrl ? `
                                    <img src="${foto.dataUrl}" alt="Foto ${idx + 1}" onclick="verImagenCompleta('${foto.dataUrl}')">
                                ` : `
                                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--planasa-gray-500);">
                                        <i class="fas fa-image" style="font-size: 2rem;"></i>
                                    </div>
                                `}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Historial de Mantenimientos -->
            ${orden.historicoMantenimientos && orden.historicoMantenimientos.length > 0 ? `
            <div class="modal-section" style="margin-top: 20px;">
                <div class="modal-section-title" style="margin-bottom: 12px;">
                    <i class="fas fa-history"></i>
                    Historial de Mantenimientos Anteriores
                </div>
                <div style="background: white; border-radius: 8px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Fecha</th>
                                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Tipo</th>
                                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Descripción</th>
                                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Responsable</th>
                                <th style="padding: 12px; text-align: center; font-weight: 600; color: #374151;">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orden.historicoMantenimientos.map((hist, idx) => `
                                <tr style="border-bottom: 1px solid #e5e7eb; ${idx % 2 === 0 ? 'background: #fafafa;' : ''}">
                                    <td style="padding: 12px; color: #6b7280;">${new Date(hist.fecha).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'})}</td>
                                    <td style="padding: 12px;">
                                        <span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; ${hist.tipo === 'Preventivo' ? 'background: #dbeafe; color: #1e40af;' : 'background: #fee2e2; color: #991b1b;'}">
                                            ${hist.tipo}
                                        </span>
                                    </td>
                                    <td style="padding: 12px; color: #374151;">${hist.descripcion}</td>
                                    <td style="padding: 12px; color: #6b7280;">
                                        <i class="fas fa-user-circle" style="margin-right: 6px;"></i>${hist.responsable}
                                    </td>
                                    <td style="padding: 12px; text-align: center;">
                                        <span style="color: #059669; font-weight: 600;">
                                            <i class="fas fa-check-circle"></i> ${hist.estado}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    // Inicializar el select múltiple con las opciones actuales
    setTimeout(() => {
        const selectEquipo = document.getElementById('edit-equipoApoyo');
        if (selectEquipo && orden.equipoApoyo) {
            Array.from(selectEquipo.options).forEach(option => {
                if (orden.equipoApoyo.includes(option.value)) {
                    option.selected = true;
                }
            });
        }
    }, 100);

    // Abrir modal
    modal.classList.add('show');
}

// Agregar nueva tarea
function agregarNuevaTarea() {
    const lista = document.getElementById('lista-tareas-editables');
    const tareasActuales = lista.querySelectorAll('.tarea-item-editable');
    const nuevoIndex = tareasActuales.length;
    
    const nuevaTarea = document.createElement('div');
    nuevaTarea.className = 'tarea-item-editable';
    nuevaTarea.setAttribute('data-index', nuevoIndex);
    nuevaTarea.innerHTML = `
        <input type="checkbox" id="tarea-check-${nuevoIndex}" class="tarea-checkbox">
        <input type="text" class="tarea-input" id="tarea-${nuevoIndex}" value="" placeholder="Nueva tarea...">
        <button type="button" class="btn-eliminar-tarea" onclick="eliminarTarea(${nuevoIndex})" title="Eliminar tarea">
            <i class="fas fa-trash"></i>
        </button>
    `;
    lista.appendChild(nuevaTarea);
    
    // Enfocar el nuevo input
    document.getElementById(`tarea-${nuevoIndex}`).focus();
}

// Eliminar tarea
function eliminarTarea(index) {
    const tarea = document.querySelector(`[data-index="${index}"]`);
    if (tarea) {
        tarea.remove();
        // Reindexar las tareas restantes
        document.querySelectorAll('.tarea-item-editable').forEach((item, idx) => {
            item.setAttribute('data-index', idx);
            const checkbox = item.querySelector('.tarea-checkbox');
            const input = item.querySelector('.tarea-input');
            const btnEliminar = item.querySelector('.btn-eliminar-tarea');
            if (checkbox) checkbox.id = `tarea-check-${idx}`;
            if (input) input.id = `tarea-${idx}`;
            if (btnEliminar) btnEliminar.setAttribute('onclick', `eliminarTarea(${idx})`);
        });
    }
}

// Función para formatear fecha completa
function formatearFechaCompleta(fecha) {
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Función para ver imagen completa
function verImagenCompleta(dataUrl) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    `;
    
    modal.appendChild(img);
    modal.onclick = () => modal.remove();
    document.body.appendChild(modal);
}

function getEstadoIcon(estado) {
    const iconos = {
        'por-hacer': 'fa-clock',
        'en-progreso': 'fa-spinner',
        'parado': 'fa-pause',
        'hecho': 'fa-check-circle'
    };
    return iconos[estado] || 'fa-question';
}

// Obtener clase de prioridad
function getPrioridadClass(prioridad) {
    const clases = {
        'Crítica': 'prioridad-critica',
        'Alta': 'prioridad-alta',
        'Media': 'prioridad-media',
        'Baja': 'prioridad-baja'
    };
    return clases[prioridad] || 'prioridad-baja';
}

// Obtener siguiente estado
function getSiguienteEstado(estadoActual) {
    const flujo = {
        'por-hacer': 'en-progreso',
        'en-progreso': 'hecho',
        'parado': 'en-progreso',
        'hecho': null
    };
    return flujo[estadoActual];
}

// Obtener texto de estado
function getEstadoTexto(estado) {
    const textos = {
        'por-hacer': 'Por Hacer',
        'en-progreso': 'En Progreso',
        'parado': 'Parado',
        'hecho': 'Hecho'
    };
    return textos[estado] || estado;
}

// Cambiar estado de orden
function cambiarEstadoOrden() {
    if (!ordenSeleccionada) return;
    
    const nuevoEstado = getSiguienteEstado(ordenSeleccionada.estado);
    if (!nuevoEstado) return;
    
    // Actualizar estado
    ordenSeleccionada.estado = nuevoEstado;
    
    // Re-renderizar
    renderizarOrdenes();
    
    // Cerrar modal
    cerrarModalDetalle();
    
    // Mostrar notificación
    mostrarNotificacion(`Orden ${ordenSeleccionada.id} movida a ${getEstadoTexto(nuevoEstado)}`);
}

// Cerrar modal de detalle
function cerrarModal() {
    const modal = document.getElementById('modal-detalle');
    modal.classList.remove('show');
    ordenSeleccionada = null;
}

function guardarCambios() {
    if (ordenSeleccionada) {
        // 1. Guardar estado y programación
        const nuevoEstado = document.getElementById('edit-estado')?.value;
        const nuevaPrioridad = document.getElementById('edit-prioridad')?.value;
        const nuevaFechaInicio = document.getElementById('edit-fechaInicio')?.value;
        const nuevaDuracion = parseFloat(document.getElementById('edit-duracionHoras')?.value || '');

        if (nuevoEstado) ordenSeleccionada.estado = nuevoEstado;
        if (nuevaPrioridad) ordenSeleccionada.prioridad = nuevaPrioridad;
        if (nuevaFechaInicio) ordenSeleccionada.fechaInicio = nuevaFechaInicio;
        
        if (!isNaN(nuevaDuracion) && nuevaDuracion > 0) {
            ordenSeleccionada.duracionHoras = parseFloat(nuevaDuracion.toFixed(1));
            // Recalcular fecha fin
            const ini = new Date(ordenSeleccionada.fechaInicio);
            const finEst = new Date(ini.getTime() + ordenSeleccionada.duracionHoras * 60 * 60 * 1000);
            ordenSeleccionada.fechaFin = finEst.toISOString().split('T')[0];
            ordenSeleccionada.fechaFinEstimada = finEst.toISOString();
        }

        // 2. Guardar responsables
        const nuevoResponsable = document.getElementById('edit-responsable')?.value;
        if (nuevoResponsable) ordenSeleccionada.responsable = nuevoResponsable;

        const selectEquipo = document.getElementById('edit-equipoApoyo');
        if (selectEquipo) {
            const equipoSeleccionado = Array.from(selectEquipo.selectedOptions).map(opt => opt.value);
            ordenSeleccionada.equipoApoyo = equipoSeleccionado;
        }

        // 3. Guardar tareas editables
        const tareasItems = document.querySelectorAll('.tarea-item-editable');
        const tareasEditadas = [];
        tareasItems.forEach(item => {
            const input = item.querySelector('.tarea-input');
            const checkbox = item.querySelector('.tarea-checkbox');
            if (input && input.value.trim()) {
                tareasEditadas.push({
                    descripcion: input.value.trim(),
                    completada: checkbox ? checkbox.checked : false
                });
            }
        });
        ordenSeleccionada.tareas = tareasEditadas;

        // 4. Guardar descripción y observaciones
        const descripcionGeneral = document.getElementById('edit-descripcion-general')?.value;
        if (descripcionGeneral !== undefined) {
            ordenSeleccionada.descripcionTareas = descripcionGeneral;
            ordenSeleccionada.descripcion = descripcionGeneral;
        }

        const observaciones = document.getElementById('edit-observaciones')?.value;
        if (observaciones !== undefined) {
            ordenSeleccionada.observaciones = observaciones;
        }

        // Guardar en localStorage y re-renderizar
        localStorage.setItem('ordenesDeTrabajoGlobal', JSON.stringify(ordenesDeTrabajoGlobal));
        renderizarOrdenes();
        
        alert('✅ Cambios guardados correctamente');
        cerrarModal();
    }
}

// Actualizar contadores
function actualizarContadores() {
    const contadores = {
        'por-hacer': 0,
        'en-progreso': 0,
        'parado': 0,
        'hecho': 0
    };

    ordenesDeTrabajoGlobal.forEach(orden => {
        if (contadores.hasOwnProperty(orden.estado)) {
            contadores[orden.estado]++;
        }
    });

    Object.keys(contadores).forEach(estado => {
        const contador = document.getElementById(`counter-${estado}`);
        if (contador) {
            contador.textContent = contadores[estado];
        }
    });
}

// Filtrar órdenes
function filtrarOrdenes() {
    // Re-renderizar según la vista actual
    if (modoVista === 'kanban') {
        const ordenesFiltradas = obtenerOrdenesFiltradas();
        renderizarOrdenesFiltradas(ordenesFiltradas);
    } else if (modoVista === 'tabla') {
        renderizarTabla();
    } else if (modoVista === 'calendario') {
        renderizarCalendario();
    }
}

// Renderizar órdenes filtradas
function renderizarOrdenesFiltradas(ordenes) {
    const columnas = {
        'por-hacer': document.getElementById('column-por-hacer'),
        'en-progreso': document.getElementById('column-en-progreso'),
        'parado': document.getElementById('column-parado'),
        'hecho': document.getElementById('column-hecho')
    };

    // Limpiar todas las columnas
    Object.keys(columnas).forEach(estado => {
        columnas[estado].innerHTML = '';
    });

    // Renderizar órdenes filtradas
    ordenes.forEach(orden => {
        const tarjeta = crearTarjetaOrden(orden);
        const columna = columnas[orden.estado];
        
        if (columna) {
            columna.appendChild(tarjeta);
        }
    });

    // Añadir placeholders si las columnas están vacías
    Object.keys(columnas).forEach(estado => {
        if (columnas[estado].children.length === 0) {
            columnas[estado].appendChild(crearPlaceholder(estado));
        }
    });

    // Actualizar contadores con datos filtrados
    const contadores = {
        'por-hacer': 0,
        'en-progreso': 0,
        'parado': 0,
        'hecho': 0
    };

    ordenes.forEach(orden => {
        if (contadores.hasOwnProperty(orden.estado)) {
            contadores[orden.estado]++;
        }
    });

    Object.keys(contadores).forEach(estado => {
        const contador = document.getElementById(`counter-${estado}`);
        if (contador) {
            contador.textContent = contadores[estado];
        }
    });
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear notificación temporal
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgb(63, 156, 53);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    notif.textContent = mensaje;
    
    document.body.appendChild(notif);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// Función para añadir nueva orden (llamada desde crear-orden-trabajo.js)
function añadirNuevaOrden(ordenData) {
    // Generar ID único
    const nuevaOrden = {
        ...ordenData,
        id: `OT-${new Date().getFullYear()}-${String(ordenesDeTrabajoGlobal.length + 1).padStart(3, '0')}`,
        estado: 'por-hacer',
        fechaCreacion: new Date()
    };
    
    ordenesDeTrabajoGlobal.push(nuevaOrden);
    renderizarOrdenes();
    
    // Destacar la nueva orden
    setTimeout(() => {
        const tarjeta = document.querySelector(`[data-orden-id="${nuevaOrden.id}"]`);
        if (tarjeta) {
            tarjeta.classList.add('nueva-orden');
            setTimeout(() => tarjeta.classList.remove('nueva-orden'), 500);
        }
    }, 100);
    
    mostrarNotificacion(`Nueva orden ${nuevaOrden.id} creada exitosamente`);
    return nuevaOrden.id;
}

// Variables para drag and drop
let draggedElement = null;

// Función para manejar el inicio del arrastre
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    
    // Almacenar el ID de la orden para transferir datos
    e.dataTransfer.setData('text/plain', this.getAttribute('data-orden-id'));
    e.dataTransfer.effectAllowed = 'move';
    
    // Agregar efecto visual a todas las columnas
    const columnas = document.querySelectorAll('.kanban-column');
    columnas.forEach(col => col.classList.add('drag-highlight'));
}

// Función para manejar cuando se termina el arrastre
function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    // Remover efectos visuales de todas las columnas
    const columnas = document.querySelectorAll('.kanban-column');
    columnas.forEach(col => {
        col.classList.remove('drag-highlight', 'drag-over');
    });
    
    draggedElement = null;
}

// Configurar event listeners para las columnas
function configurarDragAndDrop() {
    const columnas = document.querySelectorAll('.column-content');
    
    columnas.forEach(columna => {
        columna.addEventListener('dragover', handleDragOver);
        columna.addEventListener('drop', handleDrop);
        columna.addEventListener('dragenter', handleDragEnter);
        columna.addEventListener('dragleave', handleDragLeave);
    });
}

// Función para manejar dragover
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

// Función para manejar dragenter
function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

// Función para manejar dragleave
function handleDragLeave(e) {
    // Solo remover si realmente salimos de la columna y no es un elemento hijo
    const rect = this.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        this.classList.remove('drag-over');
    }
}

// Función para manejar el drop
function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    if (!draggedElement) return;
    
    try {
        const ordenId = e.dataTransfer.getData('text/plain');
        const columnaDestino = this.parentElement;
        const nuevoEstado = columnaDestino ? columnaDestino.getAttribute('data-estado') : null;
        
        if (!ordenId || !nuevoEstado) {
            console.error('Error: No se pudo obtener el ID de la orden o el estado de destino');
            return;
        }
        
        // Encontrar la orden en el array global
        const orden = ordenesDeTrabajoGlobal.find(o => o.id === ordenId);
        
        if (orden && orden.estado !== nuevoEstado) {
            // Actualizar el estado de la orden
            orden.estado = nuevoEstado;
            
            // Re-renderizar las órdenes
            renderizarOrdenes();
            
            // Mostrar notificación del cambio
            const estadoTexto = {
                'por-hacer': 'Por Hacer',
                'en-progreso': 'En Progreso',
                'parado': 'Parado',
                'hecho': 'Completado'
            }[nuevoEstado];
            
            mostrarNotificacion(`Orden ${ordenId} movida a ${estadoTexto}`);
            
            // Guardar cambios en localStorage si es necesario
            localStorage.setItem('ordenesDeTrabajoGlobal', JSON.stringify(ordenesDeTrabajoGlobal));
        }
    } catch (error) {
        console.error('Error en handleDrop:', error);
    }
}

// Exponer función globalmente para que la pueda usar crear-orden-trabajo.js
window.añadirNuevaOrden = añadirNuevaOrden;

// ============ RENDERIZADO VISTA TABLA ============
function renderizarTabla() {
    const tbody = document.getElementById('tabla-body');
    tbody.innerHTML = '';
    
    const ordenesFiltradas = obtenerOrdenesFiltradas();
    
    ordenesFiltradas.forEach(orden => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #e5e7eb';
        tr.style.cursor = 'pointer';
        tr.style.transition = 'background 0.2s';
        tr.onmouseover = () => tr.style.background = '#f9fafb';
        tr.onmouseout = () => tr.style.background = 'white';
        tr.onclick = () => mostrarDetalleOrden(orden.id);
        
        const prioridadColor = {
            'Crítica': '#ef4444',
            'Alta': '#f97316',
            'Media': '#eab308',
            'Baja': '#22c55e'
        };
        
        const estadoBadge = {
            'por-hacer': { text: 'Por Hacer', color: '#3b82f6', bg: '#dbeafe' },
            'en-progreso': { text: 'En Progreso', color: '#f59e0b', bg: '#fef3c7' },
            'parado': { text: 'Parado', color: '#ef4444', bg: '#fee2e2' },
            'hecho': { text: 'Completado', color: '#10b981', bg: '#d1fae5' }
        };
        
        tr.innerHTML = `
            <td style="padding: 15px; font-weight: 600; color: var(--planasa-green-dark);">${orden.id}</td>
            <td style="padding: 15px;">${orden.activo}</td>
            <td style="padding: 15px;">
                <span style="padding: 4px 12px; background: #f3f4f6; border-radius: 12px; font-size: 0.85rem;">
                    ${orden.tipoMantenimiento === 'preventivo' ? '🔧 Preventivo' : '⚠️ Correctivo'}
                </span>
            </td>
            <td style="padding: 15px;">${orden.responsable}</td>
            <td style="padding: 15px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${prioridadColor[orden.prioridad]}; margin-right: 6px;"></span>
                ${orden.prioridad}
            </td>
            <td style="padding: 15px;">
                <span style="padding: 6px 12px; background: ${estadoBadge[orden.estado].bg}; color: ${estadoBadge[orden.estado].color}; border-radius: 12px; font-size: 0.85rem; font-weight: 500;">
                    ${estadoBadge[orden.estado].text}
                </span>
            </td>
            <td style="padding: 15px;">${orden.fechaInicio}</td>
            <td style="padding: 15px; text-align: center;">
                <button onclick="event.stopPropagation(); mostrarDetalleOrden('${orden.id}')" style="padding: 6px 12px; background: var(--planasa-green); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                    <i class="fas fa-eye"></i> Ver
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    if (ordenesFiltradas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="padding: 40px; text-align: center; color: #9ca3af;">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 10px; display: block;"></i>
                    No hay órdenes que mostrar
                </td>
            </tr>
        `;
    }
}

// ============ RENDERIZADO VISTA CALENDARIO ============
let mesActualCalendario = new Date().getMonth();
let añoActualCalendario = new Date().getFullYear();

function renderizarCalendario() {
    const grid = document.getElementById('calendario-grid');
    const titulo = document.getElementById('calendario-titulo');
    
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    titulo.textContent = `${nombresMeses[mesActualCalendario]} ${añoActualCalendario}`;
    
    // Limpiar grid
    grid.innerHTML = '';
    
    // Días de la semana
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    diasSemana.forEach(dia => {
        const header = document.createElement('div');
        header.style.padding = '10px';
        header.style.textAlign = 'center';
        header.style.fontWeight = '600';
        header.style.color = 'var(--planasa-green-dark)';
        header.textContent = dia;
        grid.appendChild(header);
    });
    
    // Calcular primer día del mes
    const primerDia = new Date(añoActualCalendario, mesActualCalendario, 1);
    const ultimoDia = new Date(añoActualCalendario, mesActualCalendario + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    
    // Ajustar para que lunes sea el primer día (0 = domingo -> 6, 1 = lunes -> 0)
    let diaSemanaInicio = primerDia.getDay();
    diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;
    
    // Añadir celdas vacías antes del primer día
    for (let i = 0; i < diaSemanaInicio; i++) {
        const celda = document.createElement('div');
        celda.style.padding = '10px';
        celda.style.minHeight = '100px';
        celda.style.background = '#f9fafb';
        celda.style.borderRadius = '8px';
        grid.appendChild(celda);
    }
    
    // Añadir días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const celda = document.createElement('div');
        celda.style.padding = '10px';
        celda.style.minHeight = '100px';
        celda.style.background = 'white';
        celda.style.border = '1px solid #e5e7eb';
        celda.style.borderRadius = '8px';
        celda.style.cursor = 'pointer';
        celda.style.transition = 'all 0.2s';
        
        const fechaCelda = `${añoActualCalendario}-${String(mesActualCalendario + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        
        // Verificar si es hoy
        const hoy = new Date();
        const esHoy = dia === hoy.getDate() && 
                      mesActualCalendario === hoy.getMonth() && 
                      añoActualCalendario === hoy.getFullYear();
        
        if (esHoy) {
            celda.style.background = '#f0fdf4';
            celda.style.border = '2px solid var(--planasa-green)';
        }
        
        // Número del día
        const numeroDia = document.createElement('div');
        numeroDia.style.fontWeight = '600';
        numeroDia.style.marginBottom = '8px';
        numeroDia.style.color = esHoy ? 'var(--planasa-green)' : '#374151';
        numeroDia.textContent = dia;
        celda.appendChild(numeroDia);
        
        // Buscar órdenes para este día (incluye todos los días entre fechaInicio y fechaFin)
        const ordenesDelDia = ordenesDeTrabajoGlobal.filter(orden => {
            const fechaInicio = new Date(orden.fechaInicio);
            const fechaFin = new Date(orden.fechaFin);
            const fechaActual = new Date(fechaCelda);
            
            return fechaActual >= fechaInicio && fechaActual <= fechaFin;
        });
        
        // Mostrar mini badges de órdenes
        ordenesDelDia.forEach(orden => {
            const badge = document.createElement('div');
            badge.style.padding = '4px 6px';
            badge.style.marginBottom = '4px';
            badge.style.fontSize = '0.7rem';
            badge.style.borderRadius = '4px';
            badge.style.overflow = 'hidden';
            badge.style.textOverflow = 'ellipsis';
            badge.style.whiteSpace = 'nowrap';
            badge.style.cursor = 'pointer';
            
            const estadoColor = {
                'por-hacer': { bg: '#dbeafe', color: '#1e40af' },
                'en-progreso': { bg: '#fef3c7', color: '#92400e' },
                'parado': { bg: '#fee2e2', color: '#991b1b' },
                'hecho': { bg: '#d1fae5', color: '#065f46' }
            };
            
            badge.style.background = estadoColor[orden.estado].bg;
            badge.style.color = estadoColor[orden.estado].color;
            badge.textContent = orden.id;
            badge.title = orden.activo;
            badge.onclick = (e) => {
                e.stopPropagation();
                mostrarDetalleOrden(orden.id);
            };
            
            celda.appendChild(badge);
        });
        
        // Click en la celda para ver órdenes del día
        celda.onclick = () => {
            if (ordenesDelDia.length > 0) {
                mostrarOrdenesDelDia(fechaCelda, ordenesDelDia);
            }
        };
        
        celda.onmouseover = () => {
            if (!esHoy) {
                celda.style.background = '#f9fafb';
                celda.style.transform = 'translateY(-2px)';
            }
        };
        celda.onmouseout = () => {
            if (!esHoy) {
                celda.style.background = 'white';
                celda.style.transform = 'translateY(0)';
            }
        };
        
        grid.appendChild(celda);
    }
}

function cambiarMes(direccion) {
    mesActualCalendario += direccion;
    
    if (mesActualCalendario > 11) {
        mesActualCalendario = 0;
        añoActualCalendario++;
    } else if (mesActualCalendario < 0) {
        mesActualCalendario = 11;
        añoActualCalendario--;
    }
    
    renderizarCalendario();
}

// Función auxiliar para obtener órdenes filtradas
function obtenerOrdenesFiltradas() {
    const filtroResponsable = document.getElementById('filtroResponsable').value;
    const filtroPrioridad = document.getElementById('filtroPrioridad').value;
    
    return ordenesDeTrabajoGlobal.filter(orden => {
        const cumpleFiltroResponsable = !filtroResponsable || orden.responsable === filtroResponsable;
        const cumpleFiltroPrioridad = !filtroPrioridad || orden.prioridad === filtroPrioridad;
        return cumpleFiltroResponsable && cumpleFiltroPrioridad;
    });
}