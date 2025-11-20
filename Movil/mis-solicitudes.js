// Opciones para desplegables
const opcionesActivos = {
    numeroActivo: ["TR-001", "TR-002", "TR-003", "TR-004", "TR-005", "PV-001", "PV-002", "PV-010", "CS-001", "CS-011", "SR-001", "SR-004", "SR-012", "GN-006", "BM-007", "CV-008"],
    categoriaActivo: ["Maquinaria", "Instalaciones", "Vehículos", "Equipos"],
    tipoActivo: ["Tractor", "Pulverizador", "Cosechadora", "Sistema de Riego", "Generador", "Bomba", "Cultivador"],
    ubicacion: ["Fuente el Olmo", "Sector 1", "Sector 2", "Sector 3", "Almacén Principal", "Taller", "Campo Norte", "Campo Sur"],
    averia: ["Sistema Hidráulico", "Motor", "Transmisión", "Sistema Eléctrico", "Frenos", "Neumáticos", "Cabina", "Refrigeración", "Revisión General", "Cambio de Aceite", "Filtros", "Inspección", "Calibración"]
};

// Datos de ejemplo de solicitudes
const solicitudesData = [
    {
        id: "SOL-001",
        fecha: "2024-11-10",
        nombre: "Usuario Móvil",
        tipoMantenimiento: "Mantenimiento Correctivo",
        importancia: "alta",
        numeroActivo: "TR-001",
        categoriaActivo: "Maquinaria",
        tipoActivo: "Tractor",
        ubicacion: "Fuente el Olmo",
        averia: "Sistema Hidráulico",
        estado: "pendiente",
        descripcion: "El tractor presenta problemas en el sistema hidráulico. Se requiere revisión completa del sistema y cambio de filtros.",
        acciones: "Se realizó una inspección visual preliminar y se identificó fuga en la manguera principal."
    },
    {
        id: "SOL-002",
        fecha: "2024-11-09",
        nombre: "Usuario Móvil",
        tipoMantenimiento: "Mantenimiento Correctivo",
        importancia: "media",
        numeroActivo: "PV-002",
        categoriaActivo: "Maquinaria",
        tipoActivo: "Pulverizador",
        ubicacion: "Fuente el Olmo",
        averia: "Sistema Eléctrico",
        estado: "en-proceso",
        descripcion: "Fallo en el sistema de dosificación del pulverizador. La bomba no mantiene la presión constante.",
        acciones: "Se reinició el sistema y se comprobó el estado de la batería."
    },
    {
        id: "SOL-003",
        fecha: "2024-11-08",
        nombre: "Usuario Móvil",
        tipoMantenimiento: "Mantenimiento Preventivo",
        importancia: "baja",
        numeroActivo: "CS-003",
        categoriaActivo: "Maquinaria",
        tipoActivo: "Cosechadora",
        ubicacion: "Fuente el Olmo",
        averia: "Revisión General",
        estado: "completada",
        descripcion: "Inspección rutinaria pre-temporada de la cosechadora. Revisión de todos los sistemas.",
        acciones: "Se lubricaron todas las partes móviles y se comprobó el nivel de líquidos."
    }
];

let solicitudesFiltradas = [...solicitudesData];

// Inicializar página al cargar
window.addEventListener('load', () => {
    // Cargar solicitudes directamente para móvil
    cargarSolicitudes();
});

// También cargar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarSolicitudes();
});

