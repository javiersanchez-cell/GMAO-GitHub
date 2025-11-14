// Variables globales
let pasoActual = 1;
let ordenWizardData = {
    tipoActivo: null,
    activo: null,
    tipoMantenimiento: null,
    tipoAveria: null,
    descripcionAveria: null,
    prioridad: null,
    responsable: null,
    fechaInicio: null,
    fechaFin: null,
    tareas: [],
    descripcion: ''
};

// Datos de activos por tipo
const activosPorTipo = {
    maquinaria: [
        { id: 'tractor-jd5075', nombre: '🚜 Tractor John Deere 5075E', info: 'Motor diésel 75HP, 4x4' },
        { id: 'cosechadora-case', nombre: '🌾 Cosechadora Case IH 5130', info: 'Axial-Flow, cabina climatizada' },
        { id: 'pulverizador-apache', nombre: '💧 Pulverizador Apache AS1220', info: 'Tanque 1200L, boom 24m' },
        { id: 'cultivador-kuhn', nombre: '🔨 Cultivador Kuhn Cultimer L 300', info: 'Ancho de trabajo 3m' },
        { id: 'sembradora-gp', nombre: '🌱 Sembradora Great Plains 3S-3000HD', info: 'Siembra directa, 7.5m' },
        { id: 'empacadora-nh', nombre: '📦 Empacadora New Holland BR7060', info: 'Pacas cilíndricas, variable' }
    ],
    infraestructura: [
        { id: 'nave-almacen-1', nombre: '🏢 Nave Almacén 1', info: 'Almacén principal 2000m²' },
        { id: 'nave-almacen-2', nombre: '🏢 Nave Almacén 2', info: 'Almacén secundario 1500m²' },
        { id: 'oficinas', nombre: '🏛️ Edificio Oficinas', info: 'Administración y despachos' },
        { id: 'taller-mecanico', nombre: '🔧 Taller Mecánico', info: 'Reparaciones y mantenimiento' },
        { id: 'bascula-camiones', nombre: '⚖️ Báscula Camiones', info: 'Pesaje hasta 60 toneladas' }
    ],
    vehiculos: [
        { id: 'camion-volvo', nombre: '🚛 Camión Volvo FH16', info: 'Transporte pesado, 40 toneladas' },
        { id: 'furgoneta-iveco', nombre: '🚐 Furgoneta Iveco Daily', info: 'Transporte ligero y personal' },
        { id: 'pickup-toyota', nombre: '🚗 Pick-up Toyota Hilux', info: 'Vehículo de campo 4x4' },
        { id: 'quad-honda', nombre: '🏍️ Quad Honda TRX', info: 'Inspección de parcelas' }
    ],
    equipos: [
        { id: 'compresor-atlas', nombre: '🔌 Compresor Atlas Copco', info: 'Aire comprimido taller' },
        { id: 'generador-caterpillar', nombre: '⚡ Generador Caterpillar', info: 'Emergencia 150kVA' },
        { id: 'soldadora-miller', nombre: '🔥 Soldadora Miller', info: 'MIG/TIG profesional' },
        { id: 'elevador-genie', nombre: '🏗️ Elevador Genie', info: 'Plataforma aérea 12m' }
    ]
};

// Tipos de avería por tipo de mantenimiento
const tiposAveria = {
    correctivo: {
        maquinaria: ['Motor', 'Transmisión', 'Hidráulico', 'Eléctrico', 'Neumáticos', 'Estructura'],
        infraestructura: ['Estructural', 'Eléctrico', 'Fontanería', 'Climatización', 'Seguridad'],
        vehiculos: ['Motor', 'Transmisión', 'Frenos', 'Eléctrico', 'Carrocería', 'Neumáticos'],
        equipos: ['Mecánico', 'Eléctrico', 'Hidráulico', 'Neumático', 'Electrónico']
    },
    preventivo: {
        maquinaria: ['Revisión General', 'Cambio Aceites', 'Filtros', 'Correas', 'Engrase'],
        infraestructura: ['Inspección Estructural', 'Mantenimiento Eléctrico', 'Limpieza', 'Pintura'],
        vehiculos: ['Revisión ITV', 'Cambio Aceite', 'Filtros', 'Frenos', 'Neumáticos'],
        equipos: ['Calibración', 'Limpieza', 'Lubricación', 'Revisión Eléctrica']
    }
};

