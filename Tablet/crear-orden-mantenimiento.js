// Estado global de la aplicación
let currentStep = 1;
let selectedActivo = null;
let incidenciaData = {
    activo: null,
    categoria: null,
    tipo: null,
    ubicacion: {
        finca: ''
    },
    tipoIncidencia: '',
    importancia: '',
    urgencia: '',
    titulo: '',
    descripcion: '',
    archivos: [],
    timestamp: null,
    responsable: '',
    equipoApoyo: [],
    notasResponsable: '',
    plantillaTareas: '',
    tareas: [],
    descripcionTareas: ''
};

// Datos de activos
const ACTIVOS_DATA = {
    maquinaria: [
        { Activo: '12344564', CatActivo: 'Tractor', NomActivo: 'JohnDeere001', ubicacion: 'Taller Principal', estado: 'Operativo' },
        { Activo: '12344565', CatActivo: 'Cosechadora', NomActivo: 'CaseIH002', ubicacion: 'Campo Norte', estado: 'En Mantenimiento' },
        { Activo: '12344566', CatActivo: 'Pulverizador', NomActivo: 'Amazone003', ubicacion: 'Almacén B', estado: 'Operativo' },
        { Activo: '12344567', CatActivo: 'Cultivador', NomActivo: 'Lemken004', ubicacion: 'Campo Sur', estado: 'Operativo' },
        { Activo: '12344568', CatActivo: 'Sembradora', NomActivo: 'Vaderstad005', ubicacion: 'Taller Principal', estado: 'Averiado' }
    ],
    infraestructura: [
        { Activo: '23344564', CatActivo: 'Invernadero', NomActivo: 'Invernadero001', ubicacion: 'Zona A', estado: 'Operativo' },
        { Activo: '23344565', CatActivo: 'Sistema de Riego', NomActivo: 'RiegoPrincipal002', ubicacion: 'Centro', estado: 'Operativo' },
        { Activo: '23344566', CatActivo: 'Cámara Frigorífica', NomActivo: 'CamaraFrio003', ubicacion: 'Almacén Central', estado: 'En Mantenimiento' },
        { Activo: '23344567', CatActivo: 'Generador', NomActivo: 'GeneradorElec004', ubicacion: 'Sala Técnica', estado: 'Operativo' }
    ],
    vehiculos: [
        { Activo: '33344564', CatActivo: 'Furgoneta', NomActivo: 'FordTransit001', ubicacion: 'Parking', estado: 'Operativo' },
        { Activo: '33344565', CatActivo: 'Pickup', NomActivo: 'ToyotaHilux002', ubicacion: 'Campo Este', estado: 'Operativo' },
        { Activo: '33344566', CatActivo: 'Camión', NomActivo: 'MANTGS003', ubicacion: 'Muelle de Carga', estado: 'En Mantenimiento' }
    ],
    equipos: [
        { Activo: '43344564', CatActivo: 'Compresor', NomActivo: 'AtlasCopco001', ubicacion: 'Taller', estado: 'Operativo' },
        { Activo: '43344565', CatActivo: 'Soldadora', NomActivo: 'Lincoln002', ubicacion: 'Taller', estado: 'Operativo' },
        { Activo: '43344566', CatActivo: 'Bomba', NomActivo: 'Grundfos003', ubicacion: 'Pozo Norte', estado: 'Averiado' },
        { Activo: '43344567', CatActivo: 'Medidor', NomActivo: 'HannaPH004', ubicacion: 'Laboratorio', estado: 'Operativo' }
    ]
};

const FINCAS_DATA = [
    'Chañé',
    'Fuente el Olmo',
    'Toro'
];

// Opciones de título según tipo de incidencia
const TITULOS_AVERIA = [
    'Sistema Hidráulico',
    'Motor',
    'Transmisión',
    'Sistema Eléctrico',
    'Frenos',
    'Neumáticos',
    'Cabina',
    'Refrigeración',
    'Sistema de Combustible',
    'Dirección',
    'Suspensión',
    'Otro'
];

const TITULOS_MANTENIMIENTO = [
    'Revisión General',
    'Cambio de Aceite',
    'Cambio de Filtros',
    'Inspección Periódica',
    'Calibración',
    'Lubricación',
    'Limpieza Profunda',
    'Ajustes Preventivos',
    'Otro'
];

const PLANTILLAS_TAREAS = {
    'revision-general': [
        'Inspección visual del equipo',
        'Verificar niveles de fluidos',
        'Comprobar estado de conexiones',
        'Limpiar componentes principales',
        'Verificar funcionamiento general'
    ],
    'mantenimiento-preventivo': [
        'Lubricar partes móviles',
        'Cambiar filtros',
        'Ajustar tensiones y presiones',
        'Comprobar desgaste de componentes',
        'Actualizar registro de mantenimiento'
    ],
    'reparacion-electrica': [
        'Verificar continuidad de circuitos',
        'Comprobar tensiones y corrientes',
        'Revisar conexiones eléctricas',
        'Sustituir componentes defectuosos',
        'Probar funcionamiento post-reparación'
    ],
    'reparacion-mecanica': [
        'Desmontar componente averiado',
        'Inspeccionar piezas relacionadas',
        'Sustituir o reparar pieza',
        'Montar y ajustar componente',
        'Realizar pruebas de funcionamiento'
    ],
    'instalacion': [
        'Preparar área de instalación',
        'Verificar requisitos previos',
        'Instalar equipo o componente',
        'Realizar conexiones necesarias',
        'Configurar y poner en marcha'
    ],
    'personalizada': []
};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicación...');
    
    initializeEventListeners();
    initializeWizard();
    initializeData();
    
    console.log('✅ Aplicación inicializada correctamente');
});

function initializeEventListeners() {
    // Configurar selectores de activos
    setupActivoSelectors();
    
    // Configurar navegación del wizard
    setupWizardNavigation();
    
    // Configurar QR
    setupQRScanner();
    
    // Configurar upload de archivos y cámara
    setupFileUpload();
    
    // Configurar listeners de fechas y responsable
    setupFechasYResponsable();
    
    // Configurar equipo de apoyo
    setupEquipoApoyo();
    
    // Configurar tareas
    setupTareas();
}

function setupFechasYResponsable() {
    // Listeners para fechas (Paso 7)
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    
    if (fechaInicio) {
        fechaInicio.addEventListener('change', function() {
            console.log('📅 Fecha inicio cambiada:', this.value);
            updateNextButtonState(7);
        });
    }
    
    if (fechaFin) {
        fechaFin.addEventListener('change', function() {
            console.log('📅 Fecha fin cambiada:', this.value);
            updateNextButtonState(7);
        });
    }
    
    // Listener para responsable (Paso 8)
    const responsableSelect = document.getElementById('responsable-select');
    if (responsableSelect) {
        responsableSelect.addEventListener('change', function() {
            console.log('👤 Responsable seleccionado:', this.value);
            updateNextButtonState(8);
        });
    }
}