function cargarSolicitudes() {
    console.log('🔄 Cargando solicitudes...', solicitudesFiltradas.length);
    const container = document.getElementById('solicitudes-lista');
    
    if (solicitudesFiltradas.length === 0) {
        container.innerHTML = `
            <div class="no-solicitudes">
                <div class="no-solicitudes-icon">📋</div>
                <div class="no-solicitudes-text">No se encontraron solicitudes con los filtros aplicados</div>
            </div>
        `;
        return;
    }
    
    const solicitudesHTML = solicitudesFiltradas.map((solicitud, index) => `
        <div class="solicitud-card" onclick="abrirDetalle(${index})">
            <div class="solicitud-main-info">
                <div class="solicitud-id">${solicitud.id}</div>
                <div class="solicitud-resumen">
                    <div class="solicitud-titulo">${solicitud.numeroActivo}</div>
                    <div class="solicitud-subtitulo">
                        ${solicitud.nombre} • ${formatearFecha(solicitud.fecha)}
                    </div>
                </div>
            </div>
            <div class="solicitud-badges">
                <span class="tipo-activo-badge">
                    ${solicitud.tipoActivo}
                </span>
                <div class="tipo-mantenimiento-badge-small ${solicitud.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'preventivo' : 'correctivo'}">
                    ${solicitud.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'PREVENTIVO' : 'CORRECTIVO'}
                    <i class="fas ${solicitud.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'fa-calendar-check' : 'fa-wrench'}"></i>
                </div>
                <span class="estado-badge estado-${solicitud.estado}">
                    ${getEstadoTexto(solicitud.estado)}
                </span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = solicitudesHTML;
}

function filtrarSolicitudes() {
    console.log('🔍 Aplicando filtros...');
    const importanciaFiltro = document.getElementById('importancia-filter').value;
    const tipoFiltro = document.getElementById('tipo-filter').value;
    const activoFiltro = document.getElementById('activo-filter').value;
    
    solicitudesFiltradas = solicitudesData.filter(solicitud => {
        const cumpleImportancia = importanciaFiltro === 'todas' || solicitud.importancia === importanciaFiltro;
        const cumpleTipo = tipoFiltro === 'todos' || solicitud.tipoMantenimiento === tipoFiltro;
        const cumpleActivo = activoFiltro === 'todos' || solicitud.tipoActivo === activoFiltro;
        
        return cumpleImportancia && cumpleTipo && cumpleActivo;
    });
    
    cargarSolicitudes();
}

function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const opciones = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
}

function getEstadoTexto(estado) {
    const estados = {
        'pendiente': '⏳ PENDIENTE',
        'en-proceso': '🔄 EN PROCESO',
        'completada': '✅ COMPLETADA'
    };
    return estados[estado] || estado.toUpperCase();
}

function volverAtras() {
    window.location.href = 'usuarioplanasa.html';
}

// Hacer las funciones disponibles globalmente
window.volverAtras = volverAtras;
window.cerrarSesion = cerrarSesion;
window.filtrarSolicitudes = filtrarSolicitudes;
window.abrirDetalle = abrirDetalle;
window.cerrarModal = cerrarModal;

function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('gmao_logged_in');
        localStorage.removeItem('gmao_username');
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
    }
}

let solicitudSeleccionada = null;

// Función para generar opciones de select
function generarOpciones(opciones, valorSeleccionado, conPrerrelleno = false) {
    if (!conPrerrelleno) {
        return opciones.map(opcion => 
            `<option value="${opcion}" ${valorSeleccionado === opcion ? 'selected' : ''}>${opcion}</option>`
        ).join('');
    } else {
        // Para campos prerrellenados, mostrar solo el valor seleccionado y deshabilitado
        return `<option value="${valorSeleccionado}" selected disabled>${valorSeleccionado}</option>`;
    }
}

function abrirDetalle(index) {
    solicitudSeleccionada = solicitudesFiltradas[index];
    const modal = document.getElementById('modal-detalle');
    const titulo = document.getElementById('modal-titulo');
    const contenido = document.getElementById('modal-contenido');
    
    titulo.textContent = `Solicitud ${solicitudSeleccionada.id}`;
    
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
                    <div class="modal-info-value">${formatearFecha(solicitudSeleccionada.fecha)}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Solicitante</div>
                    <div class="modal-info-value">${solicitudSeleccionada.nombre}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Tipo de Mantto.</div>
                    <div class="tipo-mantenimiento-badge ${solicitudSeleccionada.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'preventivo' : 'correctivo'}">
                        ${solicitudSeleccionada.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'PREVENTIVO' : 'CORRECTIVO'}
                        <i class="fas ${solicitudSeleccionada.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'fa-calendar-check' : 'fa-wrench'}"></i>
                    </div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Prioridad</div>
                    <span class="prioridad-badge prioridad-${solicitudSeleccionada.importancia}">
                        ${solicitudSeleccionada.importancia.toUpperCase()}
                    </span>
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
                    <div class="modal-info-value">${solicitudSeleccionada.numeroActivo}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Categoría</div>
                    <div class="modal-info-value">${solicitudSeleccionada.categoriaActivo}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Tipo</div>
                    <div class="modal-info-value">
                        <span class="tipo-activo-badge">${solicitudSeleccionada.tipoActivo}</span>
                    </div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Ubicación</div>
                    <div class="modal-info-value">${solicitudSeleccionada.ubicacion}</div>
                </div>
            </div>
        </div>

        <!-- Detalles del Trabajo/Avería -->
        <div class="modal-section seccion-averia ${solicitudSeleccionada.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'mantenimiento-preventivo' : ''}">
            <div class="modal-section-title">
                <i class="fas ${solicitudSeleccionada.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'fa-tools' : 'fa-exclamation-triangle'}"></i>
                <span>${solicitudSeleccionada.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'Detalles del Mantenimiento' : 'Detalles de la Avería'}</span>
            </div>
            
            <!-- Primera fila: Avería -->
            <div class="modal-section-grid primera-fila">
                <div class="modal-info-item">
                    <div class="modal-info-label">${solicitudSeleccionada.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'Trabajo' : 'Avería'}</div>
                    <div class="modal-info-value">${solicitudSeleccionada.averia}</div>
                </div>
            </div>
            
            <!-- Segunda fila: Descripción y Acciones tomadas -->
            <div class="modal-section-grid segunda-fila">
                <div class="modal-info-item descripcion-item">
                    <div class="modal-info-label">Descripción Detallada</div>
                    <div class="descripcion-text">${solicitudSeleccionada.descripcion}</div>
                </div>
                <div class="modal-info-item descripcion-item">
                    <div class="modal-info-label">Acciones ya Tomadas</div>
                    <div class="descripcion-text">${solicitudSeleccionada.acciones || 'No se han registrado acciones aún.'}</div>
                </div>
            </div>
            
            <!-- Tercera fila: Fotos -->
            <div class="modal-fotos-section">
                <div class="modal-info-label">Fotografías</div>
                <div class="fotos-container">
                    <div class="fotos-existentes" id="fotos-existentes">
                        <!-- Fotos existentes se cargarán aquí -->
                    </div>
                    <div class="subir-fotos">
                        <p class="fotos-info-text">No hay fotografías adjuntas</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function cerrarModal() {
    const modal = document.getElementById('modal-detalle');
    modal.classList.remove('show');
    solicitudSeleccionada = null;
}



// Variables globales del wizard
let ordenWizardData = {
    criticidad: '',
    fechaInicio: '',
    fechaFin: '',
    responsable: '',
    equipoApoyo: [],
    tareas: [],
    descripcion: '',
    materiales: []
};

function getDescripcionCriticidad(criticidad) {
    const descripciones = {
        'Baja': 'No afecta la operación',
        'Media': 'Afecta la eficiencia',
        'Alta': 'Afecta la producción',
        'Crítica': 'Parada total del equipo'
    };
    return descripciones[criticidad] || '';
}

// Tareas predeterminadas por tipo de trabajo
const tareasPredeterminadas = {
    'preventivo-motor': [
        'Verificar nivel de aceite del motor',
        'Inspeccionar filtros de aire',
        'Revisar correas y tensiones',
        'Comprobar sistema de refrigeración',
        'Verificar bujías o inyectores',
        'Revisar conexiones eléctricas',
        'Comprobar nivel de combustible',
        'Inspección visual general del motor'
    ],
    'preventivo-hidraulico': [
        'Verificar nivel de fluido hidráulico',
        'Inspeccionar mangueras hidráulicas',
        'Revisar conexiones y acoples',
        'Comprobar presión del sistema',
        'Inspeccionar cilindros hidráulicos',
        'Revisar filtros hidráulicos',
        'Verificar bombas hidráulicas',
        'Comprobar válvulas de seguridad'
    ],
    'preventivo-electrico': [
        'Inspeccionar cableado eléctrico',
        'Revisar conexiones y terminales',
        'Comprobar fusibles y relés',
        'Verificar batería y carga',
        'Inspeccionar luces y señales',
        'Revisar sistema de arranque',
        'Comprobar alternador',
        'Verificar instrumentos del tablero'
    ],
    'correctivo-mecanico': [
        'Diagnosticar el problema mecánico',
        'Desmontar componentes afectados',
        'Inspeccionar piezas dañadas',
        'Reemplazar componentes defectuosos',
        'Lubricar partes móviles',
        'Ajustar tensiones y alineaciones',
        'Montar componentes reparados',
        'Probar funcionamiento'
    ],
    'correctivo-electrico': [
        'Diagnosticar falla eléctrica',
        'Medir voltajes y continuidad',
        'Localizar circuito afectado',
        'Reemplazar componentes dañados',
        'Reparar conexiones defectuosas',
        'Verificar aislamiento',
        'Probar circuitos reparados',
        'Comprobar funcionamiento completo'
    ],
    'correctivo-hidraulico': [
        'Diagnosticar falla hidráulica',
        'Verificar presiones del sistema',
        'Localizar fugas',
        'Reemplazar sellos y juntas',
        'Reparar o cambiar mangueras',
        'Ajustar válvulas',
        'Purgar sistema hidráulico',
        'Probar funcionamiento'
    ]
};

function cargarTareasPredeterminadas() {
    const tipoSeleccionado = document.getElementById('tipoTrabajo').value;
    const listaContainer = document.getElementById('lista-tareas-editables');
    
    if (!tipoSeleccionado) {
        listaContainer.innerHTML = '<p class="sin-tareas">Selecciona un tipo de trabajo para cargar las tareas predeterminadas</p>';
        return;
    }
    
    const tareas = tareasPredeterminadas[tipoSeleccionado] || [];
    listaContainer.innerHTML = '';
    
    tareas.forEach((tarea, index) => {
        añadirTareaALista(tarea, index);
    });
}

function añadirTareaALista(textoTarea, index) {
    const listaContainer = document.getElementById('lista-tareas-editables');
    const tareaDiv = document.createElement('div');
    tareaDiv.className = 'tarea-editable';
    tareaDiv.innerHTML = `
        <input type="text" class="tarea-texto" value="${textoTarea}" placeholder="Describe la tarea...">
        <div class="tarea-acciones">
            <button type="button" class="btn-tarea btn-eliminar" onclick="eliminarTarea(this)" title="Eliminar tarea">
                🗑️
            </button>
        </div>
    `;
    
    listaContainer.appendChild(tareaDiv);
}

function añadirTareaNueva() {
    añadirTareaALista('', Date.now());
    // Enfocar en la nueva tarea
    const nuevasTareas = document.querySelectorAll('.tarea-texto');
    if (nuevasTareas.length > 0) {
        nuevasTareas[nuevasTareas.length - 1].focus();
    }
}

function eliminarTarea(boton) {
    const tareaDiv = boton.closest('.tarea-editable');
    const listaContainer = document.getElementById('lista-tareas-editables');
    
    // No permitir eliminar si es la última tarea
    if (listaContainer.children.length <= 1) {
        alert('Debe mantener al menos una tarea en la lista');
        return;
    }
    
    tareaDiv.remove();
}

function crearOrdenTrabajo() {
    // Abrir el modal del wizard y resetear datos
    document.getElementById('modal-orden-trabajo').classList.add('show');
    ordenWizardData = {
        criticidad: '',
        fechaInicio: '',
        fechaFin: '',
        responsable: '',
        equipoApoyo: [],
        tareas: [],
        descripcion: '',
        materiales: []
    };
    
    // Mostrar solo el primer paso
    mostrarPaso(1);
}

function mostrarPaso(numeroPaso) {
    // Ocultar todos los pasos
    for (let i = 1; i <= 4; i++) {
        const paso = document.getElementById(`paso${i}`);
        const progreso = document.getElementById(`progreso${i}`);
        
        if (paso) {
            paso.style.display = 'none';
        }
        
        // Actualizar indicador de progreso
        if (progreso) {
            if (i <= numeroPaso) {
                progreso.classList.add('active');
            } else {
                progreso.classList.remove('active');
            }
        }
    }
    
    // Mostrar el paso actual
    const pasoActual = document.getElementById(`paso${numeroPaso}`);
    if (pasoActual) {
        pasoActual.style.display = 'block';
    }
}

function seleccionarCriticidad(criticidad) {
    ordenWizardData.criticidad = criticidad;
    
    // Remover selección anterior
    document.querySelectorAll('.criticidad-btn-simple').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Seleccionar botón actual
    event.target.classList.add('selected');
    
    // Mostrar en resumen
    document.getElementById('fila-criticidad').style.display = 'flex';
    document.getElementById('valor-criticidad').textContent = `${criticidad} - ${getDescripcionCriticidad(criticidad)}`;
    
    // Pasar al siguiente paso más rápido
    setTimeout(() => {
        mostrarPaso(2);
        // Establecer fecha mínima como hoy para ambos campos
        const hoy = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD para date
        const fechaInicio = document.getElementById('fechaInicio');
        const fechaFin = document.getElementById('fechaFin');
        const fechaCalendario = document.getElementById('fechaCalendario');
        
        if (fechaInicio && fechaFin) {
            fechaInicio.min = hoy;
            fechaFin.min = hoy;
            fechaInicio.focus();
        } else if (fechaCalendario) {
            fechaCalendario.min = hoy;
            fechaCalendario.focus();
        }
    }, 500);
}

function validarFechasProgramadas() {
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');
    
    if (fechaInicio && fechaFin && fechaInicio.value && fechaFin.value) {
        const inicio = new Date(fechaInicio.value);
        const fin = new Date(fechaFin.value);
        
        if (fin < inicio) {
            alert('La fecha de finalización debe ser igual o posterior a la fecha de inicio');
            return;
        }
        
        // Guardar fechas
        ordenWizardData.fechaInicio = fechaInicio.value;
        ordenWizardData.fechaFin = fechaFin.value;
        
        // Mostrar en el resumen con formato solo de fecha
        const inicioFormateado = inicio.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const finFormateado = fin.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
        });
        
        document.getElementById('fila-fechas').style.display = 'flex';
        
        // Si es el mismo día, mostrar solo una fecha
        if (fechaInicio.value === fechaFin.value) {
            document.getElementById('valor-fechas').innerHTML = `<strong>Fecha:</strong> ${inicioFormateado}`;
        } else {
            document.getElementById('valor-fechas').innerHTML = `<strong>Inicio:</strong> ${inicioFormateado}<br><strong>Fin:</strong> ${finFormateado}`;
        }
        
        // Continuar automáticamente
        setTimeout(() => {
            mostrarPaso(3);
        }, 300);
    }
}

// Función legacy para compatibilidad
function confirmarFechaCalendario() {
    const fechaSeleccionada = document.getElementById('fechaCalendario');
    if (fechaSeleccionada && fechaSeleccionada.value) {
        // Si es el campo único de fecha, usarlo como inicio y fin del mismo día
        const fecha = fechaSeleccionada.value;
        ordenWizardData.fechaInicio = fecha;
        ordenWizardData.fechaFin = fecha;
        
        const fechaFormat = new Date(fecha).toLocaleDateString('es-ES');
        document.getElementById('fila-fechas').style.display = 'flex';
        document.getElementById('valor-fechas').textContent = `${fechaFormat}`;
        
        setTimeout(() => {
            mostrarPaso(3);
        }, 300);
    } else {
        // Si no hay campo único, validar fechas programadas
        validarFechasProgramadas();
    }
}

function siguientePaso(numeroPaso) {
    mostrarPaso(numeroPaso);
}

// Función para editar un paso haciendo clic en la fila del resumen
function editarPaso(numeroPaso) {
    // Ocultar el paso actual
    document.querySelectorAll('.paso-wizard').forEach(paso => {
        paso.style.display = 'none';
    });
    
    // Mostrar el paso seleccionado
    const pasoSeleccionado = document.getElementById(`paso${numeroPaso}`);
    if (pasoSeleccionado) {
        pasoSeleccionado.style.display = 'block';
        pasoActual = numeroPaso;
        
        // Enfocar el campo relevante según el paso
        setTimeout(() => {
            switch(numeroPaso) {
                case 1:
                    // No hay campo específico para enfocar en criticidad
                    break;
                case 2:
                    const fechaInicio = document.getElementById('fechaInicio');
                    const fechaCalendario = document.getElementById('fechaCalendario');
                    if (fechaInicio) {
                        fechaInicio.focus();
                    } else if (fechaCalendario) {
                        fechaCalendario.focus();
                    }
                    break;
                case 3:
                    const responsable = document.getElementById('responsable');
                    if (responsable) {
                        responsable.focus();
                    }
                    break;
            }
        }, 100);
    }
}

function validarResponsable() {
    const responsable = document.getElementById('responsable').value;
    
    if (responsable) {
        ordenWizardData.responsable = responsable;
        
        // Mostrar en resumen
        document.getElementById('fila-responsable').style.display = 'flex';
        document.getElementById('valor-responsable').textContent = responsable;
        
        // Continuar automáticamente más rápido
        setTimeout(() => {
            mostrarPaso(4);
        }, 300);
    }
}

function añadirTarea(event) {
    if (event.key === 'Enter') {
        añadirTareaManual();
    }
}

function añadirTareaManual() {
    const input = document.querySelector('.tarea-nueva input');
    const texto = input.value.trim();
    
    if (texto) {
        const tareasContainer = document.querySelector('.tareas-container');
        const nuevaTarea = document.createElement('div');
        nuevaTarea.className = 'tarea-item';
        
        const tareaId = `tarea-${Date.now()}`;
        nuevaTarea.innerHTML = `
            <input type="checkbox" id="${tareaId}">
            <label for="${tareaId}">${texto}</label>
            <button onclick="eliminarTarea(this)" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 3px; margin-left: 10px;">🗑️</button>
        `;
        
        // Insertar antes del campo de nueva tarea
        tareasContainer.insertBefore(nuevaTarea, document.querySelector('.tarea-nueva'));
        input.value = '';
    }
}

function eliminarTarea(button) {
    button.closest('.tarea-item').remove();
}

function añadirMaterial() {
    const materialesSection = document.querySelector('.materiales-section');
    const nuevoMaterial = document.createElement('div');
    nuevoMaterial.className = 'material-item';
    nuevoMaterial.innerHTML = `
        <input type="text" placeholder="Material/Repuesto">
        <input type="number" placeholder="Cant." min="1">
        <button onclick="eliminarMaterial(this)">🗑️</button>
    `;
    
    // Insertar antes del botón de añadir
    materialesSection.insertBefore(nuevoMaterial, document.querySelector('.btn-añadir-material'));
}

function eliminarMaterial(button) {
    if (document.querySelectorAll('.material-item').length > 1) {
        button.closest('.material-item').remove();
    }
}

function crearOrden() {
    // Recopilar datos finales
    ordenWizardData.descripcion = document.getElementById('descripcionOrden').value;
    
    // Recopilar tareas editables
    const tareasEditables = [];
    document.querySelectorAll('.tarea-texto').forEach(input => {
        if (input.value.trim()) {
            tareasEditables.push(input.value.trim());
        }
    });
    ordenWizardData.tareas = tareasEditables;
    
    // Recopilar tipo de trabajo
    ordenWizardData.tipoTrabajo = document.getElementById('tipoTrabajo').value;
    
    // Validar datos mínimos (solo los esenciales)
    if (!ordenWizardData.criticidad || !ordenWizardData.fechaInicio || !ordenWizardData.responsable) {
        alert('⚠️ Faltan datos obligatorios para crear la orden');
        return;
    }
    
    // Simular creación de orden
    console.log('Datos de la orden:', ordenWizardData);
    
    alert(`✅ Orden de Trabajo creada exitosamente!
    
🚨 Criticidad: ${ordenWizardData.criticidad}
📅 Fecha inicio: ${new Date(ordenWizardData.fechaInicio).toLocaleDateString('es-ES')}
📅 Fecha fin: ${new Date(ordenWizardData.fechaFin).toLocaleDateString('es-ES')}
👤 Responsable: ${ordenWizardData.responsable}
📋 Tareas: ${ordenWizardData.tareas.length > 0 ? ordenWizardData.tareas.length + ' programadas' : 'Sin tareas específicas'}
🔧 Tipo: ${document.getElementById('tipoTrabajo').options[document.getElementById('tipoTrabajo').selectedIndex]?.text || 'No especificado'}`);
    
    // Cerrar modal y limpiar
    cerrarModalOrden();
}

function cancelarOrden() {
    cerrarModalOrden();
}

function cerrarModalOrden() {
    document.getElementById('modal-orden-trabajo').classList.remove('show');
    
    // Limpiar formulario
    document.querySelectorAll('.criticidad-btn-simple').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.getElementById('fechaCalendario').value = '';
    document.getElementById('responsable').value = '';
    document.getElementById('descripcionOrden').value = '';
    document.getElementById('tipoTrabajo').value = '';
    
    // Limpiar lista de tareas
    document.getElementById('lista-tareas-editables').innerHTML = '<p class="sin-tareas">Selecciona un tipo de trabajo para cargar las tareas predeterminadas</p>';
    
    // Ocultar resúmenes
    document.getElementById('fila-criticidad').style.display = 'none';
    document.getElementById('fila-fechas').style.display = 'none';
    document.getElementById('fila-responsable').style.display = 'none';
    
    // Resetear botones
    const btnResponsable = document.getElementById('btnSiguienteResponsable');
    if (btnResponsable) btnResponsable.disabled = true;
    
    // Volver al inicio
    mostrarPaso(1);
}

// Tareas predefinidas según el tipo de avería
const tareasPorAveria = {
    "Sistema Hidráulico": [
        "Verificar nivel de aceite hidráulico",
        "Inspeccionar mangueras y conexiones",
        "Revisar bombas hidráulicas",
        "Comprobar filtros hidráulicos",
        "Verificar presión del sistema",
        "Revisar cilindros hidráulicos",
        "Comprobar válvulas de control"
    ],
    "Motor": [
        "Verificar nivel de aceite del motor",
        "Inspeccionar sistema de refrigeración",
        "Revisar filtro de aire",
        "Comprobar bujías o inyectores",
        "Verificar correas y tensores",
        "Inspeccionar sistema de escape",
        "Revisar nivel de combustible"
    ],
    "Transmisión": [
        "Verificar nivel de aceite de transmisión",
        "Inspeccionar embrague",
        "Revisar engranajes y sincronizadores",
        "Comprobar sistema de cambios",
        "Verificar cardanes y juntas",
        "Inspeccionar diferencial",
        "Revisar frenos de transmisión"
    ],
    "Sistema Eléctrico": [
        "Verificar batería y terminales",
        "Inspeccionar alternador",
        "Revisar fusibles y relés",
        "Comprobar cableado principal",
        "Verificar luces y señales",
        "Inspeccionar motor de arranque",
        "Revisar sistema de carga"
    ],
    "Frenos": [
        "Verificar nivel de líquido de frenos",
        "Inspeccionar pastillas de freno",
        "Revisar discos o tambores",
        "Comprobar mangueras de freno",
        "Verificar cilindros de freno",
        "Inspeccionar pedal de freno",
        "Revisar servo-freno (si aplica)"
    ],
    "Neumáticos": [
        "Verificar presión de neumáticos",
        "Inspeccionar desgaste de banda de rodadura",
        "Revisar válvulas y tapones",
        "Comprobar alineación de ruedas",
        "Verificar balanceado",
        "Inspeccionar llantas por daños",
        "Revisar tuercas de sujeción"
    ],
    "Cabina": [
        "Inspeccionar asientos y ergonomía",
        "Revisar sistema de climatización",
        "Comprobar instrumentos del tablero",
        "Verificar espejos y visibilidad",
        "Inspeccionar puertas y ventanas",
        "Revisar sistema de audio/comunicación",
        "Comprobar iluminación interior"
    ],
    "Refrigeración": [
        "Verificar nivel de refrigerante",
        "Inspeccionar radiador y mangueras",
        "Revisar bomba de agua",
        "Comprobar termostato",
        "Verificar ventilador de refrigeración",
        "Inspeccionar intercambiador de calor",
        "Revisar sensores de temperatura"
    ]
};

// Función obsoleta - reemplazada por el wizard de creación de órdenes
// function abrirModalOrdenTrabajo() { ... }

function generarDescripcionTrabajo(solicitud) {
    const tipoMantenimiento = solicitud.tipoMantenimiento === 'Mantenimiento Preventivo' ? 'preventivo' : 'correctivo';
    const activo = `${solicitud.tipoActivo} ${solicitud.numeroActivo}`;
    
    let descripcion = `Realizar mantenimiento ${tipoMantenimiento} en ${activo} ubicado en ${solicitud.ubicacion}. `;
    
    if (solicitud.tipoMantenimiento === 'Mantenimiento Correctivo') {
        descripcion += `Reparar avería en ${solicitud.averia} de tipo ${solicitud.tipoAveria.toLowerCase()}. `;
    } else {
        descripcion += `Ejecutar rutina de mantenimiento programado para ${solicitud.averia}. `;
    }
    
    descripcion += `Problema reportado: ${solicitud.descripcion}`;
    
    return descripcion;
}

function renderizarTareas() {
    const listaTareas = document.getElementById('orden-lista-tareas');
    const tareasCompletadas = window.tareasOrdenTrabajo.filter(t => t.completada).length;
    const totalTareas = window.tareasOrdenTrabajo.length;
    
    listaTareas.innerHTML = `
        <div class="tareas-tipo-titulo">
            Tareas para: ${solicitudSeleccionada.averia}
            <span class="tarea-contador">${tareasCompletadas}/${totalTareas} completadas</span>
        </div>
        ${window.tareasOrdenTrabajo.map((tarea, index) => `
            <div class="tarea-item">
                <input type="checkbox" class="tarea-checkbox" 
                       ${tarea.completada ? 'checked' : ''} 
                       onchange="toggleTarea(${tarea.id})">
                <input type="text" class="tarea-input" 
                       value="${tarea.texto}" 
                       ${tarea.completada ? 'disabled' : ''} 
                       onchange="actualizarTarea(${tarea.id}, this.value)"
                       placeholder="Escriba la tarea...">
                <button type="button" class="btn-eliminar-tarea" onclick="eliminarTarea(${tarea.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('')}
    `;
}

function agregarTarea() {
    const nuevoId = Math.max(...window.tareasOrdenTrabajo.map(t => t.id), -1) + 1;
    window.tareasOrdenTrabajo.push({
        id: nuevoId,
        texto: '',
        completada: false
    });
    renderizarTareas();
    
    // Enfocar el nuevo input
    setTimeout(() => {
        const inputs = document.querySelectorAll('.tarea-input');
        const ultimoInput = inputs[inputs.length - 1];
        if (ultimoInput) {
            ultimoInput.focus();
        }
    }, 100);
}

function eliminarTarea(id) {
    if (window.tareasOrdenTrabajo.length <= 1) {
        alert('Debe mantener al menos una tarea en la lista.');
        return;
    }
    
    window.tareasOrdenTrabajo = window.tareasOrdenTrabajo.filter(tarea => tarea.id !== id);
    renderizarTareas();
}

function toggleTarea(id) {
    const tarea = window.tareasOrdenTrabajo.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
        renderizarTareas();
    }
}

function actualizarTarea(id, nuevoTexto) {
    const tarea = window.tareasOrdenTrabajo.find(t => t.id === id);
    if (tarea) {
        tarea.texto = nuevoTexto;
    }
}

function cerrarModalOrden() {
    const modalOrden = document.getElementById('modal-orden-trabajo');
    modalOrden.classList.remove('show');
}

function confirmarOrdenTrabajo() {
    const responsable = document.getElementById('orden-responsable').value;
    const fechaInicio = document.getElementById('orden-fecha-inicio').value;
    const fechaFin = document.getElementById('orden-fecha-fin').value;
    const criticidad = document.getElementById('orden-criticidad').value;
    const descripcionTrabajo = document.getElementById('orden-descripcion').value;
    
    // Validar campos obligatorios
    if (!responsable || !fechaInicio || !fechaFin || !criticidad || !descripcionTrabajo.trim()) {
        alert('❌ Por favor, complete todos los campos obligatorios incluyendo la descripción del trabajo.');
        return;
    }
    
    // Validar que la fecha de fin sea posterior a la de inicio
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
        alert('❌ La fecha de finalización debe ser posterior a la fecha de inicio.');
        return;
    }
    
    // Validar que hay al menos una tarea y que ninguna esté vacía
    const tareasValidas = window.tareasOrdenTrabajo.filter(tarea => tarea.texto.trim() !== '');
    if (tareasValidas.length === 0) {
        alert('❌ Debe incluir al menos una tarea con contenido.');
        return;
    }
    
    if (tareasValidas.length !== window.tareasOrdenTrabajo.length) {
        alert('❌ Algunas tareas están vacías. Por favor, complete todas las tareas o elimínelas.');
        return;
    }
    
    const totalTareas = window.tareasOrdenTrabajo.length;
    
    // Generar número único para la orden de trabajo
    const numeroOrden = 'OT-' + Date.now().toString().slice(-6);
    
    // Crear resumen de la orden de trabajo
    const resumenOrden = `✅ ORDEN DE TRABAJO CREADA EXITOSAMENTE\n\n` +
          `📋 Número de Orden: ${numeroOrden}\n` +
          `🎯 Solicitud: ${solicitudSeleccionada.id}\n` +
          `👤 Responsable: ${responsable}\n` +
          `⚠️ Criticidad: ${criticidad.charAt(0).toUpperCase() + criticidad.slice(1)}\n` +
          `📅 Fecha de Inicio: ${fechaInicio}\n` +
          `📅 Fecha de Finalización: ${fechaFin}\n\n` +
          `🔧 DETALLES DEL TRABAJO:\n` +
          `Activo: ${solicitudSeleccionada.numeroActivo} - ${solicitudSeleccionada.tipoActivo}\n` +
          `Avería: ${solicitudSeleccionada.averia} (${solicitudSeleccionada.tipoAveria})\n` +
          `Ubicación: ${solicitudSeleccionada.ubicacion}\n\n` +
          `📝 Descripción del Trabajo:\n${descripcionTrabajo}\n\n` +
          `✅ Tareas Asignadas: ${totalTareas} tareas para ${solicitudSeleccionada.averia}`;
    
    // Mostrar confirmación
    alert(resumenOrden);
    
    // Cerrar modales
    cerrarModalOrden();
    cerrarModal();
    
    // Refrescar la lista
    filtrarSolicitudes();
}

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modalDetalle = document.getElementById('modal-detalle');
    const modalOrden = document.getElementById('modal-orden-trabajo');
    
    if (event.target === modalDetalle) {
        cerrarModal();
    } else if (event.target === modalOrden) {
        cerrarModalOrden();
    }
}