// Tareas predeterminadas por tipo de mantenimiento y avería
const tareasPredeterminadas = {
    // MANTENIMIENTO PREVENTIVO
    'preventivo': {
        'maquinaria': {
            'Revisión General': [
                'Inspección visual completa',
                'Verificar todos los niveles de fluidos',
                'Revisar sistema de lubricación',
                'Comprobar funcionamiento general',
                'Anotar horas de trabajo'
            ],
            'Cambio Aceites': [
                'Drenar aceite usado del motor',
                'Cambiar filtro de aceite',
                'Rellenar con aceite nuevo',
                'Verificar nivel final',
                'Revisar posibles fugas'
            ],
            'Filtros': [
                'Cambiar filtro de aire',
                'Reemplazar filtro de combustible',
                'Cambiar filtro hidráulico',
                'Limpiar filtro de cabina',
                'Verificar estado de todos los filtros'
            ]
        },
        'vehiculos': {
            'Revisión ITV': [
                'Revisar sistema de frenos',
                'Verificar luces y señalización',
                'Comprobar neumáticos y presión',
                'Inspeccionar sistema de escape',
                'Revisar dirección y suspensión'
            ],
            'Cambio Aceite': [
                'Drenar aceite del motor',
                'Cambiar filtro de aceite',
                'Rellenar aceite nuevo según especificaciones',
                'Verificar nivel y posibles fugas',
                'Resetear indicador de mantenimiento'
            ]
        },
        'infraestructura': {
            'Inspección Estructural': [
                'Revisar estado de techos y cubiertas',
                'Inspeccionar cimientos y estructuras',
                'Verificar puertas y ventanas',
                'Comprobar sistemas de drenaje',
                'Evaluar pintura y acabados'
            ],
            'Mantenimiento Eléctrico': [
                'Revisar cuadros eléctricos',
                'Verificar iluminación',
                'Comprobar tomas y enchufes',
                'Inspeccionar cableado visible',
                'Probar sistemas de emergencia'
            ]
        }
    },
    
    // MANTENIMIENTO CORRECTIVO
    'correctivo': {
        'maquinaria': {
            'Motor': [
                'Diagnosticar problema del motor',
                'Revisar sistema de combustible',
                'Verificar sistema eléctrico del motor',
                'Comprobar sistema de refrigeración',
                'Reparar componente defectuoso',
                'Probar funcionamiento'
            ],
            'Hidráulico': [
                'Localizar fuga hidráulica',
                'Revisar presión del sistema',
                'Verificar cilindros y mangueras',
                'Reparar o reemplazar componente',
                'Rellenar aceite hidráulico',
                'Probar sistema completo'
            ],
            'Eléctrico': [
                'Diagnosticar falla eléctrica',
                'Revisar fusibles y relés',
                'Verificar cableado y conexiones',
                'Reparar componente defectuoso',
                'Probar circuito reparado'
            ],
            'Transmisión': [
                'Diagnosticar problema en transmisión',
                'Revisar embrague o convertidor',
                'Verificar niveles de aceite',
                'Reparar componente defectuoso',
                'Probar cambios de marcha'
            ]
        },
        'vehiculos': {
            'Motor': [
                'Diagnosticar falla del motor',
                'Revisar sistema de encendido',
                'Verificar inyección de combustible',
                'Comprobar compresión de cilindros',
                'Reparar componente defectuoso'
            ],
            'Frenos': [
                'Inspeccionar pastillas y discos',
                'Verificar nivel de líquido de frenos',
                'Revisar sistema de freno de mano',
                'Reparar o reemplazar componentes',
                'Probar sistema de frenado'
            ],
            'Eléctrico': [
                'Diagnosticar problema eléctrico',
                'Revisar batería y alternador',
                'Verificar sistema de luces',
                'Reparar cableado defectuoso',
                'Probar sistemas eléctricos'
            ]
        },
        'infraestructura': {
            'Eléctrico': [
                'Localizar falla eléctrica',
                'Revisar cuadro de distribución',
                'Verificar cableado y conexiones',
                'Reparar componente defectuoso',
                'Probar instalación reparada'
            ],
            'Estructural': [
                'Evaluar daño estructural',
                'Revisar elementos de soporte',
                'Reparar grietas o desperfectos',
                'Aplicar tratamiento anticorrosivo',
                'Verificar estabilidad'
            ],
            'Fontanería': [
                'Localizar fuga o avería',
                'Revisar tuberías y conexiones',
                'Reparar o reemplazar componente',
                'Probar presión del sistema',
                'Verificar funcionamiento'
            ]
        }
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    mostrarPaso(1);
    // Enfocar el primer campo
    setTimeout(() => {
        document.getElementById('equipo-nuevo').focus();
    }, 300);
});

