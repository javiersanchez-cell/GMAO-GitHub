// =========================
//  Business Intelligence GMAO - JS Limpio
// =========================

// --- Verificar autenticación ---
if (localStorage.getItem('gmao_logged_in') !== 'true') {
    alert('Debe iniciar sesión para acceder al sistema');
    window.location.href = '../index.html';
}

// --- Estado global ---
let charts = {};
let currentMetrics = null;

const STATE = {
    period: 'month',
    lugar: 'todos',
    tipo: 'todos',
    campana: '2024-25'
};

// --- Datos base por tipo de activo (anuales, para "todos los lugares / 2024-25") ---
const BASE_TIPO = {
    todos: {
        activos: 18,
        disponibilidad: 77.8,
        preventivoPct: 68,
        costoAnual: 277117,
        mtbf: 156,
        mttr: 4.2,
        averiasPorActivo: 2.8,
        rotacionInventario: 4.2,
        stockouts: 12
    },
    tractor: {
        activos: 8,
        disponibilidad: 75,
        preventivoPct: 70,
        costoAnual: 143166.6,
        mtbf: 165,
        mttr: 4.5,
        averiasPorActivo: 3.1,
        rotacionInventario: 4.5,
        stockouts: 5
    },
    cosechadora: {
        activos: 3,
        disponibilidad: 67,
        preventivoPct: 60,
        costoAnual: 84411.95,
        mtbf: 142,
        mttr: 5.8,
        averiasPorActivo: 3.5,
        rotacionInventario: 5.2,
        stockouts: 3
    },
    pulverizador: {
        activos: 3,
        disponibilidad: 73,
        preventivoPct: 65,
        costoAnual: 29659,
        mtbf: 158,
        mttr: 3.9,
        averiasPorActivo: 3.2,
        rotacionInventario: 3.8,
        stockouts: 2
    },
    riego: {
        activos: 2,
        disponibilidad: 85,
        preventivoPct: 75,
        costoAnual: 16179.45,
        mtbf: 178,
        mttr: 2.8,
        averiasPorActivo: 1.8,
        rotacionInventario: 3.5,
        stockouts: 1
    },
    otros: {
        activos: 2,
        disponibilidad: 78,
        preventivoPct: 72,
        costoAnual: 43698.55,
        mtbf: 160,
        mttr: 3.5,
        averiasPorActivo: 2.4,
        rotacionInventario: 4.0,
        stockouts: 1
    }
};

// Factores por periodo (para pasar de anual a semana / mes / trimestre / año)
const PERIOD_FACTORS = {
    week: 1 / 52,
    month: 1 / 12,
    quarter: 1 / 4,
    year: 1
};

// Factores por lugar (afectan sobre todo a costos y algo a disponibilidad)
const FACTOR_LUGAR_COSTO = {
    todos: 1,
    'fuente-el-olmo': 1.05,
    'huelva': 0.95,
    'moguer': 0.9
};

const FACTOR_LUGAR_DISP = {
    todos: 1,
    'fuente-el-olmo': 1.03,
    'huelva': 0.97,
    'moguer': 0.95
};

// Factores por campaña (ajustan costes principalmente)
const FACTOR_CAMPANA_COSTO = {
    'todos': 1,
    '2024-25': 1,
    '2023-24': 298500 / 277117, // un pelín más cara
    '2022-23': 285300 / 277117
};

// Datos reales de maquinaria (para algunos gráficos y rankings)
const DATOS_MAQUINAS = {
    totalMaquinas: 18,
    operativas: 11,
    enMantenimiento: 4,
    programadas: 3,
    inactivas: 0,
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
    costosPorTipo: {
        'Tractores': 143166.60,
        'Cosechadoras': 84411.95,
        'Pulverizadores': 29659.00,
        'Sistema Riego': 16179.45,
        'Otros': 43698.55
    }
};

// Helpers
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function randAround(base, pct = 0.05) {
    const factor = 1 + (Math.random() * 2 * pct - pct);
    return base * factor;
}

// =========================
//  CÁLCULO DE MÉTRICAS
// =========================

function computeMetrics(state) {
    const base = BASE_TIPO[state.tipo] || BASE_TIPO.todos;
    const periodFactor = PERIOD_FACTORS[state.period] || 1;
    const factorLugarCost = FACTOR_LUGAR_COSTO[state.lugar] || 1;
    const factorLugarDisp = FACTOR_LUGAR_DISP[state.lugar] || 1;
    const factorCampana = FACTOR_CAMPANA_COSTO[state.campana] || 1;

    // Costes
    const costoTotal = base.costoAnual * periodFactor * factorLugarCost * factorCampana;
    const costoPreventivo = costoTotal * base.preventivoPct / 100;
    const costoCorrectivo = costoTotal - costoPreventivo;

    // Disponibilidad
    const disponibilidad = clamp(base.disponibilidad * factorLugarDisp, 60, 99);

    // MTBF / MTTR se mueven ligeramente con la disponibilidad
    const mtbf = base.mtbf * (1 + (disponibilidad - base.disponibilidad) / 400);
    const mttr = base.mttr * (1 - (disponibilidad - base.disponibilidad) / 800);

    // Otros KPIs
    const averiasPorActivo = base.averiasPorActivo;
    const rotacionInventario = base.rotacionInventario;
    const stockouts = Math.round(base.stockouts * factorLugarCost * periodFactor * 12); // normalizado al periodo

    const totalActivos = Math.round(base.activos * (state.lugar === 'todos' ? 1 : 0.5));
    const operativos = Math.round(totalActivos * disponibilidad / 100);
    const enMantenimiento = Math.max(1, Math.round(totalActivos * 0.2));
    const programados = Math.max(0, totalActivos - operativos - enMantenimiento);

    const costoManoObra = costoTotal * 0.51;
    const costoRepuestos = costoTotal * 0.32;
    const costoExternos = costoTotal * 0.12;
    const costoOtros = costoTotal * 0.05;

    const costoPromedioPorActivo = totalActivos > 0 ? costoTotal / totalActivos : 0;

    return {
        state: { ...state },
        costoTotal,
        costoPreventivo,
        costoCorrectivo,
        costoManoObra,
        costoRepuestos,
        costoExternos,
        costoOtros,
        disponibilidad,
        preventivoPct: base.preventivoPct,
        correctivoPct: 100 - base.preventivoPct - 5, // dejamos ~5% "predictivo"
        mtbf,
        mttr,
        averiasPorActivo,
        rotacionInventario,
        stockouts,
        totalActivos,
        operativos,
        enMantenimiento,
        programados,
        costoPromedioPorActivo,
        ravPct: (costoTotal / (base.costoAnual * 10)) * 100 // suponemos VR = 10x coste anual
    };
}

// =========================
//  INICIALIZACIÓN DOM
// =========================

