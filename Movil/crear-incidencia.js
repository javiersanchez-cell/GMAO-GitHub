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
    descripcion: '',
    archivos: [],
    timestamp: null
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
    for (let step = 1; step <= 5; step++) {
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
}

function initializeWizard() {
    showStep(1);
    updateProgress();
}

function initializeData() {
    // Poblar selector de fincas si existe
    populateFincaSelector();
    
    // Configurar event listeners para otros pasos
    setupOtherStepsListeners();
}

function setupOtherStepsListeners() {
    // Paso 2 - Finca
    const fincaSelect = document.getElementById('finca-select');
    if (fincaSelect) {
        fincaSelect.addEventListener('change', function() {
            incidenciaData.ubicacion.finca = this.value;
            updateNavigationButtons(currentStep);
        });
    }
    
    // Paso 3 - Tipo e Importancia (radio buttons)
    document.querySelectorAll('input[name="tipo-incidencia"]').forEach(radio => {
        radio.addEventListener('change', function() {
            incidenciaData.tipoIncidencia = this.value;
            
            // Mostrar la sección de importancia después de seleccionar tipo
            const importanciaSection = document.getElementById('importancia-section');
            if (importanciaSection) {
                importanciaSection.style.display = 'block';
            }
            
            updateNavigationButtons(currentStep);
        });
    });
    
    // Configurar botones de importancia
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
    
    // Paso 4 - Descripción
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
    currentStep = step;
}

function updateNavigationButtons(step) {
    console.log('🔄 Actualizando botones para paso:', step);
    
    // Ocultar todos los botones primero
    for (let i = 1; i <= 5; i++) {
        const prevBtn = document.getElementById(`prev-btn-${i}`);
        const nextBtn = document.getElementById(`next-btn-${i}`);
        
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
    
    const finishBtn = document.getElementById('finish-btn');
    if (finishBtn) finishBtn.style.display = 'none';
    
    // Mostrar botones del paso actual
    if (step < 5) {
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
            // Paso 2: Necesita finca seleccionada
            canContinue = incidenciaData.ubicacion.finca !== '';
            const nextBtn2 = document.getElementById('next-btn-2');
            if (nextBtn2) {
                nextBtn2.disabled = !canContinue;
                nextBtn2.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 3:
            // Paso 3: Necesita tipo e importancia
            canContinue = incidenciaData.tipoIncidencia !== '' && incidenciaData.importancia !== '';
            const nextBtn3 = document.getElementById('next-btn-3');
            if (nextBtn3) {
                nextBtn3.disabled = !canContinue;
                nextBtn3.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 4:
            // Paso 4: Necesita descripción
            canContinue = incidenciaData.descripcion.trim() !== '';
            const nextBtn4 = document.getElementById('next-btn-4');
            if (nextBtn4) {
                nextBtn4.disabled = !canContinue;
                nextBtn4.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 5:
            // Último paso - siempre se puede finalizar
            canContinue = true;
            const finishBtn = document.getElementById('finish-btn');
            if (finishBtn) {
                finishBtn.disabled = false;
                finishBtn.style.opacity = '1';
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
            canAdvance = incidenciaData.tipoIncidencia !== '' && incidenciaData.importancia !== '';
            if (!canAdvance) {
                alert('Por favor, completa el tipo e importancia de la incidencia.');
                return;
            }
            break;
        case 4:
            canAdvance = incidenciaData.descripcion.trim() !== '';
            if (!canAdvance) {
                alert('Por favor, proporciona una descripción de la incidencia.');
                return;
            }
            break;
    }
    
    if (currentStep < 5 && canAdvance) {
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
            // Restaurar tipo e importancia
            if (incidenciaData.tipoIncidencia) {
                // Mostrar la sección de importancia si ya hay tipo seleccionado
                const importanciaSection = document.getElementById('importancia-section');
                if (importanciaSection) {
                    importanciaSection.style.display = 'block';
                }
            }
            // Los radio buttons ya mantienen su estado
            break;
        case 4:
            // Restaurar descripción
            const descripcionTextarea = document.getElementById('descripcion-textarea');
            if (descripcionTextarea && incidenciaData.descripcion) {
                descripcionTextarea.value = incidenciaData.descripcion;
            }
            break;
    }
}

function openQRScanner() {
    console.log('🔍 Abriendo escáner QR...');
    // Implementar escáner QR aquí
    alert('Funcionalidad QR en desarrollo');
}

function finishIncidencia() {
    console.log('📋 Finalizando incidencia:', incidenciaData);
    alert('Incidencia creada correctamente');
}