// Función para mostrar un paso específico
function mostrarPaso(numeroPaso) {
    // Ocultar todos los pasos
    document.querySelectorAll('.paso-wizard').forEach(paso => {
        paso.style.display = 'none';
    });
    
    // Mostrar el paso seleccionado
    const pasoSeleccionado = document.getElementById(`paso${numeroPaso}`);
    if (pasoSeleccionado) {
        pasoSeleccionado.style.display = 'block';
        pasoActual = numeroPaso;
    }
}

// Función para editar un paso haciendo clic en la fila del resumen
function editarPaso(numeroPaso) {
    mostrarPaso(numeroPaso);
    
    // Recargar contenido según el paso
    setTimeout(() => {
        switch(numeroPaso) {
            case 2:
                if (ordenWizardData.tipoActivo) {
                    cargarActivos(ordenWizardData.tipoActivo);
                }
                break;
            case 4:
                if (ordenWizardData.tipoMantenimiento === 'correctivo') {
                    cargarTiposAveria();
                }
                break;
            case '4_5':
                const descripcionTextarea = document.getElementById('descripcionAveria');
                const btnContinuar = document.getElementById('btnContinuarDescripcion');
                if (descripcionTextarea) {
                    descripcionTextarea.focus();
                    if (ordenWizardData.descripcionAveria) {
                        descripcionTextarea.value = ordenWizardData.descripcionAveria;
                        // Mostrar botón si ya hay contenido
                        if (ordenWizardData.descripcionAveria.length > 5) {
                            btnContinuar.style.display = 'inline-flex';
                        }
                    }
                }
                break;
            case 7:
                const fechaInicio = document.getElementById('fechaInicio');
                if (fechaInicio) {
                    fechaInicio.focus();
                }
                break;
            case 8:
                cargarTareasAutomaticas();
                break;
        }
    }, 100);
}

// PASO 1: Seleccionar tipo de activo
function seleccionarTipoActivo() {
    const select = document.getElementById('tipoActivo');
    const tipo = select.value;
    
    if (!tipo) return;
    
    // Guardar selección
    ordenWizardData.tipoActivo = tipo;
    
    // Mostrar en resumen
    document.getElementById('fila-tipo-activo').style.display = 'flex';
    const nombresTipo = {
        'maquinaria': 'Maquinaria Agrícola',
        'infraestructura': 'Infraestructura',
        'vehiculos': 'Vehículos',
        'equipos': 'Equipos Auxiliares'
    };
    document.getElementById('valor-tipo-activo').textContent = nombresTipo[tipo];
    
    // Continuar al siguiente paso
    setTimeout(() => {
        mostrarPaso(2);
        cargarActivos(tipo);
    }, 600);
}

// PASO 2: Cargar y seleccionar activo específico
function cargarActivos(tipoActivo) {
    const select = document.getElementById('activoEspecifico');
    const activos = activosPorTipo[tipoActivo] || [];
    
    // Limpiar y llenar el select
    select.innerHTML = '<option value="">Seleccionar activo...</option>';
    activos.forEach(activo => {
        const option = document.createElement('option');
        option.value = activo.id;
        option.textContent = activo.nombre;
        select.appendChild(option);
    });
}

function seleccionarActivo() {
    const select = document.getElementById('activoEspecifico');
    const id = select.value;
    
    if (!id) return;
    
    // Buscar el activo por ID
    const tipoActivo = ordenWizardData.tipoActivo;
    const activos = activosPorTipo[tipoActivo] || [];
    const activo = activos.find(a => a.id === id);
    
    if (!activo) return;
    
    // Guardar selección
    ordenWizardData.activo = { id: activo.id, nombre: activo.nombre };
    
    // Mostrar en resumen
    document.getElementById('fila-activo').style.display = 'flex';
    document.getElementById('valor-activo').innerHTML = activo.nombre;
    
    // Continuar al siguiente paso
    setTimeout(() => {
        mostrarPaso(3);
    }, 600);
}