document.addEventListener('DOMContentLoaded', () => {
    // Cargar sección inicial
    mostrarSeccion('resumen');

    // Navegación top
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const section = link.dataset.section;
            mostrarSeccion(section);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Filtros
    const filtros = document.querySelectorAll('#period-filter, #lugar-filter, #tipo-filter, #campana-filter');
    filtros.forEach(f => f.addEventListener('change', onFiltersChange));

    // Primer cálculo + gráficas + KPIs
    recalculateAndRedraw();

    // Tooltips personalizados
    inicializarTooltips();
});

// =========================
//  FILTROS Y REDIBUJADO
// =========================

function onFiltersChange() {
    STATE.period = document.getElementById('period-filter').value;
    STATE.lugar = document.getElementById('lugar-filter').value;
    STATE.tipo = document.getElementById('tipo-filter').value;
    STATE.campana = document.getElementById('campana-filter').value;

    recalculateAndRedraw();
}

function recalculateAndRedraw() {
    currentMetrics = computeMetrics(STATE);
    actualizarKPIs(currentMetrics);
    destruirGraficas();
    inicializarGraficas(currentMetrics);

    console.log('✅ Filtros aplicados:', currentMetrics.state, 'Costo:', currentMetrics.costoTotal.toFixed(0));
}

// =========================
//  SECCIONES
// =========================

function mostrarSeccion(seccionId) {
    const sections = document.querySelectorAll('.bi-section');
    sections.forEach(section => section.classList.remove('active'));
    const seccionActiva = document.getElementById(seccionId);
    if (seccionActiva) seccionActiva.classList.add('active');
}

// =========================
//  KPIs EN PANTALLA
// =========================

function actualizarKPIs(m) {
    // === RESUMEN GENERAL (las 4 tarjetas grandes de arriba) ===
    const summaryCards = document.querySelectorAll('.kpi-summary-grid .card-value');
    if (summaryCards.length >= 4) {
        summaryCards[0].textContent = m.disponibilidad.toFixed(1) + '%';
        summaryCards[1].textContent = m.preventivoPct.toFixed(0) + '%';
        summaryCards[2].textContent = '€' + m.costoTotal.toLocaleString('es-ES', { maximumFractionDigits: 0 });
        summaryCards[3].textContent = (m.mttr / 24).toFixed(1) + ' días';
    }

    // === Sección Disponibilidad ===
    const dispCards = document.querySelectorAll('#disponibilidad .kpi-card .kpi-value');
    if (dispCards.length >= 6) {
        dispCards[0].innerHTML = m.disponibilidad.toFixed(1) + '<span>%</span>';
        dispCards[1].innerHTML = m.mtbf.toFixed(0) + '<span>h</span>';
        dispCards[2].innerHTML = m.mttr.toFixed(1) + '<span>h</span>';
        dispCards[3].textContent = m.averiasPorActivo.toFixed(1);
        dispCards[5].innerHTML = (m.correctivoPct * 0.48).toFixed(1) + '<span>%</span>'; // aproximamos paradas no planif.
    }

    // === Sección Preventivo vs Correctivo ===
    const prevCards = document.querySelectorAll('#preventivo .kpi-card .kpi-value');
    if (prevCards.length >= 4) {
        prevCards[0].innerHTML = m.preventivoPct.toFixed(0) + '<span>%</span>';
        prevCards[1].innerHTML = m.correctivoPct.toFixed(0) + '<span>%</span>';
    }

    // === Sección Órdenes de Trabajo ===
    const otCards = document.querySelectorAll('#ordenes .kpi-card .kpi-value');
    if (otCards.length >= 4) {
        const tiempoMedioDias = (m.mttr / 24) + 2; // añadimos espera de repuestos
        otCards[0].innerHTML = tiempoMedioDias.toFixed(1) + '<span>días</span>';
        otCards[1].textContent = m.enMantenimiento;
    }

    // === Sección Costos ===
    const costosCards = document.querySelectorAll('#costos .kpi-card .kpi-value');
    if (costosCards.length >= 4) {
        costosCards[0].textContent = '€' + m.costoTotal.toLocaleString('es-ES', { maximumFractionDigits: 0 });
        costosCards[1].textContent = '€' + m.costoManoObra.toLocaleString('es-ES', { maximumFractionDigits: 0 });
        costosCards[2].textContent = '€' + m.costoRepuestos.toLocaleString('es-ES', { maximumFractionDigits: 0 });
        costosCards[3].innerHTML = m.ravPct.toFixed(1) + '<span>%</span>';
    }

    // === Sección Repuestos ===
    const repuestosCards = document.querySelectorAll('#repuestos .kpi-card .kpi-value');
    if (repuestosCards.length >= 4) {
        repuestosCards[0].innerHTML = m.rotacionInventario.toFixed(1) + '<span>x/año</span>';
        repuestosCards[1].textContent = m.stockouts;
        repuestosCards[2].textContent = '€' + (m.costoRepuestos * 0.2).toLocaleString('es-ES', { maximumFractionDigits: 0 });
    }

    // === Sección Rendimiento ===
    const rendimientoCards = document.querySelectorAll('#operativos .kpi-card .kpi-value');
    if (rendimientoCards.length >= 4) {
        rendimientoCards[0].textContent = m.totalActivos;
        rendimientoCards[1].textContent = m.operativos;
        rendimientoCards[2].textContent = m.enMantenimiento;
        rendimientoCards[3].textContent = '€' + m.costoPromedioPorActivo.toLocaleString('es-ES', { maximumFractionDigits: 0 });
    }
}

// =========================
//  GRÁFICAS
// =========================

function destruirGraficas() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') chart.destroy();
    });
    charts = {};
}

function inicializarGraficas(m) {
    crearGraficoDistribucionMantenimiento(m);
    crearGraficoCostosEvolucion(m);
    crearGraficoDisponibilidadPorTipo(m);
    crearGraficoTopMaquinas(m);

    crearGraficoDisponibilidadEvolucion(m);
    crearGraficoMTBFMTTR(m);
    crearGraficoAverias(m);

    crearGraficoPrevCorrecHoras(m);
    crearGraficoPrevCorrecCostos(m);
    crearGraficoEvolucionPrevCorr(m);

    crearGraficoEstadoOT(m);
    crearGraficoProductividad(m);
    crearGraficoBacklog(m);

    crearGraficoDistribucionCostos(m);
    crearGraficoCostoTipo(m);
    crearGraficoEvolucionCostos(m);

    crearGraficoConsumoRepuestos(m);
    crearGraficoValorInventario(m);

    crearGraficoEstadoActivos(m);
    crearGraficoHorasOperacion(m);
    crearGraficoUtilizacion(m);
}

// --- Resumen General ---

