// Verificar autenticación
if (localStorage.getItem('gmao_logged_in') !== 'true') {
    alert('Debe iniciar sesión para acceder al sistema');
    window.location.href = '../index.html';
}

// Variables globales para los charts
let charts = {};
let datosOriginales = null;
let datosFiltrados = null;

// Datos reales de maquinaria (sincronizados con maquinaria.js)
const DATOS_MAQUINAS = {
    totalMaquinas: 18,
    tractores: 8,
    cosechadoras: 3,
    pulverizadores: 3,
    sistemaRiego: 2,
    otros: 2,
    
    // Estados
    operativas: 11,
    enMantenimiento: 4,
    programadas: 3,
    inactivas: 0,
    
    // Costos totales por máquina (según maquinaria.js)
    costosPorMaquina: {
        'TR-001': 18650.50,
        'CS-002': 28450.90,
        'CS-003': 31280.65,
        'CS-004': 24680.40,
        'CT-001': 12340.75,
        'TR-003': 22150.80,
        'TR-004': 15680.45,
        'TR-005': 18920.30,
        'TR-006': 8560.15,
        'PV-002': 12890.25,
        'TR-007': 15420.75,
        'RI-004': 8945.30,
        'PV-005': 9876.40,
        'GE-006': 22340.80,
        'IN-007': 16789.95,
        'TR-008': 11567.60,
        'RI-009': 7234.15,
        'PV-010': 6892.35,
        'IN-011': 4567.80,
        'TR-012': 19876.45
    },
    
    // Calcular totales
    get costoTotal() {
        return Object.values(this.costosPorMaquina).reduce((sum, val) => sum + val, 0);
    },
    
    get costoPromedioPorMaquina() {
        return this.costoTotal / Object.keys(this.costosPorMaquina).length;
    },
    
    // Top 5 máquinas por costo
    get topMaquinasCosto() {
        return Object.entries(this.costosPorMaquina)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    },
    
    // Distribución de costos por tipo
    costosPorTipo: {
        'Tractores': 143166.60,  // Suma de todos los tractores
        'Cosechadoras': 84411.95,  // Suma de las 3 cosechadoras (CS-002 + CS-003 + CS-004)
        'Pulverizadores': 29659.00,  // Suma de pulverizadores
        'Sistema Riego': 16179.45,
        'Otros': 43698.55  // Generador + Infraestructura + Compresor
    },
    
    disponibilidad: 87.5  // 11 operativas de 18 total = 61%, pero considerando las programadas que funcionan = 77%
};

// Navegación entre secciones
document.addEventListener('DOMContentLoaded', function() {
    // Cargar sección inicial
    mostrarSeccion('resumen');
    
    // Event listeners para navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            mostrarSeccion(section);
            
            // Actualizar navegación activa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Inicializar todas las gráficas
    inicializarGraficas();
});

function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.bi-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Mostrar sección seleccionada
    const seccionActiva = document.getElementById(seccionId);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }
}

// Inicializar todas las gráficas
function inicializarGraficas() {
    // Gráficas de Resumen General
    crearGraficoDistribucionMantenimiento();
    crearGraficoCostosEvolucion();
    crearGraficoDisponibilidadPorTipo();
    crearGraficoTopMaquinas();
    
    // Gráficas de Disponibilidad
    crearGraficoDisponibilidadEvolucion();
    crearGraficoMTBFMTTR();
    crearGraficoAverias();
    
    // Gráficas de Preventivo vs Correctivo
    crearGraficoPrevCorrecHoras();
    crearGraficoPrevCorrecCostos();
    crearGraficoEvolucionPrevCorr();
    
    // Gráficas de Órdenes de Trabajo
    crearGraficoEstadoOT();
    crearGraficoProductividad();
    crearGraficoBacklog();
    
    // Gráficas de Costos
    crearGraficoDistribucionCostos();
    crearGraficoCostoTipo();
    crearGraficoEvolucionCostos();
    
    // Gráficas de Repuestos
    crearGraficoConsumoRepuestos();
    crearGraficoValorInventario();
    
    // Gráficas de Rendimiento
    crearGraficoEstadoActivos();
    crearGraficoHorasOperacion();
    crearGraficoUtilizacion();
}

// ===== GRÁFICAS DE RESUMEN GENERAL =====