// PASO 3: Seleccionar tipo de mantenimiento
function seleccionarTipoMantenimiento() {
    const select = document.getElementById('tipoMantenimiento');
    const tipo = select.value;
    
    if (!tipo) return;
    
    // Guardar selección
    ordenWizardData.tipoMantenimiento = tipo;
    
    // Mostrar en resumen
    document.getElementById('fila-tipo-mantenimiento').style.display = 'flex';
    const nombresTipo = {
        'preventivo': 'Mantenimiento Preventivo',
        'correctivo': 'Mantenimiento Correctivo'
    };
    document.getElementById('valor-tipo-mantenimiento').textContent = nombresTipo[tipo];
    
    // Continuar al siguiente paso
    setTimeout(() => {
        if (tipo === 'correctivo') {
            mostrarPaso(4);
            cargarTiposAveria();
        } else {
            // Si es preventivo, saltar el paso de avería
            mostrarPaso(5);
        }
    }, 600);
}

// PASO 4: Seleccionar tipo de avería (solo correctivo)
function cargarTiposAveria() {
    const select = document.getElementById('tipoAveria');
    const tipos = tiposAveria.correctivo[ordenWizardData.tipoActivo] || [];
    
    // Limpiar y llenar el select
    select.innerHTML = '<option value="">Seleccionar tipo...</option>';
    tipos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });
}

function seleccionarTipoAveria() {
    const select = document.getElementById('tipoAveria');
    const tipo = select.value;
    
    if (!tipo) return;
    
    // Guardar selección
    ordenWizardData.tipoAveria = tipo;
    
    // Mostrar en resumen
    document.getElementById('fila-tipo-averia').style.display = 'flex';
    document.getElementById('valor-tipo-averia').textContent = tipo;
    
    // Continuar al siguiente paso - ir a descripción de avería
    setTimeout(() => {
        mostrarPaso('4_5');
        document.getElementById('descripcionAveria').focus();
    }, 600);
}

// PASO 4.5: Descripción específica de la avería
function validarDescripcionAveria() {
    const textarea = document.getElementById('descripcionAveria');
    const descripcion = textarea.value.trim();
    const btnContinuar = document.getElementById('btnContinuarDescripcion');
    
    if (!descripcion) {
        btnContinuar.style.display = 'none';
        return;
    }
    
    // Guardar selección
    ordenWizardData.descripcionAveria = descripcion;
    
    // Mostrar en resumen
    document.getElementById('fila-descripcion-averia').style.display = 'flex';
    // Mostrar solo los primeros 50 caracteres en el resumen
    const resumenTexto = descripcion.length > 50 ? descripcion.substring(0, 50) + '...' : descripcion;
    document.getElementById('valor-descripcion-averia').textContent = resumenTexto;
    
    // Mostrar botón continuar si hay texto suficiente
    if (descripcion.length > 5) {
        btnContinuar.style.display = 'inline-flex';
    } else {
        btnContinuar.style.display = 'none';
    }
}

// Función para continuar desde descripción de avería a prioridad
function continuarDesdePrioridadDescripcion() {
    const descripcion = document.getElementById('descripcionAveria').value.trim();
    
    if (descripcion.length < 5) {
        alert('Por favor, añade una descripción más detallada del problema.');
        document.getElementById('descripcionAveria').focus();
        return;
    }
    
    // Asegurar que los datos están guardados
    ordenWizardData.descripcionAveria = descripcion;
    
    // Continuar al paso de prioridad
    mostrarPaso(5);
}

// PASO 5: Seleccionar prioridad
function seleccionarPrioridad() {
    const select = document.getElementById('prioridad');
    const prioridad = select.value;
    
    if (!prioridad) return;
    
    // Guardar selección
    ordenWizardData.prioridad = prioridad;
    
    // Mostrar en resumen
    document.getElementById('fila-prioridad').style.display = 'flex';
    const descripciones = {
        'Baja': 'Baja - Puede esperar',
        'Media': 'Media - Programar pronto',
        'Alta': 'Alta - Requiere atención',
        'Crítica': 'Crítica - Urgente'
    };
    document.getElementById('valor-prioridad').textContent = descripciones[prioridad];
    
    // Continuar al siguiente paso
    setTimeout(() => {
        mostrarPaso(6);
    }, 600);
}