function crearGraficoDistribucionMantenimiento(m) {
    const ctx = document.getElementById('chartMantenimientoDistribucion');
    if (!ctx) return;

    const preventivo = m.preventivoPct;
    const correctivo = m.correctivoPct;
    const predictivo = clamp(100 - preventivo - correctivo, 2, 15);

    charts.distribucionMant = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Preventivo', 'Correctivo', 'Predictivo'],
            datasets: [{
                data: [preventivo, correctivo, predictivo],
                backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function crearGraficoCostosEvolucion(m) {
    const ctx = document.getElementById('chartCostosEvolucion');
    if (!ctx) return;

    const period = STATE.period;
    let labels;
    if (period === 'week') labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    else if (period === 'month') labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    else if (period === 'quarter') labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    else labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const base = m.costoTotal / labels.length;
    const data = labels.map(() => randAround(base, 0.15));

    charts.costosEvol = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Costos (€)',
                data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    ticks: {
                        callback: v => '€' + v.toLocaleString()
                    }
                }
            }
        }
    });
}

function crearGraficoDisponibilidadPorTipo(m) {
    const ctx = document.getElementById('chartDisponibilidadTipo');
    if (!ctx) return;

    const labels = ['Riego', 'Tractores', 'Otros', 'Cosechadoras', 'Pulverizadores'];
    const data = [85, 75, 78, 67, 73];

    charts.dispTipo = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                label: 'Disponibilidad (%)',
                backgroundColor: ['#20c997', '#17a2b8', '#6c757d', '#28a745', '#ffc107']
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    max: 100,
                    ticks: { callback: v => v + '%' }
                }
            }
        }
    });
}

function crearGraficoTopMaquinas() {
    const ctx = document.getElementById('chartTopMaquinas');
    if (!ctx) return;

    const tipo = STATE.tipo;
    let maquinas = Object.entries(DATOS_MAQUINAS.costosPorMaquina);

    if (tipo !== 'todos') {
        maquinas = maquinas.filter(([id]) => {
            if (tipo === 'tractor') return id.startsWith('TR-') || id.startsWith('CT-');
            if (tipo === 'cosechadora') return id.startsWith('CS-');
            if (tipo === 'pulverizador') return id.startsWith('PV-');
            if (tipo === 'riego') return id.startsWith('RI-');
            if (tipo === 'otros') return id.startsWith('GE-') || id.startsWith('IN-');
            return true;
        });
    }

    const top = maquinas.sort((a, b) => b[1] - a[1]).slice(0, 5);

    charts.topMaquinas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: top.map(m => m[0]),
            datasets: [{
                data: top.map(m => m[1]),
                label: 'Costo (€)',
                backgroundColor: '#dc3545'
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    ticks: { callback: v => '€' + v.toLocaleString() }
                }
            }
        }
    });
}

// --- Disponibilidad ---

function crearGraficoDisponibilidadEvolucion(m) {
    const ctx = document.getElementById('chartDisponibilidadEvolucion');
    if (!ctx) return;

    const period = STATE.period;
    let labels;
    if (period === 'week') labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    else if (period === 'month') labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    else if (period === 'quarter') labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    else labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const dispData = labels.map(() => clamp(randAround(m.disponibilidad, 0.03), 60, 99));
    const mtbfData = labels.map(() => randAround(m.mtbf, 0.08));

    charts.dispEvol = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Disponibilidad (%)',
                    data: dispData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40,167,69,0.1)',
                    yAxisID: 'y',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'MTBF (h)',
                    data: mtbfData,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0,123,255,0.1)',
                    yAxisID: 'y1',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { position: 'left', title: { display: true, text: 'Disponibilidad (%)' } },
                y1: { position: 'right', title: { display: true, text: 'MTBF (h)' }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function crearGraficoMTBFMTTR(m) {
    const ctx = document.getElementById('chartMTBFMTTR');
    if (!ctx) return;

    const labels = ['Tractores', 'Cosechadoras', 'Pulverizadores', 'Riego'];
    const mtbfData = [165, 142, 158, 178];
    const mttrData = [4.5, 5.8, 3.9, 2.8];

    charts.mtbfmttr = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'MTBF (h)', data: mtbfData, backgroundColor: '#28a745' },
                { label: 'MTTR (h)', data: mttrData, backgroundColor: '#dc3545' }
            ]
        },
        options: {
            plugins: { legend: { position: 'bottom' } },
            scales: { y: { beginAtZero: true } }
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
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// --- Preventivo vs Correctivo ---

function crearGraficoPrevCorrecHoras(m) {
    const ctx = document.getElementById('chartPrevCorrecHoras');
    if (!ctx) return;

    charts.prevCorrecHoras = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Preventivo', 'Correctivo'],
            datasets: [{
                data: [m.preventivoPct, m.correctivoPct],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function crearGraficoPrevCorrecCostos(m) {
    const ctx = document.getElementById('chartPrevCorrecCostos');
    if (!ctx) return;

    charts.prevCorrecCostos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Preventivo', 'Correctivo'],
            datasets: [{
                data: [m.costoPreventivo, m.costoCorrectivo],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.label + ': €' + ctx.parsed.toLocaleString()
                    }
                }
            }
        }
    });
}

function crearGraficoEvolucionPrevCorr(m) {
    const ctx = document.getElementById('chartEvolucionPrevCorr');
    if (!ctx) return;

    const period = STATE.period;
    let labels;
    if (period === 'week') labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    else if (period === 'month') labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    else if (period === 'quarter') labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    else labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const prevData = labels.map(() => randAround(m.preventivoPct, 0.05));
    const corrData = labels.map((_, i) => 100 - prevData[i]);

    charts.evolPrevCorr = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Preventivo', data: prevData, borderColor: '#28a745', backgroundColor: 'rgba(40,167,69,0.1)', tension: 0.4, fill: true },
                { label: 'Correctivo', data: corrData, borderColor: '#dc3545', backgroundColor: 'rgba(220,53,69,0.1)', tension: 0.4, fill: true }
            ]
        },
        options: {
            plugins: { legend: { position: 'bottom' } },
            scales: {
                y: { max: 100, ticks: { callback: v => v + '%' } }
            }
        }
    });
}

// --- Órdenes de Trabajo ---

function crearGraficoEstadoOT(m) {
    const ctx = document.getElementById('chartEstadoOT');
    if (!ctx) return;

    const totalOT = Math.max(10, m.totalActivos * 8);
    const completadas = Math.round(totalOT * 0.7);
    const abiertas = Math.round(totalOT * 0.1);
    const enProgreso = Math.round(totalOT * 0.15);
    const retrasadas = totalOT - completadas - abiertas - enProgreso;

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
            plugins: { legend: { position: 'bottom' } }
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
                data: [15, 13, 12, 11, 9],
                label: 'OTs Completadas',
                backgroundColor: '#667eea'
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function crearGraficoBacklog(m) {
    const ctx = document.getElementById('chartBacklog');
    if (!ctx) return;

    const period = STATE.period;
    let labels;
    if (period === 'week') labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    else if (period === 'month') labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    else if (period === 'quarter') labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    else labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const base = m.totalActivos * 0.8;
    const data = labels.map(() => Math.max(0, randAround(base, 0.25)));

    charts.backlog = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Máquinas en Servicio',
                data,
                borderColor: '#ffc107',
                backgroundColor: 'rgba(255,193,7,0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            plugins: { legend: { display: false } }
        }
    });
}