// Manejo de fotos
let fotosSubidas = [];

function manejarSubidaFotos() {
    const inputFotos = document.getElementById('input-fotos');
    const fotosContainer = document.getElementById('fotos-existentes');
    
    if (inputFotos) {
        inputFotos.addEventListener('change', function(e) {
            const archivos = Array.from(e.target.files);
            
            // Validar número máximo de fotos
            if (fotosSubidas.length + archivos.length > 5) {
                alert('❌ Máximo 5 fotos permitidas');
                return;
            }
            
            archivos.forEach(archivo => {
                if (archivo.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const fotoObj = {
                            id: Date.now() + Math.random(),
                            nombre: archivo.name,
                            datos: e.target.result
                        };
                        
                        fotosSubidas.push(fotoObj);
                        mostrarFoto(fotoObj, fotosContainer);
                    };
                    reader.readAsDataURL(archivo);
                }
            });
            
            // Limpiar input para permitir seleccionar las mismas fotos de nuevo
            e.target.value = '';
        });
    }
}

function mostrarFoto(foto, container) {
    const img = document.createElement('img');
    img.src = foto.datos;
    img.className = 'foto-thumbnail';
    img.title = foto.nombre;
    img.onclick = () => verFotoCompleta(foto);
    
    // Añadir botón de eliminar
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    
    const btnEliminar = document.createElement('button');
    btnEliminar.innerHTML = '×';
    btnEliminar.className = 'btn-eliminar-foto';
    btnEliminar.onclick = (e) => {
        e.stopPropagation();
        eliminarFoto(foto.id, wrapper);
    };
    
    wrapper.appendChild(img);
    wrapper.appendChild(btnEliminar);
    container.appendChild(wrapper);
}

function eliminarFoto(fotoId, elemento) {
    fotosSubidas = fotosSubidas.filter(foto => foto.id !== fotoId);
    elemento.remove();
}

function verFotoCompleta(foto) {
    // Crear modal simple para ver la foto completa
    const modal = document.createElement('div');
    modal.className = 'modal-foto';
    modal.innerHTML = `
        <div class="modal-foto-content">
            <span class="modal-foto-close">&times;</span>
            <img src="${foto.datos}" alt="${foto.nombre}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
            <p style="text-align: center; margin-top: 1rem; color: white;">${foto.nombre}</p>
        </div>
    `;
    
    modal.onclick = () => modal.remove();
    modal.querySelector('.modal-foto-close').onclick = () => modal.remove();
    document.body.appendChild(modal);
}

// Debug para verificar que todo funciona
console.log('Ver solicitudes JS cargado correctamente');
console.log('Total solicitudes:', solicitudesData.length);