// PASO 6: Seleccionar responsable
function seleccionarResponsable() {
    const select = document.getElementById('responsable');
    const nombre = select.value;
    
    if (!nombre) return;
    
    // Guardar selección
    ordenWizardData.responsable = nombre;
    
    // Mostrar en resumen
    document.getElementById('fila-responsable').style.display = 'flex';
    document.getElementById('valor-responsable').textContent = nombre;
    
    // Continuar al siguiente paso
    setTimeout(() => {
        mostrarPaso(7);
        // Establecer fecha mínima como hoy
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fechaInicio').min = hoy;
        document.getElementById('fechaFin').min = hoy;
        document.getElementById('fechaInicio').focus();
    }, 600);
}

// PASO 7: Fechas
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
        
        // Mostrar en el resumen
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
        
        // Continuar automáticamente al paso final
        setTimeout(() => {
            mostrarPaso(8);
        }, 300);
    }
}

// PASO 8: Cargar tareas automáticamente según selecciones
function cargarTareasAutomaticas() {
    const listaTareas = document.getElementById('lista-tareas-editables');
    
    // Determinar tareas según el tipo de mantenimiento, activo y tipo de avería
    let tareas = [];
    
    if (ordenWizardData.tipoMantenimiento && ordenWizardData.tipoActivo) {
        const tipoMant = ordenWizardData.tipoMantenimiento;
        const tipoActivo = ordenWizardData.tipoActivo;
        
        if (tipoMant === 'preventivo') {
            // Para preventivo, usar tareas generales del tipo de activo
            const tareasPreventivas = tareasPredeterminadas[tipoMant][tipoActivo];
            if (tareasPreventivas) {
                // Tomar las primeras tareas disponibles como ejemplo
                const primerTipo = Object.keys(tareasPreventivas)[0];
                tareas = tareasPreventivas[primerTipo] || [];
            }
        } else if (tipoMant === 'correctivo' && ordenWizardData.tipoAveria) {
            // Para correctivo, usar tareas específicas del tipo de avería
            const tareasCorrectivas = tareasPredeterminadas[tipoMant][tipoActivo];
            if (tareasCorrectivas && tareasCorrectivas[ordenWizardData.tipoAveria]) {
                tareas = tareasCorrectivas[ordenWizardData.tipoAveria];
            } else {
                // Tareas genéricas si no hay específicas
                tareas = [`Diagnosticar problema de ${ordenWizardData.tipoAveria}`, 'Reparar componente defectuoso', 'Probar funcionamiento'];
            }
        }
    }
    
    if (tareas.length === 0) {
        listaTareas.innerHTML = '<p class="sin-tareas">No se han cargado tareas automáticamente. Puedes añadir las que necesites.</p>';
        return;
    }
    
    // Añadir mensaje informativo sobre las tareas cargadas
    const tipoInfo = ordenWizardData.tipoMantenimiento === 'preventivo' ? 
        `mantenimiento preventivo de ${ordenWizardData.tipoActivo}` :
        `reparación de ${ordenWizardData.tipoAveria} en ${ordenWizardData.tipoActivo}`;
    
    const mensajeInfo = `<div class="tareas-info">
        <i class="fas fa-info-circle"></i> 
        Se han cargado ${tareas.length} tareas automáticamente para ${tipoInfo}. 
        Puedes editarlas, eliminarlas o añadir más.
    </div>`;
    
    listaTareas.innerHTML = mensajeInfo + tareas.map((tarea, index) => `
        <div class="tarea-item">
            <input type="checkbox" class="tarea-checkbox" checked>
            <input type="text" class="tarea-input" value="${tarea}" placeholder="Escriba la tarea...">
            <button type="button" class="btn-eliminar-tarea" onclick="eliminarTarea(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function añadirTareaNueva() {
    const listaTareas = document.getElementById('lista-tareas-editables');
    
    // Si está mostrando el mensaje de sin tareas, limpiarlo
    if (listaTareas.querySelector('.sin-tareas')) {
        listaTareas.innerHTML = '';
    }
    
    const nuevaTarea = document.createElement('div');
    nuevaTarea.className = 'tarea-item';
    nuevaTarea.innerHTML = `
        <input type="checkbox" class="tarea-checkbox" checked>
        <input type="text" class="tarea-input" value="" placeholder="Escriba la nueva tarea...">
        <button type="button" class="btn-eliminar-tarea" onclick="eliminarTarea(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    listaTareas.appendChild(nuevaTarea);
    
    // Enfocar el nuevo campo
    nuevaTarea.querySelector('.tarea-input').focus();
}

function eliminarTarea(button) {
    const tareaItem = button.closest('.tarea-item');
    const listaTareas = document.getElementById('lista-tareas-editables');
    
    tareaItem.remove();
    
    // Si no quedan tareas, mostrar mensaje
    if (listaTareas.children.length === 0) {
        listaTareas.innerHTML = '<p class="sin-tareas">Puedes seleccionar un tipo de trabajo para cargar tareas predeterminadas o dejar vacío</p>';
    }
}

// Función para crear la orden completa
function crearOrdenCompleta() {
    // Recopilar datos finales
    ordenWizardData.descripcion = document.getElementById('descripcionOrden').value;
    
    // Recopilar tareas editables
    const tareasEditables = [];
    document.querySelectorAll('.tarea-input').forEach(input => {
        if (input.value.trim()) {
            tareasEditables.push(input.value.trim());
        }
    });
    ordenWizardData.tareas = tareasEditables;
    
    // Validar datos mínimos
    if (!ordenWizardData.tipoActivo || !ordenWizardData.activo || !ordenWizardData.tipoMantenimiento || 
        !ordenWizardData.prioridad || !ordenWizardData.responsable || !ordenWizardData.fechaInicio) {
        alert('⚠️ Faltan datos obligatorios para crear la orden');
        return;
    }
    
    // Preparar datos para guardar
    const nuevaOrden = {
        activo: ordenWizardData.activo.nombre,
        tipoMantenimiento: ordenWizardData.tipoMantenimiento,
        tipoAveria: ordenWizardData.tipoAveria,
        descripcionAveria: ordenWizardData.descripcionAveria,
        prioridad: ordenWizardData.prioridad,
        responsable: ordenWizardData.responsable,
        fechaInicio: ordenWizardData.fechaInicio,
        fechaFin: ordenWizardData.fechaFin,
        tareas: ordenWizardData.tareas,
        descripcion: ordenWizardData.descripcion,
        estado: 'por-hacer',
        fechaCreacion: new Date().toISOString()
    };
    
    // Guardar en localStorage temporalmente
    const ordenesExistentes = JSON.parse(localStorage.getItem('nuevasOrdenesCreadas') || '[]');
    ordenesExistentes.push(nuevaOrden);
    localStorage.setItem('nuevasOrdenesCreadas', JSON.stringify(ordenesExistentes));
    
    console.log('Nueva orden guardada:', nuevaOrden);
    
    const tipoMantenimientoTexto = ordenWizardData.tipoMantenimiento === 'preventivo' ? 'Preventivo' : 'Correctivo';
    const tipoAveriaTexto = ordenWizardData.tipoAveria ? ` - ${ordenWizardData.tipoAveria}` : '';
    const descripcionAveriaTexto = ordenWizardData.descripcionAveria ? `\n📝 Problema: ${ordenWizardData.descripcionAveria}` : '';
    
    alert(`✅ Orden de Trabajo creada exitosamente!
    
🎯 Activo: ${ordenWizardData.activo.nombre}
🔧 Tipo: Mantenimiento ${tipoMantenimientoTexto}${tipoAveriaTexto}${descripcionAveriaTexto}
🚨 Prioridad: ${ordenWizardData.prioridad}
📅 Fecha inicio: ${new Date(ordenWizardData.fechaInicio).toLocaleDateString('es-ES')}
📅 Fecha fin: ${new Date(ordenWizardData.fechaFin).toLocaleDateString('es-ES')}
👤 Responsable: ${ordenWizardData.responsable}
📋 Tareas: ${ordenWizardData.tareas.length > 0 ? ordenWizardData.tareas.length + ' programadas' : 'Sin tareas específicas'}

Se redirigirá automáticamente al tablero de órdenes...`);
    
    // Redirigir al kanban de órdenes
    setTimeout(() => {
        window.location.href = 'ver-ordenes-trabajo.html';
    }, 2000);
}

function cancelarCreacion() {
    if (confirm('¿Estás seguro de que quieres cancelar? Se perderán todos los datos ingresados.')) {
        window.location.href = 'ver-ordenes-trabajo.html';
    }
}