// --- Costos ---

function crearGraficoDistribucionCostos(m) {
    const ctx = document.getElementById('chartDistribucionCostos');
    if (!ctx) return;

    charts.distCostos = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Mano de Obra', 'Repuestos', 'Externos', 'Otros'],
            datasets: [{
                data: [m.costoManoObra, m.costoRepuestos, m.costoExternos, m.costoOtros],
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#6c757d']
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.label + ': €' + ctx.parsed.toLocaleString()
                    }
                }
            }
        }
    });
}

function crearGraficoCostoTipo() {
    const ctx = document.getElementById('chartCostoTipo');
    if (!ctx) return;

    const tipo = STATE.tipo;

    let labels, data;
    if (tipo === 'todos') {
        labels = ['Tractores', 'Cosechadoras', 'Otros', 'Pulverizadores', 'Riego'];
        data = [
            DATOS_MAQUINAS.costosPorTipo['Tractores'],
            DATOS_MAQUINAS.costosPorTipo['Cosechadoras'],
            DATOS_MAQUINAS.costosPorTipo['Otros'],
            DATOS_MAQUINAS.costosPorTipo['Pulverizadores'],
            DATOS_MAQUINAS.costosPorTipo['Sistema Riego']
        ];
    } else {
        // Desglose por máquina para el tipo seleccionado
        const all = Object.entries(DATOS_MAQUINAS.costosPorMaquina).filter(([id]) => {
            if (tipo === 'tractor') return id.startsWith('TR-') || id.startsWith('CT-');
            if (tipo === 'cosechadora') return id.startsWith('CS-');
            if (tipo === 'pulverizador') return id.startsWith('PV-');
            if (tipo === 'riego') return id.startsWith('RI-');
            if (tipo === 'otros') return id.startsWith('GE-') || id.startsWith('IN-');
            return true;
        });
        labels = all.map(m => m[0]);
        data = all.map(m => m[1]);
    }

    charts.costoTipo = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                label: 'Costo Total (€)',
                backgroundColor: '#667eea'
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: { ticks: { callback: v => '€' + v.toLocaleString() } }
            }
        }
    });
}

function crearGraficoEvolucionCostos(m) {
    const ctx = document.getElementById('chartEvolucionCostos');
    if (!ctx) return;

    const period = STATE.period;
    let labels;
    if (period === 'week') labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    else if (period === 'month') labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    else if (period === 'quarter') labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    else labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const basePrev = m.costoPreventivo / labels.length;
    const baseCorr = m.costoCorrectivo / labels.length;

    const prevData = labels.map(() => randAround(basePrev, 0.15));
    const corrData = labels.map(() => randAround(baseCorr, 0.2));

    charts.evolCostos = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                { label: 'Preventivo', data: prevData, borderColor: '#28a745', backgroundColor: 'rgba(40,167,69,0.1)', tension: 0.4, fill: true },
                { label: 'Correctivo', data: corrData, borderColor: '#dc3545', backgroundColor: 'rgba(220,53,69,0.1)', tension: 0.4, fill: true }
            ]
        },
        options: {
            plugins: { legend: { position: 'bottom' } },
            scales: {
                y: { ticks: { callback: v => '€' + v.toLocaleString() } }
            }
        }
    });
}

// --- Repuestos ---

function crearGraficoConsumoRepuestos(m) {
    const ctx = document.getElementById('chartConsumoRepuestos');
    if (!ctx) return;

    const period = STATE.period;
    let labels;
    if (period === 'week') labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    else if (period === 'month') labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    else if (period === 'quarter') labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    else labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const base = m.costoRepuestos / labels.length;
    const data = labels.map(() => randAround(base, 0.2));

    charts.consumoRepuestos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Consumo (€)',
                data,
                backgroundColor: '#17a2b8'
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { ticks: { callback: v => '€' + v.toLocaleString() } } }
        }
    });
}

function crearGraficoValorInventario(m) {
    const ctx = document.getElementById('chartValorInventario');
    if (!ctx) return;

    const period = STATE.period;
    let labels;
    if (period === 'week') labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    else if (period === 'month') labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    else if (period === 'quarter') labels = ['Mes 1', 'Mes 2', 'Mes 3'];
    else labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const valorInicial = m.costoRepuestos * 1.5;
    const data = labels.map((_, i) => valorInicial - i * (valorInicial * 0.03) + (Math.random() * valorInicial * 0.01));

    charts.valorInventario = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Valor (€)',
                data,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40,167,69,0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { ticks: { callback: v => '€' + v.toLocaleString() } } }
        }
    });
}

// --- Rendimiento ---

function crearGraficoEstadoActivos(m) {
    const ctx = document.getElementById('chartEstadoActivos');
    if (!ctx) return;

    charts.estadoActivos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Operativos', 'En Mantenimiento', 'Programados', 'Inactivos'],
            datasets: [{
                data: [m.operativos, m.enMantenimiento, m.programados, 0],
                backgroundColor: ['#28a745', '#ffc107', '#007bff', '#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = total ? (ctx.parsed / total) * 100 : 0;
                            return `${ctx.label}: ${ctx.parsed} (${pct.toFixed(1)}%)`;
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

    const tipo = STATE.tipo;
    let labels, data, colors;

    if (tipo === 'tractor') {
        labels = ['TR-001', 'TR-003', 'TR-004', 'TR-005', 'TR-012', 'CT-001', 'TR-008', 'TR-006'];
        data = [2845, 3012, 1890, 2734, 2650, 2156, 2148, 1245];
        colors = '#007bff';
    } else if (tipo === 'cosechadora') {
        labels = ['CS-002', 'CS-003', 'CS-004'];
        data = [2345, 2678, 2526];
        colors = '#28a745';
    } else if (tipo === 'pulverizador') {
        labels = ['PV-002', 'PV-005', 'PV-010'];
        data = [1389, 1234, 1450];
        colors = '#6f42c1';
    } else if (tipo === 'riego') {
        labels = ['RI-004', 'RI-009'];
        data = [5234, 5456];
        colors = '#17a2b8';
    } else if (tipo === 'otros') {
        labels = ['GE-006', 'IN-007', 'IN-011'];
        data = [5892, 3967, 2100];
        colors = '#ffc107';
    } else {
        labels = ['Tractores', 'Cosechadoras', 'Generador', 'Riego', 'Pulverizadores'];
        data = [18597, 7549, 5892, 10690, 4073];
        colors = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1'];
    }

    charts.horasOperacion = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Horas de Operación',
                data,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: { ticks: { callback: v => v.toLocaleString() + 'h' } }
            }
        }
    });
}