function crearGraficoDistribucionMantenimiento() {
    const ctx = document.getElementById('chartMantenimientoDistribucion');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Datos ajustados según tipo
    let prevValue = 68;
    let corrValue = 28;
    let predValue = 4;
    
    if (tipoFiltro === 'cosechadora' || tipoFiltro === 'pulverizador') {
        prevValue = 60; // Maquinaria más propensa a correctivo
        corrValue = 35;
        predValue = 5;
    } else if (tipoFiltro === 'riego') {
        prevValue = 75; // Riego más estable
        corrValue = 20;
        predValue = 5;
    }
    
    charts.distribucionMant = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Preventivo', 'Correctivo', 'Predictivo'],
            datasets: [{
                data: [prevValue, corrValue, predValue],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function crearGraficoCostosEvolucion() {
    const ctx = document.getElementById('chartCostosEvolucion');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    const period = document.getElementById('period-filter')?.value || 'month';
    
    // Ajustar labels según el período
    let labels, dataMultiplier;
    if (period === 'week') {
        labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        dataMultiplier = 0.15;
    } else if (period === 'month') {
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        dataMultiplier = 0.6;
    } else if (period === 'quarter') {
        labels = ['Mes 1', 'Mes 2', 'Mes 3'];
        dataMultiplier = 2.5;
    } else {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        dataMultiplier = 1;
    }
    
    // Calcular costo base según filtro
    let costoBase = 277117;
    if (tipoFiltro === 'tractor') costoBase = 143166.60;
    else if (tipoFiltro === 'cosechadora') costoBase = 84411.95;
    else if (tipoFiltro === 'pulverizador') costoBase = 29659.00;
    else if (tipoFiltro === 'riego') costoBase = 16179.45;
    else if (tipoFiltro === 'otros') costoBase = 43698.55;
    
    const costoPromedio = (costoBase / 6) * dataMultiplier;
    const data = labels.map((_, i) => costoPromedio * (0.9 + Math.random() * 0.2));
    
    charts.costosEvol = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Costos (€)',
                data: data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoDisponibilidadPorTipo() {
    const ctx = document.getElementById('chartDisponibilidadTipo');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    let labels, data, colors;
    
    if (tipoFiltro === 'todos') {
        labels = ['Riego', 'Tractores', 'Otros', 'Cosechadoras', 'Pulverizadores'];
        data = [100, 75, 67, 67, 33];
        colors = ['#20c997', '#17a2b8', '#6c757d', '#28a745', '#ffc107'];
    } else if (tipoFiltro === 'tractor') {
        labels = ['TR-001', 'TR-003', 'TR-004', 'TR-005', 'TR-012', 'CT-001', 'TR-008', 'TR-006'];
        data = [100, 50, 100, 100, 100, 100, 100, 0];
        colors = Array(8).fill('#17a2b8');
    } else if (tipoFiltro === 'cosechadora') {
        labels = ['CS-002', 'CS-004', 'CS-003'];
        data = [100, 100, 0];
        colors = ['#28a745', '#28a745', '#dc3545'];
    } else if (tipoFiltro === 'pulverizador') {
        labels = ['PV-002', 'PV-005', 'PV-010'];
        data = [50, 100, 50];
        colors = Array(3).fill('#ffc107');
    } else if (tipoFiltro === 'riego') {
        labels = ['RI-004', 'RI-009'];
        data = [100, 100];
        colors = Array(2).fill('#20c997');
    } else {
        labels = ['GE-006', 'IN-007', 'IN-011'];
        data = [100, 50, 100];
        colors = Array(3).fill('#6c757d');
    }
    
    charts.dispTipo = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Disponibilidad (%)',
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoTopMaquinas() {
    const ctx = document.getElementById('chartTopMaquinas');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Filtrar máquinas por tipo
    let maquinasFiltradas = Object.entries(DATOS_MAQUINAS.costosPorMaquina);
    
    if (tipoFiltro !== 'todos') {
        maquinasFiltradas = maquinasFiltradas.filter(([id, costo]) => {
            if (tipoFiltro === 'tractor') return id.startsWith('TR-') || id.startsWith('CT-');
            if (tipoFiltro === 'cosechadora') return id.startsWith('CS-');
            if (tipoFiltro === 'pulverizador') return id.startsWith('PV-');
            if (tipoFiltro === 'riego') return id.startsWith('RI-');
            if (tipoFiltro === 'otros') return id.startsWith('GE-') || id.startsWith('IN-');
            return true;
        });
    }
    
    // Ordenar y tomar top 5
    const topMaquinas = maquinasFiltradas
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    charts.topMaquinas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topMaquinas.map(m => m[0]),
            datasets: [{
                label: 'Costo (€)',
                data: topMaquinas.map(m => m[1]),
                backgroundColor: '#dc3545'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ===== GRÁFICAS DE DISPONIBILIDAD =====

function crearGraficoDisponibilidadEvolucion() {
    const ctx = document.getElementById('chartDisponibilidadEvolucion');
    if (!ctx) return;
    
    const period = document.getElementById('period-filter')?.value || 'month';
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Ajustar labels según el período
    let labels;
    if (period === 'week') {
        labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    } else if (period === 'month') {
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    } else if (period === 'quarter') {
        labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    } else {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
    
    // Disponibilidad base según tipo
    let dispBase = 77.8;
    if (tipoFiltro === 'tractor') dispBase = 75;
    else if (tipoFiltro === 'cosechadora') dispBase = 67;
    else if (tipoFiltro === 'pulverizador') dispBase = 33;
    else if (tipoFiltro === 'riego') dispBase = 100;
    else if (tipoFiltro === 'otros') dispBase = 67;
    
    const dispData = labels.map((_, i) => dispBase + (Math.random() * 4 - 2));
    const mtbfData = labels.map(() => 140 + Math.random() * 20);
    
    charts.dispEvol = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Disponibilidad (%)',
                    data: dispData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    yAxisID: 'y',
                    tension: 0.4
                },
                {
                    label: 'MTBF (h)',
                    data: mtbfData,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Disponibilidad (%)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'MTBF (horas)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

function crearGraficoMTBFMTTR() {
    const ctx = document.getElementById('chartMTBFMTTR');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Ajustar métricas según tipo
    let labels, mtbfData, mttrData;
    
    if (tipoFiltro === 'tractor') {
        labels = ['Tractores'];
        mtbfData = [165];
        mttrData = [4.5];
    } else if (tipoFiltro === 'cosechadora') {
        labels = ['Cosechadoras'];
        mtbfData = [142];
        mttrData = [5.8];
    } else if (tipoFiltro === 'pulverizador') {
        labels = ['Pulverizadores'];
        mtbfData = [158];
        mttrData = [3.9];
    } else if (tipoFiltro === 'riego') {
        labels = ['Riego'];
        mtbfData = [178];
        mttrData = [2.8];
    } else if (tipoFiltro === 'otros') {
        labels = ['Otros'];
        mtbfData = [160];
        mttrData = [3.5];
    } else {
        labels = ['Tractores', 'Cosechadoras', 'Pulverizadores', 'Riego'];
        mtbfData = [165, 142, 158, 178];
        mttrData = [4.5, 5.8, 3.9, 2.8];
    }
    
    charts.mtbfmttr = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'MTBF (h)',
                    data: mtbfData,
                    backgroundColor: '#28a745'
                },
                {
                    label: 'MTTR (h)',
                    data: mttrData,
                    backgroundColor: '#dc3545'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function crearGraficoAverias() {
    const ctx = document.getElementById('chartAverias');
    if (!ctx) return;
    
    charts.averias = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Mecánicas', 'Eléctricas', 'Hidráulicas', 'Neumáticas', 'Otras'],
            datasets: [{
                data: [35, 25, 20, 12, 8],
                backgroundColor: ['#dc3545', '#ffc107', '#007bff', '#17a2b8', '#6c757d']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ===== GRÁFICAS DE PREVENTIVO VS CORRECTIVO =====

function crearGraficoPrevCorrecHoras() {
    const ctx = document.getElementById('chartPrevCorrecHoras');
    if (!ctx) return;
    
    charts.prevCorrecHoras = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Preventivo', 'Correctivo'],
            datasets: [{
                data: [68, 32],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function crearGraficoPrevCorrecCostos() {
    const ctx = document.getElementById('chartPrevCorrecCostos');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Calcular costo base según filtro
    let costoBase = 277117;
    if (tipoFiltro === 'tractor') costoBase = 143166.60;
    else if (tipoFiltro === 'cosechadora') costoBase = 84411.95;
    else if (tipoFiltro === 'pulverizador') costoBase = 29659.00;
    else if (tipoFiltro === 'riego') costoBase = 16179.45;
    else if (tipoFiltro === 'otros') costoBase = 43698.55;
    
    const preventivo = Math.round(costoBase * 0.68);
    const correctivo = Math.round(costoBase * 0.32);
    
    charts.prevCorrecCostos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Preventivo', 'Correctivo'],
            datasets: [{
                data: [preventivo, correctivo],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': €' + context.parsed.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoEvolucionPrevCorr() {
    const ctx = document.getElementById('chartEvolucionPrevCorr');
    if (!ctx) return;
    
    const period = document.getElementById('period-filter')?.value || 'month';
    
    // Ajustar labels según el período
    let labels;
    if (period === 'week') {
        labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    } else if (period === 'month') {
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    } else if (period === 'quarter') {
        labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    } else {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
    
    const prevData = labels.map(() => 60 + Math.random() * 10);
    const corrData = labels.map((_, i) => 100 - prevData[i]);
    
    charts.evolPrevCorr = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Preventivo',
                    data: prevData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Correctivo',
                    data: corrData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// ===== GRÁFICAS DE ÓRDENES DE TRABAJO =====

function crearGraficoEstadoOT() {
    const ctx = document.getElementById('chartEstadoOT');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Base: 18 máquinas
    let numMaquinas = 18;
    if (tipoFiltro === 'tractor') numMaquinas = 8;
    else if (tipoFiltro === 'cosechadora') numMaquinas = 3;
    else if (tipoFiltro === 'pulverizador') numMaquinas = 3;
    else if (tipoFiltro === 'riego') numMaquinas = 2;
    else if (tipoFiltro === 'otros') numMaquinas = 2;
    
    // OTs proporcionales al número de máquinas (189 OTs totales base / 18 máquinas = ~10.5 OTs por máquina)
    const factor = numMaquinas / 18;
    const abiertas = Math.round(24 * factor);
    const enProgreso = Math.round(15 * factor);
    const completadas = Math.round(142 * factor);
    const retrasadas = Math.round(8 * factor);
    
    charts.estadoOT = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Abiertas', 'En Progreso', 'Completadas', 'Retrasadas'],
            datasets: [{
                data: [abiertas, enProgreso, completadas, retrasadas],
                backgroundColor: ['#ffc107', '#007bff', '#28a745', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function crearGraficoProductividad() {
    const ctx = document.getElementById('chartProductividad');
    if (!ctx) return;
    
    charts.productividad = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Juan P.', 'María G.', 'Carlos R.', 'Ana M.', 'Luis F.'],
            datasets: [{
                label: 'OTs Completadas',
                data: [15, 13, 12, 11, 9],
                backgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function crearGraficoBacklog() {
    const ctx = document.getElementById('chartBacklog');
    if (!ctx) return;
    
    const period = document.getElementById('period-filter')?.value || 'month';
    
    // Ajustar labels según el período
    let labels;
    if (period === 'week') {
        labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    } else if (period === 'month') {
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    } else if (period === 'quarter') {
        labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    } else {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
    
    const data = labels.map(() => 15 + Math.floor(Math.random() * 15));
    
    charts.backlog = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Máquinas en Servicio',
                data: data,
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ===== GRÁFICAS DE COSTOS =====

function crearGraficoDistribucionCostos() {
    const ctx = document.getElementById('chartDistribucionCostos');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Calcular costo base según filtro
    let costoBase = 277117;
    if (tipoFiltro === 'tractor') costoBase = 143166.60;
    else if (tipoFiltro === 'cosechadora') costoBase = 84411.95;
    else if (tipoFiltro === 'pulverizador') costoBase = 29659.00;
    else if (tipoFiltro === 'riego') costoBase = 16179.45;
    else if (tipoFiltro === 'otros') costoBase = 43698.55;
    
    // Del total: 51% Mano de obra, 32% Repuestos, 12% Externos, 5% Otros
    const manoObra = Math.round(costoBase * 0.51);
    const repuestos = Math.round(costoBase * 0.32);
    const externos = Math.round(costoBase * 0.12);
    const otros = Math.round(costoBase * 0.05);
    
    charts.distCostos = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Mano de Obra', 'Repuestos', 'Externos', 'Otros'],
            datasets: [{
                data: [manoObra, repuestos, externos, otros],
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#6c757d']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': €' + context.parsed.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoCostoTipo() {
    const ctx = document.getElementById('chartCostoTipo');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    let labels, data;
    
    if (tipoFiltro === 'todos') {
        labels = ['Tractores', 'Cosechadoras', 'Otros', 'Pulverizadores', 'Riego'];
        data = [143166.60, 84412.00, 43698.55, 29659.00, 16179.45];
    } else if (tipoFiltro === 'tractor') {
        // Desglose individual de tractores
        labels = ['TR-003', 'TR-012', 'TR-005', 'TR-001', 'TR-004', 'TR-007', 'CT-001', 'TR-008'];
        data = [22150.80, 19876.45, 18920.30, 18650.50, 15680.45, 15420.75, 12340.75, 11567.60];
    } else if (tipoFiltro === 'cosechadora') {
        labels = ['CS-003', 'CS-002', 'CS-004'];
        data = [31280.65, 28450.90, 24680.40];
    } else if (tipoFiltro === 'pulverizador') {
        labels = ['PV-002', 'PV-005', 'PV-010'];
        data = [12890.25, 9876.40, 6892.35];
    } else if (tipoFiltro === 'riego') {
        labels = ['RI-004', 'RI-009'];
        data = [8945.30, 7234.15];
    } else {
        labels = ['GE-006', 'IN-007', 'IN-011'];
        data = [22340.80, 16789.95, 4567.80];
    }
    
    charts.costoTipo = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Costo Total (€)',
                data: data,
                backgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoEvolucionCostos() {
    const ctx = document.getElementById('chartEvolucionCostos');
    if (!ctx) return;
    
    const period = document.getElementById('period-filter')?.value || 'month';
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Ajustar labels según el período
    let labels;
    if (period === 'week') {
        labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    } else if (period === 'month') {
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    } else if (period === 'quarter') {
        labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    } else {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
    
    // Calcular costo base según filtro
    let costoBase = 277117;
    if (tipoFiltro === 'tractor') costoBase = 143166.60;
    else if (tipoFiltro === 'cosechadora') costoBase = 84411.95;
    else if (tipoFiltro === 'pulverizador') costoBase = 29659.00;
    else if (tipoFiltro === 'riego') costoBase = 16179.45;
    else if (tipoFiltro === 'otros') costoBase = 43698.55;
    
    const costoPrev = (costoBase * 0.68) / labels.length;
    const costoCorr = (costoBase * 0.32) / labels.length;
    
    const prevData = labels.map(() => costoPrev * (0.9 + Math.random() * 0.2));
    const corrData = labels.map(() => costoCorr * (0.8 + Math.random() * 0.4));
    
    charts.evolCostos = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Preventivo',
                    data: prevData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Correctivo',
                    data: corrData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ===== GRÁFICAS DE REPUESTOS =====

function crearGraficoConsumoRepuestos() {
    const ctx = document.getElementById('chartConsumoRepuestos');
    if (!ctx) return;
    
    const period = document.getElementById('period-filter')?.value || 'month';
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Ajustar labels según el período
    let labels;
    if (period === 'week') {
        labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    } else if (period === 'month') {
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    } else if (period === 'quarter') {
        labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    } else {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
    
    // Calcular costo repuestos según tipo (32% del costo total)
    let costoBase = 277117;
    if (tipoFiltro === 'tractor') costoBase = 143166.60;
    else if (tipoFiltro === 'cosechadora') costoBase = 84411.95;
    else if (tipoFiltro === 'pulverizador') costoBase = 29659.00;
    else if (tipoFiltro === 'riego') costoBase = 16179.45;
    else if (tipoFiltro === 'otros') costoBase = 43698.55;
    
    const costoRepuestos = (costoBase * 0.32) / labels.length;
    const data = labels.map(() => costoRepuestos * (0.85 + Math.random() * 0.3));
    
    charts.consumoRepuestos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Consumo (€)',
                data: data,
                backgroundColor: '#17a2b8'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoValorInventario() {
    const ctx = document.getElementById('chartValorInventario');
    if (!ctx) return;
    
    const period = document.getElementById('period-filter')?.value || 'month';
    
    // Ajustar labels según el período
    let labels;
    if (period === 'week') {
        labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    } else if (period === 'month') {
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    } else if (period === 'quarter') {
        labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    } else {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
    
    // Inventario decrece ligeramente con el tiempo
    const valorInicial = 22000;
    const data = labels.map((_, i) => valorInicial - (i * 300) + (Math.random() * 200));
    
    charts.valorInventario = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor (€)',
                data: data,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// ===== GRÁFICAS DE RENDIMIENTO =====

function crearGraficoEstadoActivos() {
    const ctx = document.getElementById('chartEstadoActivos');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Base: 18 máquinas
    let numMaquinas = 18;
    if (tipoFiltro === 'tractor') numMaquinas = 8;
    else if (tipoFiltro === 'cosechadora') numMaquinas = 3;
    else if (tipoFiltro === 'pulverizador') numMaquinas = 3;
    else if (tipoFiltro === 'riego') numMaquinas = 2;
    else if (tipoFiltro === 'otros') numMaquinas = 2;
    
    // Distribución proporcional: 61% operativos, 22% mantenimiento, 17% programados
    const operativos = Math.round(numMaquinas * 0.61);
    const enMantenimiento = Math.round(numMaquinas * 0.22);
    const programados = numMaquinas - operativos - enMantenimiento;
    
    charts.estadoActivos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Operativos', 'En Mantenimiento', 'Programados', 'Inactivos'],
            datasets: [{
                data: [operativos, enMantenimiento, programados, 0],
                backgroundColor: ['#28a745', '#ffc107', '#007bff', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoHorasOperacion() {
    const ctx = document.getElementById('chartHorasOperacion');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    // Datos reales calculados de maquinaria.js
    let labels, data, colors;
    
    if (tipoFiltro === 'tractor') {
        labels = ['TR-001', 'TR-002', 'TR-003', 'TR-004', 'TR-005', 'TR-006', 'CT-001', 'TR-007'];
        data = [2845, 2567, 3012, 1890, 2734, 1245, 2156, 2148];
        colors = '#007bff';
    } else if (tipoFiltro === 'cosechadora') {
        labels = ['CS-002', 'CS-003', 'CS-004'];
        data = [2345, 2678, 2526];
        colors = '#28a745';
    } else if (tipoFiltro === 'pulverizador') {
        labels = ['PV-005', 'PV-008', 'PV-009'];
        data = [1234, 1389, 1450];
        colors = '#6f42c1';
    } else if (tipoFiltro === 'riego') {
        labels = ['RI-010', 'RI-012'];
        data = [5234, 5456];
        colors = '#17a2b8';
    } else if (tipoFiltro === 'otros') {
        labels = ['GE-006', 'IN-007'];
        data = [5892, 3967];
        colors = '#ffc107';
    } else {
        labels = ['Tractores', 'Cosechadoras', 'Generador', 'Riego', 'Pulverizadores'];
        data = [18597, 7549, 5892, 10690, 4073];
        colors = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1'];
    }
    
    charts.horasOperacion = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Horas de Operación',
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + 'h';
                        }
                    }
                }
            }
        }
    });
}

function crearGraficoUtilizacion() {
    const ctx = document.getElementById('chartUtilizacion');
    if (!ctx) return;
    
    const tipoFiltro = document.getElementById('tipo-filter')?.value || 'todos';
    
    let labels, data;
    
    if (tipoFiltro === 'tractor') {
        labels = ['TR-001', 'TR-003', 'TR-005', 'TR-004', 'TR-002', 'TR-006', 'CT-001', 'TR-007'];
        data = [85, 92, 88, 72, 78, 45, 65, 70];
    } else if (tipoFiltro === 'cosechadora') {
        labels = ['CS-003', 'CS-002', 'CS-004'];
        data = [95, 78, 85];
    } else if (tipoFiltro === 'pulverizador') {
        labels = ['PV-005', 'PV-008', 'PV-009'];
        data = [60, 68, 72];
    } else if (tipoFiltro === 'riego') {
        labels = ['RI-010', 'RI-012'];
        data = [90, 92];
    } else if (tipoFiltro === 'otros') {
        labels = ['GE-006', 'IN-007'];
        data = [88, 75];
    } else {
        labels = ['TR-001', 'TR-003', 'TR-005', 'TR-004', 'CS-003', 'CS-002', 'RI-010', 'RI-012'];
        data = [85, 92, 88, 72, 95, 78, 90, 92];
    }
    
    charts.utilizacion = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Utilización (%)',
                data: data,
                backgroundColor: function(context) {
                    const value = context.parsed.y;
                    if (value >= 80) return '#28a745';
                    if (value >= 60) return '#ffc107';
                    return '#dc3545';
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Función para actualizar datos según los filtros seleccionados
function actualizarDatos() {
    const lugar = document.getElementById('lugar-filter')?.value || 'todos';
    const tipo = document.getElementById('tipo-filter')?.value || 'todos';
    const campana = document.getElementById('campana-filter')?.value || 'todos';
    const period = document.getElementById('period-filter')?.value || 'month';
    
    // Aplicar filtros
    let datosTemporales = { ...DATOS_MAQUINAS };
    let maquinasFiltradas = Object.keys(DATOS_MAQUINAS.costosPorMaquina);
    
    // Filtrar por tipo
    if (tipo !== 'todos') {
        maquinasFiltradas = maquinasFiltradas.filter(id => {
            if (tipo === 'tractor') return id.startsWith('TR-') || id.startsWith('CT-');
            if (tipo === 'cosechadora') return id.startsWith('CS-');
            if (tipo === 'pulverizador') return id.startsWith('PV-');
            if (tipo === 'riego') return id.startsWith('RI-');
            if (tipo === 'otros') return id.startsWith('GE-') || id.startsWith('IN-');
            return true;
        });
    }
    
    // Calcular totales con máquinas filtradas
    const costoTotalFiltrado = maquinasFiltradas.reduce((sum, id) => {
        return sum + (DATOS_MAQUINAS.costosPorMaquina[id] || 0);
    }, 0);
    
    const totalMaquinasFiltradas = maquinasFiltradas.length;
    
    // Actualizar KPIs en el HTML
    actualizarKPIs(costoTotalFiltrado, totalMaquinasFiltradas, tipo);
    
    // Recrear todas las gráficas con los datos filtrados
    destruirGraficas();
    inicializarGraficas();
    
    // Mostrar mensaje de confirmación
    const tipoTexto = {
        'todos': 'Todos los tipos',
        'tractor': 'Tractores',
        'cosechadora': 'Cosechadoras',
        'pulverizador': 'Pulverizadores',
        'riego': 'Sistema Riego',
        'otros': 'Otros'
    }[tipo];
    
    console.log(`✅ Filtros aplicados: ${tipoTexto} | ${totalMaquinasFiltradas} máquinas | €${costoTotalFiltrado.toLocaleString()}`);
}

function actualizarKPIs(costoTotal, totalMaquinas, tipoFiltro) {
    // Calcular disponibilidad según tipo
    const disponibilidad = tipoFiltro === 'todos' ? 77.8 : 
                          tipoFiltro === 'cosechadora' ? 67 :
                          tipoFiltro === 'riego' ? 100 :
                          tipoFiltro === 'tractor' ? 75 :
                          tipoFiltro === 'pulverizador' ? 33 : 67;
    
    // Calcular MTBF según tipo
    const mtbf = tipoFiltro === 'tractor' ? 165 :
                 tipoFiltro === 'cosechadora' ? 142 :
                 tipoFiltro === 'pulverizador' ? 158 :
                 tipoFiltro === 'riego' ? 178 :
                 tipoFiltro === 'otros' ? 160 : 156;
    
    // Calcular MTTR según tipo
    const mttr = tipoFiltro === 'tractor' ? 4.5 :
                 tipoFiltro === 'cosechadora' ? 5.8 :
                 tipoFiltro === 'pulverizador' ? 3.9 :
                 tipoFiltro === 'riego' ? 2.8 :
                 tipoFiltro === 'otros' ? 3.5 : 4.2;
    
    // Calcular averías por activo
    const averiasActivo = tipoFiltro === 'cosechadora' ? 3.5 :
                          tipoFiltro === 'pulverizador' ? 3.2 :
                          tipoFiltro === 'riego' ? 1.8 : 2.8;
    
    // Calcular costos distribuidos
    const costoManoObra = Math.round(costoTotal * 0.51);
    const costoRepuestos = Math.round(costoTotal * 0.32);
    const costoPreventivo = Math.round(costoTotal * 0.68);
    const costoCorrectivo = Math.round(costoTotal * 0.32);
    const costoPromedio = Math.round(costoTotal / totalMaquinas);
    
    // === SECCIÓN RESUMEN (cards superiores) ===
    const cardValues = document.querySelectorAll('.kpi-summary-grid .card-value');
    if (cardValues.length >= 3) {
        cardValues[0].textContent = disponibilidad.toFixed(1) + '%';
        cardValues[2].textContent = '€' + costoTotal.toLocaleString('es-ES', {maximumFractionDigits: 0});
    }
    
    // === SECCIÓN DISPONIBILIDAD ===
    const dispCards = document.querySelectorAll('#disponibilidad .kpi-card .kpi-value');
    if (dispCards.length >= 6) {
        dispCards[0].innerHTML = disponibilidad.toFixed(1) + '<span>%</span>';
        dispCards[1].innerHTML = mtbf + '<span>h</span>';
        dispCards[2].innerHTML = mttr.toFixed(1) + '<span>h</span>';
        dispCards[3].textContent = averiasActivo.toFixed(1);
    }
    
    // === SECCIÓN ÓRDENES DE TRABAJO ===
    const otCards = document.querySelectorAll('#ordenes .kpi-card .kpi-value');
    if (otCards.length >= 4) {
        const factorOT = totalMaquinas / 18;
        const tiempoPromedio = tipoFiltro === 'cosechadora' ? 4.5 :
                               tipoFiltro === 'pulverizador' ? 4.2 :
                               tipoFiltro === 'riego' ? 2.8 : 3.8;
        
        otCards[0].innerHTML = tiempoPromedio.toFixed(1) + '<span>días</span>';
        otCards[1].textContent = Math.round(7 * factorOT);
    }
    
    // === SECCIÓN COSTOS ===
    const costosCards = document.querySelectorAll('#costos .kpi-card .kpi-value');
    if (costosCards.length >= 4) {
        costosCards[0].textContent = '€' + costoTotal.toLocaleString('es-ES', {maximumFractionDigits: 0});
        costosCards[1].textContent = '€' + costoPreventivo.toLocaleString('es-ES', {maximumFractionDigits: 0});
        costosCards[2].textContent = '€' + costoRepuestos.toLocaleString('es-ES', {maximumFractionDigits: 0});
    }
    
    // === SECCIÓN REPUESTOS ===
    const repuestosCards = document.querySelectorAll('#repuestos .kpi-card .kpi-value');
    if (repuestosCards.length >= 4) {
        const rotacion = tipoFiltro === 'cosechadora' ? 5.2 :
                         tipoFiltro === 'pulverizador' ? 3.8 :
                         tipoFiltro === 'riego' ? 3.5 : 4.2;
        
        repuestosCards[0].innerHTML = rotacion.toFixed(1) + '<span>x/año</span>';
        repuestosCards[1].textContent = Math.max(8, Math.round(12 * (totalMaquinas / 18)));
    }
    
    // === SECCIÓN RENDIMIENTO (OPERATIVOS) ===
    const rendimientoCards = document.querySelectorAll('#operativos .kpi-card .kpi-value');
    if (rendimientoCards.length >= 4) {
        const operativos = Math.round(totalMaquinas * 0.61);
        const enMantenimiento = Math.round(totalMaquinas * 0.22);
        
        rendimientoCards[0].textContent = totalMaquinas;
        rendimientoCards[1].textContent = operativos;
        rendimientoCards[2].textContent = enMantenimiento;
        rendimientoCards[3].textContent = '€' + costoPromedio.toLocaleString('es-ES', {maximumFractionDigits: 0});
    }
}

function destruirGraficas() {
    // Destruir todas las gráficas existentes
    Object.keys(charts).forEach(key => {
        if (charts[key]) {
            charts[key].destroy();
        }
    });
    charts = {};
}

// Función para exportar reporte
function exportarReporte() {
    alert('Funcionalidad de exportación en desarrollo.\nSe generará un PDF con todos los KPIs y gráficas.');
}

// Función de cerrar sesión desde navbar
function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('gmao_logged_in');
        localStorage.removeItem('gmao_username');
        window.location.href = '../index.html';
    }
}

// Función para volver atrás
function volverAtras() {
    window.location.href = 'gestortaller.html';
}

// Función para volver atrás
function volverAtras() {
    window.location.href = 'gestortaller.html';
}
