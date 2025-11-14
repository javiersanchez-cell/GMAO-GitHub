// Variables globales
let ordenesDeTrabajoGlobal = [];
let ordenSeleccionada = null;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarOrdenesExistentes();
    cargarNuevasOrdenes();
    actualizarContadores();
});

// Cargar órdenes existentes (simuladas)
function cargarOrdenesExistentes() {
    const ordenesEjemplo = [
        {
            id: 'OT-2024-001',
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
            fechaCreacion: new Date('2024-11-13T08:00:00'),
            descripcion: 'Revisión urgente del sistema de arranque'
        },
        {
            id: 'OT-2024-002',
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
            fechaCreacion: new Date('2024-11-12T14:30:00'),
            descripcion: 'Mantenimiento programado mensual'
        },
        {
            id: 'OT-2024-003',
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
            fechaCreacion: new Date('2024-11-09T16:20:00'),
            descripcion: 'Reparación sistema eléctrico'
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
        <div class="orden-responsable">
            <i class="fas fa-user"></i>
            ${orden.responsable}
        </div>
        <div class="orden-fecha">
            <i class="fas fa-calendar"></i>
            ${formatearFecha(orden.fechaInicio)} ${orden.fechaFin !== orden.fechaInicio ? ' - ' + formatearFecha(orden.fechaFin) : ''}
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
    const modal = document.getElementById('modalDetalleOrden');
    const titulo = document.getElementById('modal-titulo');
    const body = document.getElementById('modal-body');
    const btnCambiar = document.getElementById('btn-cambiar-estado');

    titulo.textContent = `${orden.id} - ${orden.activo}`;
    
    const tipoTexto = orden.tipoMantenimiento === 'preventivo' ? 
        'Mantenimiento Preventivo' : 
        `Mantenimiento Correctivo - ${orden.tipoAveria || 'General'}`;

    body.innerHTML = `
        <div class="detalle-orden">
            <div class="detail-section">
                <h4><i class="fas fa-cog"></i> Tipo de Mantenimiento</h4>
                <p>${tipoTexto}</p>
            </div>
            
            ${orden.descripcionAveria ? `
                <div class="detail-section">
                    <h4><i class="fas fa-exclamation-triangle"></i> Problema Reportado</h4>
                    <p style="font-style: italic; background: #f8f9fa; padding: 10px; border-radius: 6px;">"${orden.descripcionAveria}"</p>
                </div>
            ` : ''}
            
            <div class="detail-section">
                <h4><i class="fas fa-flag"></i> Prioridad</h4>
                <p><span class="orden-prioridad ${getPrioridadClass(orden.prioridad)}">${getPrioridadIcon(orden.prioridad)} ${orden.prioridad}</span></p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user"></i> Responsable</h4>
                <p>${orden.responsable}</p>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-calendar"></i> Fechas</h4>
                <p><strong>Inicio:</strong> ${new Date(orden.fechaInicio).toLocaleDateString('es-ES')}</p>
                <p><strong>Fin:</strong> ${new Date(orden.fechaFin).toLocaleDateString('es-ES')}</p>
            </div>
            
            ${orden.tareas && orden.tareas.length > 0 ? `
                <div class="detail-section">
                    <h4><i class="fas fa-tasks"></i> Tareas Programadas</h4>
                    <ul style="margin-left: 20px;">
                        ${orden.tareas.map(tarea => `<li>${tarea}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${orden.descripcion ? `
                <div class="detail-section">
                    <h4><i class="fas fa-file-text"></i> Descripción Adicional</h4>
                    <p>${orden.descripcion}</p>
                </div>
            ` : ''}
        </div>
        
        <style>
            .detail-section {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            }
            .detail-section:last-child {
                border-bottom: none;
            }
            .detail-section h4 {
                color: rgb(63, 156, 53);
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .detail-section p, .detail-section ul {
                margin-bottom: 5px;
                line-height: 1.5;
            }
        </style>
    `;

    // Configurar botón de cambiar estado
    const siguienteEstado = getSiguienteEstado(orden.estado);
    if (siguienteEstado) {
        btnCambiar.textContent = `Mover a ${getEstadoTexto(siguienteEstado)}`;
        btnCambiar.style.display = 'inline-block';
    } else {
        btnCambiar.style.display = 'none';
    }

    modal.style.display = 'flex';
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
function cerrarModalDetalle() {
    document.getElementById('modalDetalleOrden').style.display = 'none';
    ordenSeleccionada = null;
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
    const filtroResponsable = document.getElementById('filtroResponsable').value;
    const filtroPrioridad = document.getElementById('filtroPrioridad').value;
    
    const ordenesFiltradas = ordenesDeTrabajoGlobal.filter(orden => {
        const pasaResponsable = !filtroResponsable || orden.responsable === filtroResponsable;
        const pasaPrioridad = !filtroPrioridad || orden.prioridad === filtroPrioridad;
        return pasaResponsable && pasaPrioridad;
    });
    
    renderizarOrdenesFiltradas(ordenesFiltradas);
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