function crearGraficoUtilizacion() {
    const ctx = document.getElementById('chartUtilizacion');
    if (!ctx) return;

    const tipo = STATE.tipo;
    let labels, data;

    if (tipo === 'tractor') {
        labels = ['TR-001', 'TR-003', 'TR-005', 'TR-004', 'TR-002', 'TR-006', 'CT-001', 'TR-007'];
        data = [85, 92, 88, 72, 78, 45, 65, 70];
    } else if (tipo === 'cosechadora') {
        labels = ['CS-003', 'CS-002', 'CS-004'];
        data = [95, 78, 85];
    } else if (tipo === 'pulverizador') {
        labels = ['PV-005', 'PV-002', 'PV-010'];
        data = [60, 68, 72];
    } else if (tipo === 'riego') {
        labels = ['RI-004', 'RI-009'];
        data = [90, 92];
    } else if (tipo === 'otros') {
        labels = ['GE-006', 'IN-007', 'IN-011'];
        data = [88, 75, 65];
    } else {
        labels = ['TR-001', 'TR-003', 'TR-005', 'TR-004', 'CS-003', 'CS-002', 'RI-004', 'RI-009'];
        data = [85, 92, 88, 72, 95, 78, 90, 92];
    }

    charts.utilizacion = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Utilización (%)',
                data,
                backgroundColor: ctx => {
                    const value = ctx.parsed.y;
                    if (value >= 80) return '#28a745';
                    if (value >= 60) return '#ffc107';
                    return '#dc3545';
                }
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    max: 100,
                    ticks: { callback: v => v + '%' }
                }
            }
        }
    });
}

// =========================
//  TOOLTIP PERSONALIZADO
// =========================

// =========================
//  TOOLTIP PERSONALIZADO
// =========================