function setupEquipoApoyo() {
    const equipoApoyoSelect = document.getElementById('equipo-apoyo-select');
    const equipoApoyoList = document.getElementById('equipo-apoyo-list');
    
    if (!equipoApoyoSelect || !equipoApoyoList) return;
    
    equipoApoyoSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        const selectedText = this.options[this.selectedIndex].text;
        
        if (selectedValue && !incidenciaData.equipoApoyo.includes(selectedValue)) {
            // Añadir al array
            incidenciaData.equipoApoyo.push(selectedValue);
            
            // Crear tag visual
            const tag = document.createElement('div');
            tag.className = 'tecnico-tag';
            tag.dataset.value = selectedValue;
            tag.innerHTML = `
                ${selectedText}
                <span class="remove-tecnico" onclick="removeTecnico('${selectedValue}')">×</span>
            `;
            
            equipoApoyoList.appendChild(tag);
            console.log('👥 Técnico añadido al equipo:', selectedText);
        }
        
        // Resetear selector
        this.value = '';
    });
}

function removeTecnico(value) {
    // Eliminar del array
    const index = incidenciaData.equipoApoyo.indexOf(value);
    if (index > -1) {
        incidenciaData.equipoApoyo.splice(index, 1);
    }
    
    // Eliminar tag visual
    const equipoApoyoList = document.getElementById('equipo-apoyo-list');
    const tag = equipoApoyoList.querySelector(`[data-value="${value}"]`);
    if (tag) {
        tag.remove();
    }
    
    console.log('👥 Técnico eliminado del equipo:', value);
}

function setupTareas() {
    const plantillaTareas = document.getElementById('plantilla-tareas');
    const tareasContainer = document.getElementById('tareas-container');
    const descripcionTareasGroup = document.getElementById('descripcion-tareas-group');
    const btnAddTarea = document.getElementById('btn-add-tarea');
    
    if (!plantillaTareas) return;
    
    // Listener para cambio de plantilla
    plantillaTareas.addEventListener('change', function() {
        const plantilla = this.value;
        incidenciaData.plantillaTareas = plantilla;
        
        console.log('📋 Plantilla seleccionada:', plantilla);
        
        if (plantilla) {
            tareasContainer.style.display = 'block';
            descripcionTareasGroup.style.display = 'block';
            
            // Cargar tareas de la plantilla
            const tareas = PLANTILLAS_TAREAS[plantilla] || [];
            cargarTareasPlantilla(tareas);
            
            updateNextButtonState(9);
        } else {
            tareasContainer.style.display = 'none';
            descripcionTareasGroup.style.display = 'none';
        }
    });
    
    // Listener para añadir tarea
    if (btnAddTarea) {
        btnAddTarea.addEventListener('click', function() {
            agregarTarea('');
        });
    }
    
    // Listener para descripción
    const descripcionTareas = document.getElementById('descripcion-tareas');
    if (descripcionTareas) {
        descripcionTareas.addEventListener('input', function() {
            incidenciaData.descripcionTareas = this.value;
        });
    }
}

function cargarTareasPlantilla(tareas) {
    const tareasList = document.getElementById('tareas-list');
    if (!tareasList) return;
    
    tareasList.innerHTML = '';
    incidenciaData.tareas = [];
    
    tareas.forEach(tarea => {
        agregarTarea(tarea);
    });
}

