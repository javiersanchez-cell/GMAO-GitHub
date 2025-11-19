// Variables globales
let ordenesDeTrabajoGlobal = [];
let ordenSeleccionada = null;

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
            id: 'OT-2024-001',
            activo: '🚜 Tractor John Deere 5075E',
            categoriaActivo: 'Maquinaria',
            tipoActivo: 'Tractor', 
            ubicacion: 'Fuente el Olmo',           
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
            categoriaActivo: 'Maquinaria',
            tipoActivo: 'Pulverizador',
            ubicacion: 'Fuente el Olmo',
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
            categoriaActivo: 'Infraestructura',
            tipoActivo: 'Edificio',
            ubicacion: 'Fuente el Olmo',
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
    const modal = document.getElementById('modal-detalle');
    const titulo = document.getElementById('modal-titulo');
    const contenido = document.getElementById('modal-contenido');
    
    titulo.textContent = `Orden ${orden.id}`;

    // Obtener datos del activo
    const activoTexto = orden.activo || '';
    const categoriaActivo = orden.activoDetalle?.CatActivo || orden.categoriaActivo || '';
    const tipoActivo = orden.activoDetalle?.NomActivo || orden.tipoActivo || '';
    const ubicacionActivo = orden.activoDetalle?.ubicacion || orden.ubicacion?.nombre || orden.ubicacion || '';
    
    contenido.innerHTML = `
        <!-- Información Principal -->
        <div class="modal-section seccion-usuario">
            <div class="modal-section-title">
                <i class="fas fa-info-circle"></i>
                Información Principal
            </div>
            <div class="modal-section-grid">
                <div class="modal-info-item">
                    <div class="modal-info-label">Fecha</div>
                    <input type="date" class="modal-input" id="edit-fecha" value="${orden.fechaCreacion ? new Date(orden.fechaCreacion).toISOString().split('T')[0] : ''}">
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Solicitante</div>
                    <input type="text" class="modal-input" id="edit-solicitante" value="${orden.solicitante || orden.responsable || 'Sistema'}">
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Tipo de Mantto.</div>
                    <div class="tipo-mantenimiento-badge ${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'preventivo' : orden.tipoMantenimiento === 'construccion' ? 'construccion' : 'correctivo'}">
                        ${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'PREVENTIVO' : orden.tipoMantenimiento === 'construccion' ? 'CONSTRUCCIÓN' : 'CORRECTIVO'}
                        <i class="fas ${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'fa-calendar-check' : orden.tipoMantenimiento === 'construccion' ? 'fa-hammer' : 'fa-wrench'}"></i>
                    </div>
                    <input type="hidden" id="edit-tipoMantenimiento" value="${orden.tipoMantenimiento}">
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Prioridad</div>
                    <select class="modal-select" id="edit-prioridad">
                        <option value="Crítica" ${orden.prioridad === 'Crítica' ? 'selected' : ''}>Crítica</option>
                        <option value="Alta" ${orden.prioridad === 'Alta' ? 'selected' : ''}>Alta</option>
                        <option value="Media" ${orden.prioridad === 'Media' ? 'selected' : ''}>Media</option>
                        <option value="Baja" ${orden.prioridad === 'Baja' ? 'selected' : ''}>Baja</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Activo y Ubicación -->
        <div class="modal-section seccion-activo">
            <div class="modal-section-title">
                <i class="fas fa-cogs"></i>
                Activo y Ubicación
            </div>
            <div class="modal-section-grid">
                <div class="modal-info-item">
                    <div class="modal-info-label">Activo</div>
                    <input type="text" class="modal-input" id="edit-activo" value="${activoTexto}">
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Categoría</div>
                    <input type="text" class="modal-input" id="edit-categoria" value="${categoriaActivo}">
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Tipo</div>
                    <input type="text" class="modal-input" id="edit-tipo" value="${tipoActivo}">
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Ubicación</div>
                    <input type="text" class="modal-input" id="edit-ubicacion" value="${ubicacionActivo}">
                </div>
            </div>
        </div>

        <!-- Detalles del Trabajo/Avería -->
        <div class="modal-section seccion-averia ${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'mantenimiento-preventivo' : ''}">
            <div class="modal-section-title">
                <i class="fas ${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'fa-tools' : 'fa-exclamation-triangle'}"></i>
                <span id="seccion-trabajo-titulo">${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'Detalles del Mantenimiento' : orden.tipoMantenimiento === 'construccion' ? 'Detalles de la Construcción' : 'Detalles de la Avería'}</span>
            </div>
            
            <!-- Primera fila: Avería/Trabajo -->
            <div class="modal-section-grid primera-fila">
                <div class="modal-info-item">
                    <div class="modal-info-label" id="label-trabajo">${orden.tipoMantenimiento === 'mantenimiento-preventivo' || orden.tipoMantenimiento === 'preventivo' ? 'Trabajo' : 'Avería'}</div>
                    <input type="text" class="modal-input" id="edit-averia" value="${orden.tipoAveria || orden.titulo || 'No especificado'}">
                </div>
            </div>
            
            <!-- Segunda fila: Descripción y Acciones tomadas -->
            <div class="modal-section-grid segunda-fila">
                <div class="modal-info-item descripcion-item">
                    <div class="modal-info-label">Descripción Detallada</div>
                    <textarea class="modal-textarea" id="edit-descripcion" rows="3" placeholder="Describe detalladamente el trabajo o problema...">${orden.descripcionAveria || orden.descripcion || ''}</textarea>
                </div>
                <div class="modal-info-item descripcion-item">
                    <div class="modal-info-label">Acciones ya Tomadas</div>
                    <textarea class="modal-textarea" id="edit-acciones" rows="3" placeholder="Describe las acciones realizadas hasta ahora...">${orden.acciones || 'Ninguna acción registrada aún'}</textarea>
                </div>
            </div>
            
            <!-- Tercera fila: Fotos -->
            <div class="modal-fotos-section">
                <div class="modal-info-label">Fotografías</div>
                <div class="fotos-container">
                    <div class="fotos-existentes" id="fotos-existentes">
                        ${orden.archivos && orden.archivos.length > 0 ? orden.archivos.map((archivo, idx) => `
                            <div class="foto-item">
                                <i class="fas ${archivo.type?.includes('image') ? 'fa-image' : 'fa-file'}"></i>
                                <span>${archivo.name || `Archivo ${idx + 1}`}</span>
                            </div>
                        `).join('') : '<p style="color: #9ca3af; font-size: 0.85rem; margin: 0;">No hay fotografías adjuntas</p>'}
                    </div>
                    <div class="subir-fotos">
                        <input type="file" id="input-fotos" accept="image/*" multiple style="display: none;">
                        <button type="button" class="btn-subir-fotos" onclick="document.getElementById('input-fotos').click()">
                            <i class="fas fa-camera"></i>
                            Subir Fotos
                        </button>
                        <div class="fotos-info">
                            <small>Máximo 5 fotos - JPG, PNG</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Parte de la orden de trabajo - CONTINUAR EN EL MISMO contenido.innerHTML
    contenido.innerHTML += `
        <!-- Información de la Orden de Trabajo -->
        <div class="modal-section seccion-orden">
            <div class="modal-section-title">
                <i class="fas fa-clipboard-check"></i>
                Programación de la Orden de Trabajo
            </div>
            
            <!-- Estado -->
            <div class="modal-section-grid">
                <div class="modal-info-item">
                    <div class="modal-info-label">Estado Actual</div>
                    <div class="estado-badge ${orden.estado}">${getEstadoTexto(orden.estado)}</div>
                </div>
            </div>
        </div>

        <!-- Fechas Programadas -->
        <div class="modal-section seccion-fechas">
            <div class="modal-section-title">
                <i class="fas fa-calendar-alt"></i>
                📅 Fechas Programadas
            </div>
            <div class="modal-section-grid">
                <div class="modal-info-item">
                    <div class="modal-info-label">Fecha de inicio</div>
                    <div class="modal-input-readonly">${orden.fechaInicio ? new Date(orden.fechaInicio).toLocaleDateString('es-ES') : 'No definida'}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Fecha de finalización</div>
                    <div class="modal-input-readonly">${orden.fechaFin ? new Date(orden.fechaFin).toLocaleDateString('es-ES') : 'No definida'}</div>
                </div>
            </div>
        </div>

        <!-- Responsable -->
        <div class="modal-section seccion-responsable">
            <div class="modal-section-title">
                <i class="fas fa-user-tie"></i>
                👤 ¿Quién lo va a hacer?
            </div>
            <div class="modal-section-grid">
                <div class="modal-info-item">
                    <div class="modal-info-label">Técnico responsable</div>
                    <div class="modal-input-readonly responsable-badge">
                        <i class="fas fa-user-circle"></i> ${orden.responsable}
                    </div>
                </div>
                ${orden.equipoApoyo && orden.equipoApoyo.length > 0 ? `
                <div class="modal-info-item full-width">
                    <div class="modal-info-label">Equipo de apoyo</div>
                    <div class="equipo-apoyo-list">
                        ${orden.equipoApoyo.map(tecnico => `
                            <span class="tecnico-badge-small"><i class="fas fa-user"></i> ${tecnico}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                ${orden.notasResponsable ? `
                <div class="modal-info-item full-width">
                    <div class="modal-info-label">Notas para el responsable</div>
                    <div class="modal-textarea-readonly">${orden.notasResponsable}</div>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- Tareas y Descripción -->
        ${(orden.plantillaTareas || orden.tareas?.length > 0 || orden.descripcionTareas) ? `
        <div class="modal-section seccion-tareas">
            <div class="modal-section-title">
                <i class="fas fa-tasks"></i>
                📝 Tareas y Descripción
            </div>
            
            ${orden.plantillaTareas ? `
            <div class="tipo-selector-wrapper">
                <div class="modal-info-label">Tipo de trabajo</div>
                <div class="plantilla-seleccionada">
                    <i class="fas fa-clipboard-list"></i> ${orden.plantillaTareas}
                </div>
            </div>
            ` : ''}

            ${(orden.tareas?.length > 0 || orden.descripcionTareas) ? `
            <div class="contenido-dos-columnas">
                ${orden.tareas && orden.tareas.length > 0 ? `
                <div class="columna-tareas">
                    <div class="tareas-editables-container">
                        <div class="tareas-header">
                            <h5>Tareas programadas (${orden.tareas.length})</h5>
                        </div>
                        <div class="lista-tareas-readonly">
                            ${orden.tareas.map((tarea, idx) => `
                                <div class="tarea-item-readonly">
                                    <span class="tarea-numero">${idx + 1}</span>
                                    <input type="checkbox" ${tarea.completada ? 'checked' : ''} disabled>
                                    <span class="tarea-text">${tarea.descripcion || tarea}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : '<div></div>'}
                
                ${orden.descripcionTareas ? `
                <div class="columna-descripcion">
                    <div class="descripcion-adicional">
                        <h5>Descripción adicional</h5>
                        <div class="descripcion-readonly">${orden.descripcionTareas}</div>
                    </div>
                </div>
                ` : ''}
            </div>
            ` : ''}
        </div>
        ` : ''}
    `;

    // Abrir modal
    modal.classList.add('show');
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