function inicializarTooltips() {
    // --- Tooltips para KPIs / tarjetas ---
    const tooltipKPI = {
        // Resumen general
        disponibilidad: {
            title: 'Disponibilidad Técnica',
            desc: 'Porcentaje de tiempo que los activos han estado operativos y listos para producir en el periodo seleccionado.',
            source: 'Disponibilidad = Horas operativas / Horas totales planificadas',
            comparison: 'Objetivo > 85% | Referencia sector agro: 75–80%.'
        },
        preventivo: {
            title: 'Peso del Mantenimiento Preventivo',
            desc: 'Porcentaje de horas / OTs dedicadas a mantenimiento planificado frente al total.',
            source: 'Basado en OT marcadas como Preventivas vs Correctivas.',
            comparison: 'Modelo maduro: ≥ 70% preventivo, ≤ 30% correctivo.'
        },
        'costo-total': {
            title: 'Costo Total de Mantenimiento',
            desc: 'Suma de todos los costes de mantenimiento (mano de obra, repuestos, servicios externos y otros) en el periodo y filtros activos.',
            source: 'Coste estimado según tipo de activo, lugar, campaña y periodo.',
            comparison: 'Para evaluar, compáralo con el RAV% (valor de reposición).',
            miniChart: {
                labels: ['MO', 'Repuestos', 'Externos', 'Otros'],
                values: [51, 32, 12, 5]
            }
        },
        'tiempo-resolucion': {
            title: 'Tiempo Medio de Resolución',
            desc: 'Tiempo promedio desde que se abre una orden de trabajo hasta que se cierra, incluyendo diagnóstico y validación.',
            source: 'Incluye: diagnóstico + espera de repuestos + reparación + verificación.',
            comparison: 'Cuanto más cerca de 0, mejor. Analiza también por tipo de activo.'
        },

        // Sección DISPONIBILIDAD
        mtbf: {
            title: 'MTBF (Mean Time Between Failures)',
            desc: 'Horas promedio de operación entre averías. Es un indicador directo de fiabilidad.',
            source: 'MTBF = Horas de operación / Nº de averías registradas.',
            comparison: 'Debe crecer en el tiempo si el plan preventivo es efectivo.'
        },
        mttr: {
            title: 'MTTR (Mean Time To Repair)',
            desc: 'Tiempo medio que tardas en devolver un equipo a servicio una vez se avería.',
            source: 'MTTR = Tiempo total de reparación / Nº de reparaciones.',
            comparison: 'Ideal: MTTR bajo + MTBF alto.'
        },
        'averias-activo': {
            title: 'Averías por Activo',
            desc: 'Promedio de averías registradas por cada activo en el periodo.',
            source: 'Contabiliza solo averías con OT asociada.',
            comparison: 'Útil para detectar “activos problema” (los que se disparan por encima de la media).'
        },
        criticidad: {
            title: 'Índice de Criticidad',
            desc: 'Valor agregado que combina impacto en producción, seguridad y coste de cada activo.',
            source: 'Escala 1–10. Los activos > 7 deberían tener más preventivo y repuestos críticos garantizados.',
            comparison: 'Revisa planes de mantenimiento de los activos de mayor criticidad.'
        },
        'paradas-no-planificadas': {
            title: 'Paradas No Planificadas',
            desc: 'Porcentaje del tiempo total de parada que ha sido debido a averías no planificadas.',
            source: 'Calculado a partir de OTs correctivas con impacto en producción.',
            comparison: 'La meta es que vaya bajando a medida que el preventivo madura.'
        },

        // Sección PREVENTIVO vs CORRECTIVO
        'cumplimiento-plan': {
            title: 'Cumplimiento del Plan Preventivo',
            desc: 'Porcentaje de OTs preventivas realizadas frente a las programadas.',
            source: 'Cubre tanto OTs realizadas a tiempo como con ligero retraso.',
            comparison: 'Buen objetivo: ≥ 90% de cumplimiento.'
        },
        'preventivos-retrasados': {
            title: 'Preventivos Retrasados',
            desc: 'Número de OTs preventivas que han sobrepasado su fecha programada.',
            source: 'Importante revisarlo en activos críticos o de seguridad.',
            comparison: 'Ideal mantenerlo cercano a 0 o limitado a activos no críticos.'
        },

        // Sección ÓRDENES
        'maquinas-mantenimiento': {
            title: 'Máquinas en Mantenimiento',
            desc: 'Activos que actualmente tienen una OT abierta que los saca (total o parcialmente) de servicio.',
            source: 'Incluye OTs en estado En Progreso / Paradas.',
            comparison: 'Si es demasiado alto frecuente, revisa capacidad del equipo y stock de repuestos.'
        },
        'oms-tiempo': {
            title: 'Órdenes Cerradas a Tiempo',
            desc: 'Porcentaje de OTs que se cierran dentro del plazo objetivo definido.',
            source: 'Comparación entre fecha compromiso y fecha real de cierre.',
            comparison: 'Indicador clave de disciplina operativa y planificación realista.'
        },
        'oms-tecnico': {
            title: 'Órdenes por Técnico',
            desc: 'Carga media de trabajo por técnico en el periodo.',
            source: 'Cuenta OTs asignadas y cerradas por técnico.',
            comparison: 'Permite equilibrar carga y detectar cuellos de botella.'

        },

        // Sección COSTOS
        'mano-obra': {
            title: 'Mano de Obra',
            desc: 'Costes asociados a técnicos internos/externos en tareas de mantenimiento.',
            source: 'Basado en horas estimadas × tarifa estándar.',
            comparison: 'Idealmente controlado a través de buen preventivo y planificación.'
        },
        repuestos: {
            title: 'Repuestos',
            desc: 'Coste de materiales y piezas consumidas en el mantenimiento.',
            source: 'Incluye repuestos preventivos y correctivos.',
            comparison: 'Revisar junto con rotación de inventario y stock inmovilizado.'
        },
        rav: {
            title: 'RAV% (Replacement Asset Value)',
            desc: 'Proporción del coste de mantenimiento respecto al valor de reposición de los activos.',
            source: 'RAV% = Coste anual / Valor de reposición.',
            comparison: 'Excelente: <3% | Bueno: 3–5% | Alto: >5%.',

        },

        // Sección REPUESTOS
        'rotacion-inventario': {
            title: 'Rotación de Inventario',
            desc: 'Número de veces que renuevas el valor del inventario de repuestos en un año.',
            source: 'Rotación = Consumo anual / Valor medio de inventario.',
            comparison: 'Entre 4 y 6 suele ser un rango sano (depende del tipo de activo).'
        },
        'stock-outs': {
            title: 'Stock-outs',
            desc: 'Número de veces que un repuesto no estaba disponible cuando se necesitaba.',
            source: 'Solo cuenta repuestos marcados como críticos o de alta rotación.',
            comparison: 'Debería tender a 0 en repuestos críticos.'
        },
        'stock-inmovilizado': {
            title: 'Stock Inmovilizado',
            desc: 'Valor del inventario que no se ha movido en un periodo largo (ej. > 12 meses).',
            source: 'Basado en fecha de último movimiento / consumo.',
            comparison: 'Indicador de sobrestock o mala parametrización del catálogo.'
        },
        'repuestos-ok': {
            title: 'Repuestos Críticos OK',
            desc: 'Porcentaje de referencias críticas que tienen stock suficiente según la política de seguridad definida.',
            source: 'Comparación entre stock actual y stock mínimo por referencia crítica.',
            comparison: 'Objetivo: 100% asegurados.'
        },

        // Sección RENDIMIENTO
        'total-activos': {
            title: 'Total de Activos',
            desc: 'Número de activos incluidos en el análisis según los filtros actuales (tipo, lugar, campaña).',
            source: 'Inventario técnico de GMAO para la combinación de filtros.',
            comparison: 'Sirve de contexto para interpretar ratios y costes medios.'
        },
        'activos-disponibles': {
            title: 'Activos Disponibles',
            desc: 'Activos que podrían ser utilizados en producción (no están parados por mantenimiento).',
            source: 'Se basa en estados Operativo / Programado vs En mantenimiento.',
            comparison: 'Ideal que la mayoría del parque esté disponible en picos de campaña.'
        },
        'en-mantenimiento': {
            title: 'Activos en Mantenimiento',
            desc: 'Activos que actualmente tienen una orden de trabajo que limita su uso.',
            source: 'OTs abiertas con impacto en disponibilidad.',
            comparison: 'Suele subir antes de campaña si haces bien el preventivo.'
        },
        'costo-promedio-activo': {
            title: 'Costo Promedio por Activo',
            desc: 'Coste medio de mantenimiento por activo en el periodo y filtros aplicados.',
            source: 'Coste total / nº de activos incluidos.',
            comparison: 'Útil para comparar tipos de equipos, zonas o campañas.'
        }
    };

    // --- Tooltips para GRÁFICOS / visuales ---
    const tooltipCharts = {
        'chartMantenimientoDistribucion': {
            title: 'Distribución de Mantenimiento',
            desc: 'Muestra el peso relativo del mantenimiento preventivo, correctivo y predictivo.',
            source: 'Calculado con las OTs del periodo seleccionado.',
            comparison: 'Objetivo típico: ≥ 70% preventivo, ≤ 30% correctivo.'
        },
        'chartCostosEvolucion': {
            title: 'Evolución de Costes',
            desc: 'Cómo se han repartido los costes de mantenimiento a lo largo del periodo (semanas/meses).',
            source: 'Incluye mano de obra, repuestos y servicios externos.',
            comparison: 'Busca picos anómalos asociados a averías críticas o campañas.'
        },
        'chartDisponibilidadTipo': {
            title: 'Disponibilidad por Tipo de Máquina',
            desc: 'Compara la disponibilidad de los distintos tipos de activos (tractores, riego, etc.).',
            source: 'Disponibilidad calculada por tipo para el periodo filtrado.',
            comparison: 'Útil para priorizar inversiones o mejoras de mantenimiento.'
        },
        'chartTopMaquinas': {
            title: 'Top Máquinas por Costo',
            desc: 'Ranking de activos que más coste acumulan en el periodo.',
            source: 'Basado en coste total (MO + repuestos + externos) por activo.',
            comparison: 'Candidatos a renovación, rediseño del plan preventivo o análisis de uso.'
        },
        'chartDisponibilidadEvolucion': {
            title: 'Evolución de Disponibilidad y MTBF',
            desc: 'Permite ver si la disponibilidad y la fiabilidad (MTBF) mejoran o empeoran en el tiempo.',
            source: 'Agrupado según el periodo seleccionado (semana, mes, trimestre, año).',
            comparison: 'Una tendencia positiva indica buen ajuste del plan de mantenimiento.'
        },
        'chartMTBFMTTR': {
            title: 'MTBF vs MTTR por Tipo',
            desc: 'Contrasta equipos que fallan mucho (MTBF bajo) con equipos que tardan mucho en repararse (MTTR alto).',
            source: 'Datos agregados por tipo de activo.',
            comparison: 'Ideal: MTBF alto y MTTR bajo.'
        },
        'chartAverias': {
            title: 'Distribución de Tipos de Avería',
            desc: 'Reparte las averías según su naturaleza (mecánica, eléctrica, hidráulica, etc.).',
            source: 'Clasificación de averías en las OTs registradas.',
            comparison: 'Ayuda a decidir qué competencias técnicas reforzar o qué repuestos asegurar.'
        },
        'chartPrevCorrecHoras': {
            title: 'Horas: Preventivo vs Correctivo',
            desc: 'Ver cómo se distribuyen las horas de mantenimiento entre tareas planificadas y reparaciones.',
            source: 'Horas declaradas en OTs preventivas vs correctivas.',
            comparison: 'Una proporción alta de correctivo suele implicar más paradas no planificadas.'
        },
        'chartPrevCorrecCostos': {
            title: 'Costes: Preventivo vs Correctivo',
            desc: 'Cuánto dinero se va en trabajos preventivos frente a correctivos.',
            source: 'Coste asociado al tipo de OT.',
            comparison: 'Invertir más en preventivo suele reducir los costes correctivos a medio plazo.'
        },
        'chartEvolucionPrevCorr': {
            title: 'Evolución Preventivo/Correctivo',
            desc: 'Muestra si estás ganando terreno al correctivo a lo largo del tiempo.',
            source: 'Porcentaje mensual / semanal de cada tipo.',
            comparison: 'Una línea de preventivo al alza generalmente es buena señal.'
        },
        'chartEstadoOT': {
            title: 'Estado de las Órdenes de Trabajo',
            desc: 'Foto rápida del backlog: abiertas, en progreso, completadas y retrasadas.',
            source: 'Estados actuales de las OTs en el sistema.',
            comparison: 'Un exceso de retrasadas indica saturación o mala planificación.'
        },
        'chartProductividad': {
            title: 'Productividad por Técnico',
            desc: 'OTs completadas por cada técnico en el periodo.',
            source: 'Cuenta de OTs cerradas por técnico.',
            comparison: 'Permite equilibrar carga y detectar buenas prácticas.'
        },
        'chartBacklog': {
            title: 'Evolución del Backlog',
            desc: 'Cuántas máquinas pendientes de servicio tienes a lo largo del tiempo.',
            source: 'OTs abiertas o en servicio por periodo.',
            comparison: 'Ideal que el backlog no crezca de forma sostenida.'
        },
        'chartDistribucionCostos': {
            title: 'Distribución de Costes de Mantenimiento',
            desc: 'Cómo se reparte el coste entre mano de obra, repuestos, externos y otros.',
            source: 'Desglose del coste total calculado.',
            comparison: 'Revisa desvíos grandes, por ejemplo, excesiva dependencia de servicios externos.'
        },
        'chartCostoTipo': {
            title: 'Coste por Tipo de Máquina',
            desc: 'Permite ver qué tipos de activo concentran más gasto de mantenimiento.',
            source: 'Coste total por tipo / por máquina según filtro.',
            comparison: 'Puedes usarlo para priorizar renovaciones o reformas técnicas.'
        },
        'chartEvolucionCostos': {
            title: 'Evolución Mensual de Costes',
            desc: 'Detalle de cómo se reparten los costes preventivos y correctivos a lo largo del periodo.',
            source: 'Costes simulados pero coherentes con los filtros y KPIs.',
            comparison: 'Picos marcados + correctivo alto suelen señalar averías importantes.'
        },
        'chartConsumoRepuestos': {
            title: 'Consumo de Repuestos',
            desc: 'Importe consumido en repuestos por periodo (semana/mes).',
            source: 'Coste de repuestos consumidos.',
            comparison: 'Picos pueden asociarse a grandes reparaciones o campañas.'
        },
        'chartValorInventario': {
            title: 'Valor del Inventario',
            desc: 'Valor aproximado del inventario de repuestos a lo largo del tiempo.',
            source: 'Simulación en base a consumo y reposición.',
            comparison: 'Sirve para vigilar que el inventario no crece sin control ni cae por debajo de lo seguro.'
        },
        'chartEstadoActivos': {
            title: 'Estado de los Activos',
            desc: 'Distribución de activos operativos, en mantenimiento, programados e inactivos.',
            source: 'Estados de activo combinados con las OTs abiertas.',
            comparison: 'Muy útil en campaña para ver si el parque disponible es suficiente.'
        },
        'chartHorasOperacion': {
            title: 'Horas de Operación',
            desc: 'Horas acumuladas de trabajo por tipo de equipo o por activo individual.',
            source: 'Horas simuladas alineadas con el tipo de activo.',
            comparison: 'Activos con muchas horas + coste alto suelen estar cerca de fin de vida útil.'
        },
        'chartUtilizacion': {
            title: 'Utilización de Activos',
            desc: 'Porcentaje de uso de cada activo respecto a su capacidad esperada.',
            source: 'Orientativo en base a horas de operación y disponibilidad.',
            comparison: 'Valores muy bajos pueden indicar infrautilización o problemas de planificación.'
        }
    };

    // --- Tooltips para pestañas de navegación ---
    const tooltipTabs = {
        resumen: {
            title: 'Resumen General',
            desc: 'Visión ejecutiva de la salud del mantenimiento: disponibilidad, preventivo, coste y tiempos.',
            source: 'Agrega los KPIs clave más representativos.',
            comparison: 'Ideal para revisar en reuniones de seguimiento.'
        },
        disponibilidad: {
            title: 'Disponibilidad y Salud del Activo',
            desc: 'Indicadores de fiabilidad (MTBF), mantenibilidad (MTTR) y criticidad.',
            source: 'Enfocado en continuidad operativa y estabilidad del parque.',
            comparison: 'Se complementa con los costes para tomar decisiones de inversión.'
        },
        preventivo: {
            title: 'Preventivo vs Correctivo',
            desc: 'Analiza el equilibrio entre trabajo planificado y reparaciones de emergencia.',
            source: 'Compara horas, costes y evolución temporal.',
            comparison: 'Clave para reducir paradas no planificadas y costes a largo plazo.'
        },
        ordenes: {
            title: 'Órdenes de Mantenimiento',
            desc: 'Gestión operativa del trabajo diario: backlog, estados y productividad.',
            source: 'Mira el flujo de OTs en el tiempo.',
            comparison: 'Muy útil para jefes de equipo y planificación.'
        },
        costos: {
            title: 'Costos de Mantenimiento',
            desc: 'Detalle del gasto y su distribución por tipo, periodo y tipo de mantenimiento.',
            source: 'Basado en modelo de costes asociados a cada activo.',
            comparison: 'Conecta directamente con decisiones financieras.'
        },
        repuestos: {
            title: 'Repuestos y Almacén',
            desc: 'Stock, rotación, roturas y valor inmovilizado.',
            source: 'Pensado para coordinación entre mantenimiento y almacén.',
            comparison: 'Busca equilibrio entre servicio y capital inmovilizado.'
        },
        operativos: {
            title: 'Rendimiento de Activos',
            desc: 'Disponibilidad real del parque, utilización y costes por activo.',
            source: 'Conecta inventario, uso y costes para tomar decisiones tácticas.',
            comparison: 'Ideal para priorizar renovaciones o reasignaciones de equipos.'
        }
    };

    // Crear el elemento tooltip flotante
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-custom';
    document.body.appendChild(tooltip);

    // Esperar un poco a que el DOM esté listo
    setTimeout(() => {
        agregarTooltipAElementos(tooltipKPI, tooltipCharts, tooltipTabs, tooltip);
    }, 400);
}