function agregarTarea(textoTarea = '') {
    const tareasList = document.getElementById('tareas-list');
    if (!tareasList) return;
    
    const tareaItem = document.createElement('div');
    tareaItem.className = 'tarea-item';
    
    const tareaId = Date.now() + Math.random();
    tareaItem.dataset.id = tareaId;
    
    tareaItem.innerHTML = `
        <input type="checkbox" class="tarea-checkbox" ${textoTarea ? '' : 'checked'}>
        <input type="text" class="tarea-input" value="${textoTarea}" placeholder="Descripción de la tarea...">
        <button class="tarea-remove" onclick="eliminarTarea('${tareaId}')">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    tareasList.appendChild(tareaItem);
    
    // Añadir al array
    incidenciaData.tareas.push({
        id: tareaId,
        descripcion: textoTarea,
        completada: false
    });
    
    // Listener para el input
    const input = tareaItem.querySelector('.tarea-input');
    input.addEventListener('input', function() {
        const tarea = incidenciaData.tareas.find(t => t.id == tareaId);
        if (tarea) {
            tarea.descripcion = this.value;
        }
    });
    
    // Listener para el checkbox
    const checkbox = tareaItem.querySelector('.tarea-checkbox');
    checkbox.addEventListener('change', function() {
        const tarea = incidenciaData.tareas.find(t => t.id == tareaId);
        if (tarea) {
            tarea.completada = this.checked;
        }
    });
}

function eliminarTarea(tareaId) {
    // Eliminar del array
    const index = incidenciaData.tareas.findIndex(t => t.id == tareaId);
    if (index > -1) {
        incidenciaData.tareas.splice(index, 1);
    }
    
    // Eliminar del DOM
    const tareaItem = document.querySelector(`[data-id="${tareaId}"]`);
    if (tareaItem) {
        tareaItem.remove();
    }
    
    console.log('🗑️ Tarea eliminada');
}

function setupActivoSelectors() {
    const categoriaSelect = document.getElementById('categoria-select');
    const tipoSelect = document.getElementById('tipo-select');
    const activoSelect = document.getElementById('activo-select');
    const tipoGroup = document.getElementById('tipo-group');
    const activoGroup = document.getElementById('activo-group');
    
    if (categoriaSelect) {
        categoriaSelect.addEventListener('change', function() {
            console.log('📌 PASO 1: Categoría seleccionada =', this.value);
            incidenciaData.categoria = this.value;
            
            if (this.value) {
                // Mostrar selector de tipo y poblarlo
                showTipoSelector(this.value);
                // Ocultar selector de activo hasta que se seleccione tipo
                hideActivoSelector();
            } else {
                // Si no hay categoría, ocultar ambos
                hideTipoSelector();
                hideActivoSelector();
            }
        });
    }
    
    if (tipoSelect) {
        tipoSelect.addEventListener('change', function() {
            console.log('📌 PASO 2: Tipo seleccionado =', this.value);
            incidenciaData.tipo = this.value;
            
            if (this.value && incidenciaData.categoria) {
                // Mostrar selector de activo y poblarlo
                showActivoSelector(incidenciaData.categoria, this.value);
            } else {
                hideActivoSelector();
            }
        });
    }
    
    if (activoSelect) {
        activoSelect.addEventListener('change', function() {
            console.log('📌 PASO 3: Activo seleccionado =', this.value);
            incidenciaData.activo = this.value;
            
            if (this.value) {
                // Buscar información completa del activo
                const activo = findActivoById(this.value);
                if (activo) {
                    selectedActivo = activo;
                    showActivoInfo(activo);
                    
                    // Actualizar botones de navegación
                    updateNavigationButtons(currentStep);
                    
                    // Opcionalmente avanzar automáticamente (comentado para control manual)
                    // setTimeout(() => {
                    //     nextStep();
                    // }, 1000);
                }
            }
        });
    }
}

function findActivoById(id) {
    for (const categoria in ACTIVOS_DATA) {
        const activo = ACTIVOS_DATA[categoria].find(a => a.Activo === id);
        if (activo) {
            return { ...activo, categoria };
        }
    }
    return null;
}

function showActivoInfo(activo) {
    const activoInfo = document.getElementById('activo-info');
    const activoNombre = document.getElementById('activo-nombre');
    const activoId = document.getElementById('activo-id');
    const activoTipo = document.getElementById('activo-tipo');
    
    if (activoInfo && activoNombre && activoId && activoTipo) {
        activoNombre.textContent = activo.NomActivo;
        activoId.textContent = activo.Activo;
        activoTipo.textContent = activo.CatActivo;
        
        activoInfo.style.display = 'block';
    }
}

function showTipoSelector(categoria) {
    const tipoGroup = document.getElementById('tipo-group');
    const tipoSelect = document.getElementById('tipo-select');
    
    if (tipoGroup && tipoSelect) {
        // Mostrar el grupo
        tipoGroup.style.display = 'flex';
        tipoSelect.disabled = false;
        
        // Poblar con tipos de la categoría seleccionada
        tipoSelect.innerHTML = '<option value="">Seleccionar tipo...</option>';
        
        if (ACTIVOS_DATA[categoria]) {
            const tipos = [...new Set(ACTIVOS_DATA[categoria].map(activo => activo.CatActivo))];
            tipos.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo;
                option.textContent = tipo;
                tipoSelect.appendChild(option);
            });
        }
        
        console.log('✨ Selector de tipo mostrado para:', categoria);
    }
}

function hideTipoSelector() {
    const tipoGroup = document.getElementById('tipo-group');
    const tipoSelect = document.getElementById('tipo-select');
    
    if (tipoGroup && tipoSelect) {
        tipoGroup.style.display = 'none';
        tipoSelect.disabled = true;
        tipoSelect.value = '';
        incidenciaData.tipo = null;
    }
}

function showActivoSelector(categoria, tipo) {
    const activoGroup = document.getElementById('activo-group');
    const activoSelect = document.getElementById('activo-select');
    
    if (activoGroup && activoSelect) {
        // Mostrar el grupo
        activoGroup.style.display = 'flex';
        activoSelect.disabled = false;
        
        // Poblar con activos filtrados por categoría y tipo
        activoSelect.innerHTML = '<option value="">Seleccionar activo...</option>';
        
        if (ACTIVOS_DATA[categoria]) {
            const activosFiltrados = ACTIVOS_DATA[categoria].filter(activo => activo.CatActivo === tipo);
            activosFiltrados.forEach(activo => {
                const option = document.createElement('option');
                option.value = activo.Activo;
                option.textContent = activo.NomActivo;
                activoSelect.appendChild(option);
            });
        }
        
        console.log('✨ Selector de activo mostrado para:', categoria, '-', tipo);
    }
}

function hideActivoSelector() {
    const activoGroup = document.getElementById('activo-group');
    const activoSelect = document.getElementById('activo-select');
    
    if (activoGroup && activoSelect) {
        activoGroup.style.display = 'none';
        activoSelect.disabled = true;
        activoSelect.value = '';
        incidenciaData.activo = null;
        clearSelectedActivo();
    }
}

function clearSelectedActivo() {
    selectedActivo = null;
    incidenciaData.activo = null;
    
    const activoInfo = document.getElementById('activo-info');
    if (activoInfo) {
        activoInfo.style.display = 'none';
    }
}

function setupWizardNavigation() {
    // Configurar botones de cada paso individualmente
    for (let step = 1; step <= 9; step++) {
        const prevBtn = document.getElementById(`prev-btn-${step}`);
        const nextBtn = document.getElementById(`next-btn-${step}`);
        
        if (prevBtn) {
            prevBtn.addEventListener('click', previousStep);
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', nextStep);
        }
    }
    
    // Configurar botón de finalizar
    const finishBtn = document.getElementById('finish-btn');
    if (finishBtn) finishBtn.addEventListener('click', finishIncidencia);
    
    console.log('✅ Event listeners de navegación configurados para todos los pasos');
}

function setupQRScanner() {
    const qrBtn = document.getElementById('qr-btn');
    if (qrBtn) {
        qrBtn.addEventListener('click', openQRScanner);
    }
    
    // Configurar cierre del modal al hacer clic fuera
    const qrModal = document.getElementById('qr-modal');
    if (qrModal) {
        qrModal.addEventListener('click', function(event) {
            if (event.target === qrModal) {
                cerrarEscanerQR();
            }
        });
    }
}

function initializeWizard() {
    showStep(1);
    updateProgress();
    updateNavbarButton();
}

function initializeData() {
    // Poblar selector de fincas si existe
    populateFincaSelector();
    
    // Configurar ubicación automática
    setupUbicacionAutomatica();
    
    // Configurar event listeners para otros pasos
    setupOtherStepsListeners();
}

function setupOtherStepsListeners() {
    // Paso 2 - Ubicación
    setupUbicacionListeners();
    
    // Paso 3 - Tipo de incidencia
    document.querySelectorAll('.tipo-card').forEach(card => {
        card.addEventListener('click', function() {
            // Desseleccionar todas las tarjetas
            document.querySelectorAll('.tipo-card').forEach(c => c.classList.remove('selected'));
            // Seleccionar la tarjeta clickeada
            this.classList.add('selected');
            
            // Seleccionar el radio button correspondiente
            const input = this.querySelector('input[type="radio"]');
            input.checked = true;
            incidenciaData.tipoIncidencia = input.value;
            
            // Actualizar el paso 5 según el tipo seleccionado
            updateTituloField(input.value);
            
            updateNavigationButtons(currentStep);
        });
    });
    
    // Paso 4 - Importancia
    document.querySelectorAll('.importancia-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Desmarcar todos los botones
            document.querySelectorAll('.importancia-btn').forEach(b => b.classList.remove('selected'));
            // Marcar el seleccionado
            this.classList.add('selected');
            
            incidenciaData.importancia = this.dataset.level;
            updateNavigationButtons(currentStep);
        });
    });
    
    document.querySelectorAll('input[name="urgencia"]').forEach(radio => {
        radio.addEventListener('change', function() {
            incidenciaData.urgencia = this.value;
        });
    });
    
    // Paso 5 - Descripción
    setupDescripcionListeners();
}

function setupUbicacionAutomatica() {
    // Mock: Ubicación actual detectada automáticamente
    const ubicacionActual = 'Fuente el Olmo';
    incidenciaData.ubicacion.finca = ubicacionActual;
    
    const ubicacionActualElement = document.getElementById('ubicacion-actual');
    if (ubicacionActualElement) {
        ubicacionActualElement.textContent = ubicacionActual;
    }
}

function setupUbicacionListeners() {
    const btnCambiarUbicacion = document.getElementById('btn-cambiar-ubicacion');
    const btnConfirmarUbicacion = document.getElementById('btn-confirmar-ubicacion');
    const ubicacionDetectada = document.getElementById('ubicacion-detectada');
    const selectorUbicacion = document.getElementById('selector-ubicacion');
    const fincaSelect = document.getElementById('finca-select');
    
    if (btnCambiarUbicacion) {
        btnCambiarUbicacion.addEventListener('click', function() {
            // Ocultar card de ubicación detectada
            if (ubicacionDetectada) ubicacionDetectada.style.display = 'none';
            // Mostrar selector
            if (selectorUbicacion) selectorUbicacion.style.display = 'block';
            // Pre-seleccionar la ubicación actual
            if (fincaSelect && incidenciaData.ubicacion.finca) {
                fincaSelect.value = incidenciaData.ubicacion.finca;
            }
        });
    }
    
    if (btnConfirmarUbicacion) {
        btnConfirmarUbicacion.addEventListener('click', function() {
            if (fincaSelect && fincaSelect.value) {
                incidenciaData.ubicacion.finca = fincaSelect.value;
                
                // Actualizar texto de ubicación detectada
                const ubicacionActualElement = document.getElementById('ubicacion-actual');
                if (ubicacionActualElement) {
                    ubicacionActualElement.textContent = fincaSelect.value;
                }
                
                // Volver a mostrar card de ubicación
                if (ubicacionDetectada) ubicacionDetectada.style.display = 'block';
                if (selectorUbicacion) selectorUbicacion.style.display = 'none';
                
                updateNavigationButtons(currentStep);
            } else {
                alert('Por favor, selecciona una finca.');
            }
        });
    }
    
    if (fincaSelect) {
        fincaSelect.addEventListener('change', function() {
            // Solo actualizar, no confirmar automáticamente
            const btnConfirmar = document.getElementById('btn-confirmar-ubicacion');
            if (btnConfirmar) {
                btnConfirmar.disabled = !this.value;
            }
        });
    }
}

function updateTituloField(tipoIncidencia) {
    const tituloInput = document.getElementById('titulo-incidencia');
    const tituloSelect = document.getElementById('titulo-incidencia-select');
    const labelTitulo = document.getElementById('label-titulo-incidencia');
    
    if (!tituloInput || !tituloSelect || !labelTitulo) return;
    
    // Limpiar event listeners previos
    const newTituloInput = tituloInput.cloneNode(true);
    const newTituloSelect = tituloSelect.cloneNode(true);
    tituloInput.parentNode.replaceChild(newTituloInput, tituloInput);
    tituloSelect.parentNode.replaceChild(newTituloSelect, tituloSelect);
    
    if (tipoIncidencia === 'mantenimiento-correctivo') {
        // Mostrar desplegable para mantenimiento correctivo
        newTituloInput.style.display = 'none';
        newTituloSelect.style.display = 'block';
        labelTitulo.textContent = 'Tipo de Problema';
        
        // Poblar opciones
        newTituloSelect.innerHTML = '<option value="">Seleccionar tipo de problema...</option>';
        TITULOS_AVERIA.forEach(titulo => {
            const option = document.createElement('option');
            option.value = titulo;
            option.textContent = titulo;
            newTituloSelect.appendChild(option);
        });
        
        // Event listener para el select
        newTituloSelect.addEventListener('change', function() {
            incidenciaData.titulo = this.value;
            updateNavigationButtons(5);
        });
        
    } else if (tipoIncidencia === 'mantenimiento-preventivo') {
        // Mostrar desplegable para mantenimiento preventivo
        newTituloInput.style.display = 'none';
        newTituloSelect.style.display = 'block';
        labelTitulo.textContent = 'Tipo de Mantenimiento';
        
        // Poblar opciones
        newTituloSelect.innerHTML = '<option value="">Seleccionar tipo de mantenimiento...</option>';
        TITULOS_MANTENIMIENTO.forEach(titulo => {
            const option = document.createElement('option');
            option.value = titulo;
            option.textContent = titulo;
            newTituloSelect.appendChild(option);
        });
        
        // Event listener para el select
        newTituloSelect.addEventListener('change', function() {
            incidenciaData.titulo = this.value;
            updateNavigationButtons(5);
        });
        
    } else {
        // Para construcción u otros, mostrar input de texto libre
        newTituloInput.style.display = 'block';
        newTituloSelect.style.display = 'none';
        labelTitulo.textContent = 'Título de la orden';
        
        // Event listener para el input
        newTituloInput.addEventListener('input', function() {
            incidenciaData.titulo = this.value;
            updateNavigationButtons(5);
            
            // Actualizar contador de caracteres
            const counter = document.getElementById('titulo-counter');
            if (counter) {
                counter.textContent = `${this.value.length}/100`;
                counter.style.display = 'block';
            }
        });
    }
}

function setupDescripcionListeners() {
    const descripcionTextarea = document.getElementById('descripcion-textarea');
    if (descripcionTextarea) {
        descripcionTextarea.addEventListener('input', function() {
            incidenciaData.descripcion = this.value;
            updateNavigationButtons(currentStep);
        });
    }
}

function populateFincaSelector() {
    const fincaSelect = document.getElementById('finca-select');
    if (fincaSelect) {
        fincaSelect.innerHTML = '<option value="">Seleccionar finca...</option>';
        
        FINCAS_DATA.forEach(finca => {
            const option = document.createElement('option');
            option.value = finca;
            option.textContent = finca;
            fincaSelect.appendChild(option);
        });
    }
}

// Funciones de navegación del wizard
function showStep(step) {
    document.querySelectorAll('.wizard-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    const currentStepEl = document.getElementById(`step-${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    updateNavigationButtons(step);
    updateNavbarButton();
    currentStep = step;
}

function updateNavigationButtons(step) {
    console.log('🔄 Actualizando botones para paso:', step);
    
    // Ocultar todos los botones primero
    for (let i = 1; i <= 8; i++) {
        const prevBtn = document.getElementById(`prev-btn-${i}`);
        const nextBtn = document.getElementById(`next-btn-${i}`);
        
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
    
    const finishBtn = document.getElementById('finish-btn');
    if (finishBtn) finishBtn.style.display = 'none';
    
    // Mostrar botones del paso actual
    if (step < 9) {
        const prevBtn = document.getElementById(`prev-btn-${step}`);
        const nextBtn = document.getElementById(`next-btn-${step}`);
        
        // Mostrar botón anterior solo si no es el primer paso
        if (prevBtn && step > 1) {
            prevBtn.style.display = 'flex';
        }
        
        // Mostrar botón siguiente
        if (nextBtn) {
            nextBtn.style.display = 'flex';
            // En paso 1, ocultar hasta que se seleccione activo
            if (step === 1) {
                nextBtn.style.display = selectedActivo ? 'flex' : 'none';
            }
        }
    } else {
        // Último paso - mostrar botón anterior y finalizar
        const prevBtn = document.getElementById(`prev-btn-${step}`);
        if (prevBtn) prevBtn.style.display = 'flex';
        if (finishBtn) finishBtn.style.display = 'flex';
    }
    
    // Verificar si se puede continuar
    updateNextButtonState(step);
}

function updateNextButtonState(step) {
    let canContinue = false;
    
    switch (step) {
        case 1:
            // Paso 1: Necesita activo seleccionado
            canContinue = selectedActivo !== null;
            const nextBtn1 = document.getElementById('next-btn-1');
            if (nextBtn1) {
                nextBtn1.disabled = !canContinue;
                nextBtn1.style.opacity = canContinue ? '1' : '0.5';
                nextBtn1.style.display = canContinue ? 'flex' : 'none';
            }
            break;
        case 2:
            // Paso 2: Siempre puede continuar (ubicación ya está detectada)
            canContinue = incidenciaData.ubicacion.finca !== '';
            const nextBtn2 = document.getElementById('next-btn-2');
            if (nextBtn2) {
                nextBtn2.disabled = !canContinue;
                nextBtn2.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 3:
            // Paso 3: Necesita solo tipo de incidencia
            canContinue = incidenciaData.tipoIncidencia !== '';
            const nextBtn3 = document.getElementById('next-btn-3');
            if (nextBtn3) {
                nextBtn3.disabled = !canContinue;
                nextBtn3.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 4:
            // Paso 4: Necesita importancia
            canContinue = incidenciaData.importancia !== '';
            const nextBtn4 = document.getElementById('next-btn-4');
            if (nextBtn4) {
                nextBtn4.disabled = !canContinue;
                nextBtn4.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 5:
            // Paso 5: Necesita título (select o input) y descripción
            const tituloSelect = document.getElementById('titulo-incidencia-select');
            const tituloInput = document.getElementById('titulo-incidencia');
            let tieneTitulo = false;
            
            if (tituloSelect && tituloSelect.style.display !== 'none') {
                tieneTitulo = tituloSelect.value !== '';
            } else if (tituloInput && tituloInput.style.display !== 'none') {
                tieneTitulo = tituloInput.value.trim() !== '';
            }
            
            canContinue = tieneTitulo && incidenciaData.descripcion.trim() !== '';
            const nextBtn5 = document.getElementById('next-btn-5');
            if (nextBtn5) {
                nextBtn5.disabled = !canContinue;
                nextBtn5.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 6:
            // Adjuntos es opcional - siempre se puede continuar
            canContinue = true;
            const nextBtn6 = document.getElementById('next-btn-6');
            if (nextBtn6) {
                nextBtn6.disabled = false;
                nextBtn6.style.opacity = '1';
            }
            break;
        case 7:
            // Validar que al menos la fecha de inicio esté seleccionada
            const fechaInicio = document.getElementById('fecha-inicio');
            canContinue = fechaInicio && fechaInicio.value !== '';
            const nextBtn7 = document.getElementById('next-btn-7');
            if (nextBtn7) {
                nextBtn7.disabled = !canContinue;
                nextBtn7.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 8:
            // Paso 8 - validar que haya responsable
            const responsable = document.getElementById('responsable-select');
            canContinue = responsable && responsable.value !== '';
            const nextBtn8 = document.getElementById('next-btn-8');
            if (nextBtn8) {
                nextBtn8.disabled = !canContinue;
                nextBtn8.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 9:
            // Último paso - validar que haya plantilla seleccionada
            const plantillaTareas = document.getElementById('plantilla-tareas');
            canContinue = plantillaTareas && plantillaTareas.value !== '';
            const finishBtn = document.getElementById('finish-btn');
            if (finishBtn) {
                finishBtn.disabled = !canContinue;
                finishBtn.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
    }
    
    console.log('✅ Paso', step, '- Puede continuar:', canContinue);
}

function updateProgress() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });
}

function nextStep() {
    console.log('➡️ Intentando avanzar desde paso:', currentStep);
    
    // Validar si se puede avanzar
    let canAdvance = false;
    
    switch (currentStep) {
        case 1:
            canAdvance = selectedActivo !== null;
            if (!canAdvance) {
                alert('Por favor, selecciona un activo antes de continuar.');
                return;
            }
            break;
        case 2:
            canAdvance = incidenciaData.ubicacion.finca !== '';
            if (!canAdvance) {
                alert('Por favor, selecciona una finca antes de continuar.');
                return;
            }
            break;
        case 3:
            canAdvance = incidenciaData.tipoIncidencia !== '';
            if (!canAdvance) {
                alert('Por favor, selecciona el tipo de incidencia.');
                return;
            }
            break;
        case 4:
            canAdvance = incidenciaData.importancia !== '';
            if (!canAdvance) {
                alert('Por favor, selecciona el nivel de importancia.');
                return;
            }
            break;
        case 5:
            canAdvance = incidenciaData.descripcion.trim() !== '';
            // También verificar título si es mantenimiento correctivo o preventivo
            if (incidenciaData.tipoIncidencia === 'mantenimiento-correctivo' || incidenciaData.tipoIncidencia === 'mantenimiento-preventivo') {
                canAdvance = canAdvance && incidenciaData.titulo !== '';
            }
            if (!canAdvance) {
                if (incidenciaData.tipoIncidencia === 'mantenimiento-correctivo' || incidenciaData.tipoIncidencia === 'mantenimiento-preventivo') {
                    alert('Por favor, selecciona el tipo y proporciona una descripción del trabajo.');
                } else {
                    alert('Por favor, proporciona un título y descripción del trabajo.');
                }
                return;
            }
            break;
        case 6:
            // Adjuntos es opcional
            canAdvance = true;
            break;
        case 7:
            // Validar fechas
            const fechaInicio = document.getElementById('fecha-inicio');
            canAdvance = fechaInicio && fechaInicio.value !== '';
            if (!canAdvance) {
                alert('Por favor, selecciona al menos la fecha de inicio.');
                return;
            }
            break;
        case 8:
            // Validar responsable
            const responsable = document.getElementById('responsable-select');
            canAdvance = responsable && responsable.value !== '';
            if (!canAdvance) {
                alert('Por favor, selecciona un técnico responsable.');
                return;
            }
            break;
        case 9:
            // Validar plantilla de tareas
            const plantillaTareas = document.getElementById('plantilla-tareas');
            canAdvance = plantillaTareas && plantillaTareas.value !== '';
            if (!canAdvance) {
                alert('Por favor, selecciona una plantilla de tareas.');
                return;
            }
            break;
    }
    
    if (currentStep < 9 && canAdvance) {
        showStep(currentStep + 1);
        updateProgress();
        console.log('✅ Avanzado al paso:', currentStep);
    }
}

function previousStep() {
    console.log('⬅️ Retrocediendo desde paso:', currentStep);
    
    if (currentStep > 1) {
        showStep(currentStep - 1);
        updateProgress();
        
        // Restaurar estado del paso anterior según sea necesario
        restoreStepState(currentStep);
        
        console.log('✅ Retrocedido al paso:', currentStep);
    }
}

function restoreStepState(step) {
    // Restaurar estado específico de cada paso cuando se retrocede
    switch (step) {
        case 1:
            // Restaurar selecciones de activo
            if (incidenciaData.categoria) {
                const categoriaSelect = document.getElementById('categoria-select');
                if (categoriaSelect) {
                    categoriaSelect.value = incidenciaData.categoria;
                    showTipoSelector(incidenciaData.categoria);
                    
                    if (incidenciaData.tipo) {
                        setTimeout(() => {
                            const tipoSelect = document.getElementById('tipo-select');
                            if (tipoSelect) {
                                tipoSelect.value = incidenciaData.tipo;
                                showActivoSelector(incidenciaData.categoria, incidenciaData.tipo);
                                
                                if (incidenciaData.activo) {
                                    setTimeout(() => {
                                        const activoSelect = document.getElementById('activo-select');
                                        if (activoSelect) {
                                            activoSelect.value = incidenciaData.activo;
                                            const activo = findActivoById(incidenciaData.activo);
                                            if (activo) {
                                                selectedActivo = activo;
                                                showActivoInfo(activo);
                                            }
                                        }
                                    }, 100);
                                }
                            }
                        }, 100);
                    }
                }
            }
            break;
        case 2:
            // Restaurar selección de finca
            if (incidenciaData.ubicacion.finca) {
                const fincaSelect = document.getElementById('finca-select');
                if (fincaSelect) {
                    fincaSelect.value = incidenciaData.ubicacion.finca;
                }
            }
            break;
        case 3:
            // Restaurar tipo de incidencia
            // Los radio buttons ya mantienen su estado
            break;
        case 4:
            // Restaurar importancia
            if (incidenciaData.importancia) {
                const importanciaBtn = document.querySelector(`.importancia-btn[data-level="${incidenciaData.importancia}"]`);
                if (importanciaBtn) {
                    document.querySelectorAll('.importancia-btn').forEach(btn => btn.classList.remove('selected'));
                    importanciaBtn.classList.add('selected');
                }
            }
            break;
        case 5:
            // Restaurar descripción y título
            const descripcionTextarea = document.getElementById('descripcion-textarea');
            if (descripcionTextarea && incidenciaData.descripcion) {
                descripcionTextarea.value = incidenciaData.descripcion;
            }
            
            // Restaurar título según el tipo de incidencia
            if (incidenciaData.tipoIncidencia) {
                updateTituloField(incidenciaData.tipoIncidencia);
                
                setTimeout(() => {
                    if (incidenciaData.titulo) {
                        const tituloSelect = document.getElementById('titulo-incidencia-select');
                        const tituloInput = document.getElementById('titulo-incidencia');
                        
                        if (tituloSelect && tituloSelect.style.display !== 'none') {
                            tituloSelect.value = incidenciaData.titulo;
                        } else if (tituloInput && tituloInput.style.display !== 'none') {
                            tituloInput.value = incidenciaData.titulo;
                            const counter = document.getElementById('titulo-counter');
                            if (counter) {
                                counter.textContent = `${incidenciaData.titulo.length}/100`;
                            }
                        }
                    }
                }, 100);
            }
            break;
        case 6:
            // Paso de adjuntos - no necesita restauración especial
            break;
    }
}

let qrScanner = null;

function openQRScanner() {
    console.log('🔍 Abriendo escáner QR...');
    const qrModal = document.getElementById('qr-modal');
    const qrReader = document.getElementById('qr-reader');
    
    if (qrModal && qrReader) {
        qrModal.style.display = 'block';
        
        // Crear instancia del escáner con cámara trasera
        qrScanner = new Html5Qrcode('qr-reader');
        
        // Configuración para cámara trasera
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };
        
        // Intentar usar cámara trasera primero, si no existe usar la disponible
        qrScanner.start(
            { facingMode: "environment" }, // Cámara trasera
            config,
            (decodedText, decodedResult) => {
                console.log('✅ QR escaneado:', decodedText);
                processQRData(decodedText);
                cerrarEscanerQR();
            },
            (error) => {
                // Error de escaneo - no hacer nada para evitar spam de logs
            }
        ).catch(err => {
            console.error('Error al iniciar cámara:', err);
            alert('No se pudo acceder a la cámara. Verifica los permisos.');
            cerrarEscanerQR();
        });
        
        // Configurar botón de prueba
        const testBtn = document.getElementById('test-qr-btn');
        if (testBtn) {
            testBtn.onclick = () => {
                const testData = {
                    "categoria_activo": "maquinaria",
                    "tipo_activo": "Tractor",
                    "activo": "12344564"
                };
                processQRData(JSON.stringify(testData));
                cerrarEscanerQR();
            };
        }
    }
}

function cerrarEscanerQR() {
    const qrModal = document.getElementById('qr-modal');
    if (qrModal) {
        qrModal.style.display = 'none';
    }
    
    // Detener el escáner si existe
    if (qrScanner) {
        qrScanner.clear().then(() => {
            console.log('🛑 Escáner QR detenido');
        }).catch(error => {
            console.error('Error al detener escáner:', error);
        });
        qrScanner = null;
    }
}

function processQRData(qrData) {
    try {
        console.log('📊 Procesando datos QR:', qrData);
        
        // Intentar parsear como JSON
        let data;
        try {
            data = JSON.parse(qrData);
        } catch (e) {
            throw new Error('QR no contiene JSON válido');
        }
        
        // Validar que contiene los campos necesarios
        if (!data.categoria_activo || !data.tipo_activo || !data.activo) {
            throw new Error('QR no contiene los campos requeridos (categoria_activo, tipo_activo, activo)');
        }
        
        // Normalizar la categoría al formato esperado
        const categoriaMap = {
            'Maquinaria': 'maquinaria',
            'maquinaria': 'maquinaria',
            'Infraestructura': 'infraestructura', 
            'infraestructura': 'infraestructura',
            'Vehiculos': 'vehiculos',
            'Vehículos': 'vehiculos',
            'vehiculos': 'vehiculos',
            'Equipos': 'equipos',
            'equipos': 'equipos'
        };
        
        const categoriaNormalizada = categoriaMap[data.categoria_activo];
        if (!categoriaNormalizada) {
            throw new Error(`Categoría no reconocida: ${data.categoria_activo}`);
        }
        
        // Rellenar selectores automáticamente
        fillSelectorsFromQR(categoriaNormalizada, data.tipo_activo, data.activo);
        
        // Mostrar mensaje de éxito
        showQRSuccess(data);
        
    } catch (error) {
        console.error('❌ Error procesando QR:', error);
        alert(`Error al procesar código QR: ${error.message}`);
    }
}

function fillSelectorsFromQR(categoria, tipo, activoId) {
    console.log('🔄 Rellenando selectores desde QR:', { categoria, tipo, activoId });
    
    // 1. Seleccionar categoría
    const categoriaSelect = document.getElementById('categoria-select');
    if (categoriaSelect) {
        categoriaSelect.value = categoria;
        incidenciaData.categoria = categoria;
        
        // Mostrar selector de tipo
        showTipoSelector(categoria);
        
        // 2. Esperar un poco y seleccionar tipo
        setTimeout(() => {
            const tipoSelect = document.getElementById('tipo-select');
            if (tipoSelect) {
                // Buscar la opción que coincida con el tipo
                for (let option of tipoSelect.options) {
                    if (option.textContent.toLowerCase().includes(tipo.toLowerCase()) || 
                        option.value.toLowerCase().includes(tipo.toLowerCase())) {
                        tipoSelect.value = option.value;
                        incidenciaData.tipo = option.value;
                        
                        // Mostrar selector de activo
                        showActivoSelector(categoria, option.value);
                        
                        // 3. Esperar un poco más y seleccionar activo específico
                        setTimeout(() => {
                            const activoSelect = document.getElementById('activo-select');
                            if (activoSelect) {
                                // Buscar el activo por ID
                                for (let option of activoSelect.options) {
                                    if (option.value === activoId) {
                                        activoSelect.value = activoId;
                                        incidenciaData.activo = activoId;
                                        
                                        // Buscar los datos completos del activo
                                        const activo = findActivoById(activoId);
                                        if (activo) {
                                            selectedActivo = activo;
                                            showActivoInfo(activo);
                                            updateNavigationButtons(1);
                                        }
                                        
                                        console.log('✅ Activo seleccionado desde QR:', activoId);
                                        break;
                                    }
                                }
                                
                                if (!activoSelect.value) {
                                    console.warn('⚠️ No se encontró el activo en la lista:', activoId);
                                }
                            }
                        }, 200);
                        
                        break;
                    }
                }
                
                if (!tipoSelect.value) {
                    console.warn('⚠️ No se encontró el tipo en la lista:', tipo);
                }
            }
        }, 200);
    }
}

function showQRSuccess(data) {
    // Crear elemento de notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i> 
        QR escaneado correctamente<br>
        <small>${data.tipo_activo} - ${data.activo}</small>
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function findActivoById(activoId) {
    // Buscar el activo en todas las categorías
    for (const categoria in ACTIVOS_DATA) {
        const activo = ACTIVOS_DATA[categoria].find(a => a.Activo === activoId);
        if (activo) {
            return activo;
        }
    }
    return null;
}

function finishIncidencia() {
    console.log('📋 Finalizando orden de mantenimiento:', incidenciaData);
    
    // Recopilar todos los datos del formulario
    const responsableSelect = document.getElementById('responsable-select');
    const notasResponsable = document.getElementById('notas-responsable');
    const plantillaTareas = document.getElementById('plantilla-tareas');
    const descripcionTareas = document.getElementById('descripcion-tareas');
    
    // Recopilar tareas del DOM
    const tareasElements = document.querySelectorAll('.tarea-item');
    const tareasArray = [];
    tareasElements.forEach(item => {
        const input = item.querySelector('.tarea-input');
        const checkbox = item.querySelector('.tarea-checkbox');
        if (input && input.value.trim()) {
            tareasArray.push({
                descripcion: input.value.trim(),
                completada: checkbox ? checkbox.checked : false
            });
        }
    });
    
    // Generar ID único para la orden
    const ordenId = 'OT-' + new Date().getFullYear() + '-' + 
                    String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    
    // Determinar el ícono según el tipo de activo
    let iconoActivo = '🔧';
    if (selectedActivo) {
        const categoria = selectedActivo.CatActivo?.toLowerCase() || '';
        if (categoria.includes('tractor')) iconoActivo = '🚜';
        else if (categoria.includes('cosecha')) iconoActivo = '🌾';
        else if (categoria.includes('pulverizador')) iconoActivo = '💧';
        else if (categoria.includes('vehículo') || categoria.includes('vehiculo')) iconoActivo = '🚗';
        else if (categoria.includes('nave') || categoria.includes('almacén')) iconoActivo = '🏢';
        else if (categoria.includes('sistema')) iconoActivo = '⚙️';
    }
    
    // Crear objeto de orden completo
    const nuevaOrden = {
        id: ordenId,
        activo: selectedActivo ? `${iconoActivo} ${selectedActivo.NomActivo}` : 'Sin activo',
        activoDetalle: selectedActivo,
        tipoMantenimiento: incidenciaData.tipoIncidencia || 'mantenimiento-correctivo',
        titulo: incidenciaData.titulo || '',
        descripcion: incidenciaData.descripcion || '',
        prioridad: incidenciaData.urgencia || 'Media',
        responsable: responsableSelect ? responsableSelect.options[responsableSelect.selectedIndex]?.text : '',
        equipoApoyo: incidenciaData.equipoApoyo || [],
        notasResponsable: notasResponsable ? notasResponsable.value : '',
        fechaInicio: document.getElementById('fecha-inicio')?.value || '',
        fechaFin: document.getElementById('fecha-fin')?.value || '',
        plantillaTareas: plantillaTareas ? plantillaTareas.options[plantillaTareas.selectedIndex]?.text : '',
        tareas: tareasArray,
        descripcionTareas: descripcionTareas ? descripcionTareas.value : '',
        archivos: incidenciaData.archivos || [],
        estado: 'por-hacer',
        fechaCreacion: new Date().toISOString(),
        ubicacion: incidenciaData.ubicacion || {}
    };
    
    console.log('✅ Orden creada:', nuevaOrden);
    
    // Guardar en localStorage
    let ordenesGuardadas = JSON.parse(localStorage.getItem('nuevasOrdenesCreadas') || '[]');
    ordenesGuardadas.push(nuevaOrden);
    localStorage.setItem('nuevasOrdenesCreadas', JSON.stringify(ordenesGuardadas));
    
    // Mostrar mensaje de éxito
    alert(`✅ Orden de Mantenimiento ${ordenId} creada correctamente`);
    
    // Redirigir a ver órdenes de trabajo
    window.location.href = 'ver-ordenes-mantenimiento.html';
}

// Funciones de navegación de la navbar
function volverAtras() {
    console.log('🔙 Botón volver presionado, paso actual:', currentStep);
    
    // Si estamos en el primer paso, mostrar confirmación antes de salir
    if (currentStep === 1) {
        const hasData = selectedActivo || incidenciaData.tipoIncidencia || incidenciaData.descripcion.trim();
        
        if (hasData) {
            const confirmExit = confirm('¿Estás seguro de que quieres salir? Se perderán los datos no guardados.');
            if (!confirmExit) return;
        }
        
        // Volver a la página anterior o página principal
        window.location.href = 'jefedetaller.html';
    } else {
        // Si estamos en cualquier otro paso, retroceder un paso
        previousStep();
    }
}

function updateNavbarButton() {
    const btnVolver = document.getElementById('btn-volver-nav');
    if (btnVolver) {
        // Siempre mostrar el botón
        btnVolver.style.display = 'flex';
        btnVolver.classList.add('show');
        
        // Cambiar el título del botón según el contexto
        if (currentStep === 1) {
            btnVolver.title = 'Volver al menú principal';
            btnVolver.setAttribute('aria-label', 'Volver al menú principal');
        } else {
            btnVolver.title = `Volver al paso anterior (Paso ${currentStep - 1})`;
            btnVolver.setAttribute('aria-label', `Volver al paso ${currentStep - 1}`);
        }
        
        console.log('🔄 Botón navbar actualizado para paso:', currentStep);
    }
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Limpiar datos locales si los hay
        localStorage.removeItem('incidenciaData');
        
        // Redirigir al login o página principal
        window.location.href = 'jefedetaller.html';
    }
}

// Hacer funciones globales para que sean accesibles desde HTML
window.cerrarEscanerQR = cerrarEscanerQR;
window.volverAtras = volverAtras;
window.cerrarSesion = cerrarSesion;

// ===== FUNCIONALIDAD DE CÁMARA Y ARCHIVOS =====
function setupFileUpload() {
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('upload-area');
    const cameraBtn = document.getElementById('camera-btn');
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    if (uploadArea) {
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--planasa-green)';
            uploadArea.style.background = 'var(--planasa-green-ultra-light)';
        });
        
        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
    }
    
    if (cameraBtn) {
        cameraBtn.addEventListener('click', openCamera);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const filesPreview = document.getElementById('files-preview');
    if (!filesPreview) return;
    
    Array.from(files).forEach(file => {
        // Validar tamaño (10MB máximo)
        if (file.size > 10 * 1024 * 1024) {
            alert(`El archivo ${file.name} es demasiado grande. Máximo 10MB.`);
            return;
        }
        
        // Añadir archivo al array de datos
        incidenciaData.archivos.push(file);
        
        // Crear preview
        const fileCard = document.createElement('div');
        fileCard.className = 'file-card';
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.className = 'file-preview-img';
            fileCard.appendChild(img);
        } else {
            const icon = document.createElement('div');
            icon.className = 'file-icon';
            icon.innerHTML = '<i class="fas fa-file"></i>';
            fileCard.appendChild(icon);
        }
        
        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        fileCard.appendChild(fileName);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'file-remove';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => {
            const index = incidenciaData.archivos.indexOf(file);
            if (index > -1) {
                incidenciaData.archivos.splice(index, 1);
            }
            fileCard.remove();
        };
        fileCard.appendChild(removeBtn);
        
        filesPreview.appendChild(fileCard);
    });
}

function openCamera() {
    const modal = document.getElementById('camera-modal');
    const video = document.getElementById('camera-video');
    
    if (!modal || !video) return;
    
    modal.style.display = 'flex';
    
    navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
    })
    .then(stream => {
        video.srcObject = stream;
        window.currentStream = stream;
    })
    .catch(err => {
        console.error('Error al acceder a la cámara:', err);
        alert('No se pudo acceder a la cámara. Verifica los permisos.');
        modal.style.display = 'none';
    });
    
    // Configurar botón de captura
    const captureBtn = document.getElementById('capture-btn');
    if (captureBtn) {
        captureBtn.onclick = capturePhoto;
    }
}

function capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    
    if (!video || !canvas) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    
    canvas.toBlob(blob => {
        const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFiles([file]);
        cerrarCamara();
    }, 'image/jpeg', 0.8);
}

function cerrarCamara() {
    const modal = document.getElementById('camera-modal');
    const video = document.getElementById('camera-video');
    
    if (window.currentStream) {
        window.currentStream.getTracks().forEach(track => track.stop());
        window.currentStream = null;
    }
    
    if (video) {
        video.srcObject = null;
    }
    
    if (modal) {
        modal.style.display = 'none';
    }
}

// Exportar funciones de cámara globalmente
window.cerrarCamara = cerrarCamara;

// Exportar funciones de equipo y tareas globalmente
window.removeTecnico = removeTecnico;
window.eliminarTarea = eliminarTarea;
