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
    for (let step = 1; step <= 6; step++) {
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
    for (let i = 1; i <= 6; i++) {
        const prevBtn = document.getElementById(`prev-btn-${i}`);
        const nextBtn = document.getElementById(`next-btn-${i}`);
        
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
    
    const finishBtn = document.getElementById('finish-btn');
    if (finishBtn) finishBtn.style.display = 'none';
    
    // Mostrar botones del paso actual
    if (step < 6) {
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
            // Paso 5: Necesita descripción
            canContinue = incidenciaData.descripcion.trim() !== '';
            const nextBtn5 = document.getElementById('next-btn-5');
            if (nextBtn5) {
                nextBtn5.disabled = !canContinue;
                nextBtn5.style.opacity = canContinue ? '1' : '0.5';
            }
            break;
        case 6:
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
            if (!canAdvance) {
                alert('Por favor, proporciona una descripción de la incidencia.');
                return;
            }
            break;
    }
    
    if (currentStep < 6 && canAdvance) {
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
            // Restaurar descripción
            const descripcionTextarea = document.getElementById('descripcion-textarea');
            if (descripcionTextarea && incidenciaData.descripcion) {
                descripcionTextarea.value = incidenciaData.descripcion;
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
        
        // Configurar el escáner QR
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };
        
        // Crear instancia del escáner
        qrScanner = new Html5QrcodeScanner('qr-reader', config, false);
        
        // Iniciar el escáner
        qrScanner.render(
            (decodedText, decodedResult) => {
                console.log('✅ QR escaneado:', decodedText);
                processQRData(decodedText);
                cerrarEscanerQR();
            },
            (error) => {
                // Error de escaneo - no hacer nada para evitar spam de logs
            }
        );
        
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
    console.log('📋 Finalizando incidencia:', incidenciaData);
    alert('Incidencia creada correctamente');
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
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '../index.html';
        }
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
        window.location.href = '../index.html';
        // O puedes usar: window.location.href = '../login.html';
    }
}

// Hacer funciones globales para que sean accesibles desde HTML
window.cerrarEscanerQR = cerrarEscanerQR;
window.volverAtras = volverAtras;
window.cerrarSesion = cerrarSesion;