function agregarTooltipAElementos(tooltipKPI, tooltipCharts, tooltipTabs, tooltipElement) {
    // --- KPI cards (todas las tarjetas de métricas) ---
    document.querySelectorAll('.kpi-card').forEach(card => {
        const labelText = (card.querySelector('.kpi-label')?.textContent || '').toLowerCase();
        let key = null;

        if (labelText.includes('disponibilidad')) key = 'disponibilidad';
        else if (labelText.includes('mtbf')) key = 'mtbf';
        else if (labelText.includes('mttr')) key = 'mttr';
        else if (labelText.includes('averías por activo')) key = 'averias-activo';
        else if (labelText.includes('criticidad')) key = 'criticidad';
        else if (labelText.includes('paradas no planificadas')) key = 'paradas-no-planificadas';
        else if (labelText.includes('mantenimiento preventivo')) key = 'preventivo';
        else if (labelText.includes('mantenimiento correctivo')) key = 'correctivo';
        else if (labelText.includes('cumplimiento plan')) key = 'cumplimiento-plan';
        else if (labelText.includes('preventivos retrasados')) key = 'preventivos-retrasados';
        else if (labelText.includes('máquinas en mantenimiento')) key = 'maquinas-mantenimiento';
        else if (labelText.includes('oms cerradas')) key = 'oms-tiempo';
        else if (labelText.includes('oms por técnico')) key = 'oms-tecnico';
        else if (labelText.includes('costo total')) key = 'costo-total';
        else if (labelText.includes('mano de obra')) key = 'mano-obra';
        else if (labelText.includes('repuestos (32%')) key = 'repuestos';
        else if (labelText.includes('rav')) key = 'rav';
        else if (labelText.includes('rotación inventario')) key = 'rotacion-inventario';
        else if (labelText.includes('stock-outs')) key = 'stock-outs';
        else if (labelText.includes('stock inmovilizado')) key = 'stock-inmovilizado';
        else if (labelText.includes('repuestos críticos ok')) key = 'repuestos-ok';
        else if (labelText.includes('total activos')) key = 'total-activos';
        else if (labelText.includes('activos disponibles')) key = 'activos-disponibles';
        else if (labelText.includes('en mantenimiento')) key = 'en-mantenimiento';
        else if (labelText.includes('costo promedio/activo')) key = 'costo-promedio-activo';
        else if (labelText.includes('tiempo medio resolución')) key = 'tiempo-resolucion';

        if (key && tooltipKPI[key]) {
            card.setAttribute('data-tooltip', key);
            agregarEventosTooltip(card, tooltipKPI[key], tooltipElement);
        }
    });

    // --- Summary cards del Resumen General ---
    document.querySelectorAll('.summary-card').forEach(card => {
        const labelText = (card.querySelector('.card-label')?.textContent || '').toLowerCase();
        let key = null;

        if (labelText.includes('disponibilidad')) key = 'disponibilidad';
        else if (labelText.includes('preventivo')) key = 'preventivo';
        else if (labelText.includes('costo total')) key = 'costo-total';
        else if (labelText.includes('tiempo resolución')) key = 'tiempo-resolucion';

        if (key && tooltipKPI[key]) {
            card.setAttribute('data-tooltip', key);
            agregarEventosTooltip(card, tooltipKPI[key], tooltipElement);
        }
    });

    // --- Chart containers / visuales ---
    document.querySelectorAll('.chart-container').forEach(container => {
        const canvas = container.querySelector('canvas');
        if (!canvas) return;
        const chartId = canvas.id;
        if (tooltipCharts[chartId]) {
            container.setAttribute('data-tooltip', chartId);
            agregarEventosTooltip(container, tooltipCharts[chartId], tooltipElement);
        }
    });

    // --- Pestañas de navegación ---
    document.querySelectorAll('.nav-link').forEach(link => {
        const section = link.dataset.section;
        if (tooltipTabs[section]) {
            link.setAttribute('data-tooltip', section);
            agregarEventosTooltip(link, tooltipTabs[section], tooltipElement);
        }
    });
}

function agregarEventosTooltip(element, data, tooltipElement) {
    element.addEventListener('mouseenter', e => mostrarTooltip(e, data, tooltipElement));
    element.addEventListener('mousemove', e => posicionarTooltip(e, tooltipElement));
    element.addEventListener('mouseleave', () => ocultarTooltip(tooltipElement));
}

function mostrarTooltip(event, data, tooltipElement) {
    let content = `
        <div class="tooltip-custom-title">${data.title}</div>
        <div class="tooltip-custom-desc">${data.desc}</div>
        <div class="tooltip-custom-data">📊 ${data.source || ''}</div>
    `;

    if (data.comparison) {
        content += `
            <div class="tooltip-custom-comparison">
                📈 <strong>Referencia:</strong><br>${data.comparison}
            </div>
        `;
    }

    if (data.miniChart) {
        content += `<div class="tooltip-custom-mini-chart">`;
        data.miniChart.labels.forEach((label, i) => {
            const width = data.miniChart.values[i];
            content += `
                <div style="margin: 6px 0;">
                    <div style="font-size: 10px; margin-bottom: 2px;">${label}</div>
                    <div class="tooltip-bar" style="width: ${width}%">
                        <span class="tooltip-bar-label">${width}%</span>
                    </div>
                </div>
            `;
        });
        content += `</div>`;
    }

    tooltipElement.innerHTML = content;
    tooltipElement.classList.add('show');
    posicionarTooltip(event, tooltipElement);
}

function posicionarTooltip(event, tooltipElement) {
    const rect = tooltipElement.getBoundingClientRect();
    let x = event.clientX + 15;
    let y = event.clientY + 15;

    if (x + rect.width > window.innerWidth) x = event.clientX - rect.width - 15;
    if (y + rect.height > window.innerHeight) y = event.clientY - rect.height - 15;

    tooltipElement.style.left = x + 'px';
    tooltipElement.style.top = y + 'px';
}

function ocultarTooltip(tooltipElement) {
    tooltipElement.classList.remove('show');
}

// =========================
//  UTILIDADES EXTRA
// =========================

function exportarReporte() {
    alert('Funcionalidad de exportación en desarrollo.\nSe generará un PDF con todos los KPIs y gráficas.');
}

function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('gmao_logged_in');
        localStorage.removeItem('gmao_username');
        window.location.href = '../index.html';
    }
}

function volverAtras() {
    window.location.href = 'gestortaller.html';
}
