// Base de datos de máquinas
const MAQUINAS = [
    {
        id: 'TR-001',
        nombre: 'Tractor John Deere 5075E',
        tipo: 'Tractor',
        categoria: 'Maquinaria Agrícola',
        subcategoria: 'Tractores',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 18650.50,
        horasOperacion: 2847,
        fechaAdquisicion: '2020-01-15',
        modelo: 'John Deere 5075E',
        icon: '🚜',
        lat: 28.3135,
        lng: -16.5099,
        historialReparaciones: [
            {
                fecha: '2024-10-15',
                descripcion: 'Cambio de aceite y filtros',
                costo: 285.50,
                tipo: 'Preventivo',
                tecnico: 'Carlos Méndez',
                horas: 2.5
            },
            {
                fecha: '2024-08-22',
                descripcion: 'Reparación sistema hidráulico',
                costo: 1250.75,
                tipo: 'Correctivo',
                tecnico: 'Ana García',
                horas: 6.0
            },
            {
                fecha: '2024-06-10',
                descripcion: 'Sustitución neumáticos traseros',
                costo: 950.00,
                tipo: 'Correctivo',
                tecnico: 'Luis Rodríguez',
                horas: 3.5
            },
            {
                fecha: '2024-03-18',
                descripcion: 'Mantenimiento programado 500h',
                costo: 420.30,
                tipo: 'Preventivo',
                tecnico: 'Carlos Méndez',
                horas: 4.0
            }
        ]
    },
    {
        id: 'CS-002',
        nombre: 'Cosechadora Claas Lexion 760',
        tipo: 'Cosechadora',
        categoria: 'Maquinaria Agrícola',
        subcategoria: 'Cosechadoras',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 28450.90,
        horasOperacion: 1876,
        fechaAdquisicion: '2021-09-15',
        modelo: 'Claas Lexion 760',
        icon: '🌾',
        lat: 28.0915,
        lng: -16.7254,
        historialReparaciones: [
            {
                fecha: '2024-10-20',
                descripcion: 'Calibración sistema de corte',
                costo: 850.30,
                tipo: 'Preventivo',
                tecnico: 'Luis Rodríguez',
                horas: 4.0
            },
            {
                fecha: '2024-08-28',
                descripcion: 'Reparación sistema de limpieza',
                costo: 1650.75,
                tipo: 'Correctivo',
                tecnico: 'Miguel Torres',
                horas: 7.5
            },
            {
                fecha: '2024-06-12',
                descripcion: 'Mantenimiento motor y transmisión',
                costo: 2250.85,
                tipo: 'Preventivo',
                tecnico: 'Carlos Méndez',
                horas: 9.0
            }
        ]
    },
    {
        id: 'CS-003',
        nombre: 'Cosechadora John Deere S680',
        tipo: 'Cosechadora',
        categoria: 'Maquinaria Agrícola',
        subcategoria: 'Cosechadoras',
        ubicacion: 'Fuente el Olmo',
        estado: 'mantenimiento',
        costoTotalMantenimiento: 31280.65,
        horasOperacion: 2145,
        fechaAdquisicion: '2020-10-08',
        modelo: 'John Deere S680',
        icon: '🌾',
        lat: 28.0595,
        lng: -16.5754,
        historialReparaciones: [
            {
                fecha: '2024-11-08',
                descripcion: 'Overhaul completo del motor',
                costo: 4500.00,
                tipo: 'Correctivo',
                tecnico: 'Luis Rodríguez',
                horas: 16.0
            },
            {
                fecha: '2024-09-22',
                descripcion: 'Sustitución cadenas elevadoras',
                costo: 980.45,
                tipo: 'Correctivo',
                tecnico: 'Ana García',
                horas: 5.5
            },
            {
                fecha: '2024-07-18',
                descripcion: 'Mantenimiento sistema hidráulico',
                costo: 720.20,
                tipo: 'Preventivo',
                tecnico: 'Miguel Torres',
                horas: 4.0
            }
        ]
    },
    {
        id: 'CS-004',
        nombre: 'Cosechadora New Holland CR8.80',
        tipo: 'Cosechadora',
        categoria: 'Maquinaria Agrícola',
        subcategoria: 'Cosechadoras',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 24680.40,
        horasOperacion: 1652,
        fechaAdquisicion: '2022-02-28',
        modelo: 'New Holland CR8.80',
        icon: '🌾',
        lat: 28.2465,
        lng: -16.8342,
        historialReparaciones: [
            {
                fecha: '2024-10-15',
                descripcion: 'Ajuste sistema de separación',
                costo: 650.80,
                tipo: 'Preventivo',
                tecnico: 'Carlos Méndez',
                horas: 3.5
            },
            {
                fecha: '2024-08-05',
                descripcion: 'Cambio de cuchillas de corte',
                costo: 450.30,
                tipo: 'Correctivo',
                tecnico: 'Ana García',
                horas: 2.5
            },
            {
                fecha: '2024-05-22',
                descripcion: 'Mantenimiento programado 500h',
                costo: 780.60,
                tipo: 'Preventivo',
                tecnico: 'Miguel Torres',
                horas: 4.5
            }
        ]
    },
    {
        id: 'CT-001',
        nombre: 'Tractor Case IH Maxxum 115',
        tipo: 'Tractor',
        categoria: 'Maquinaria Agrícola',
        subcategoria: 'Tractores',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 12340.75,
        horasOperacion: 1985,
        fechaAdquisicion: '2021-03-20',
        modelo: 'Case IH Maxxum 115',
        icon: '🚜',
        lat: 27.9258,
        lng: -15.7356,
        historialReparaciones: [
            {
                fecha: '2024-11-01',
                descripcion: 'Cambio de filtro de aire y aceite motor',
                costo: 195.30,
                tipo: 'Preventivo',
                tecnico: 'Miguel Torres',
                horas: 1.5
            },
            {
                fecha: '2024-09-15',
                descripcion: 'Reparación sistema de dirección',
                costo: 850.25,
                tipo: 'Correctivo',
                tecnico: 'Carlos Méndez',
                horas: 4.5
            },
            {
                fecha: '2024-07-08',
                descripcion: 'Mantenimiento transmisión',
                costo: 675.20,
                tipo: 'Preventivo',
                tecnico: 'Ana García',
                horas: 3.0
            }
        ]
    },
    {
        id: 'TR-003',
        nombre: 'Tractor Fendt 724 Vario',
        tipo: 'Tractor',
        ubicacion: 'Fuente el Olmo',
        estado: 'mantenimiento',
        costoTotalMantenimiento: 22150.80,
        horasOperacion: 3420,
        fechaAdquisicion: '2019-11-15',
        modelo: 'Fendt 724 Vario',
        icon: '🚜',
        lat: 28.0553,
        lng: -16.6255,
        historialReparaciones: [
            {
                fecha: '2024-10-25',
                descripcion: 'Reparación mayor del motor',
                costo: 3200.50,
                tipo: 'Correctivo',
                tecnico: 'Luis Rodríguez',
                horas: 12.0
            },
            {
                fecha: '2024-08-14',
                descripcion: 'Sustitución embrague',
                costo: 1850.75,
                tipo: 'Correctivo',
                tecnico: 'Miguel Torres',
                horas: 8.5
            },
            {
                fecha: '2024-05-20',
                descripcion: 'Mantenimiento 1000h programado',
                costo: 580.30,
                tipo: 'Preventivo',
                tecnico: 'Carlos Méndez',
                horas: 4.5
            }
        ]
    },
    {
        id: 'TR-004',
        nombre: 'Tractor Massey Ferguson 8740S',
        tipo: 'Tractor',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 15680.45,
        horasOperacion: 2156,
        fechaAdquisicion: '2020-08-10',
        modelo: 'Massey Ferguson 8740S',
        icon: '🚜',
        lat: 28.9784,
        lng: -13.5501,
        historialReparaciones: [
            {
                fecha: '2024-10-30',
                descripcion: 'Cambio de neumáticos delanteros',
                costo: 780.90,
                tipo: 'Correctivo',
                tecnico: 'Ana García',
                horas: 2.5
            },
            {
                fecha: '2024-09-08',
                descripcion: 'Servicio de mantenimiento preventivo',
                costo: 425.60,
                tipo: 'Preventivo',
                tecnico: 'Carlos Méndez',
                horas: 3.5
            }
        ]
    },
    {
        id: 'TR-005',
        nombre: 'Tractor New Holland T7.315',
        tipo: 'Tractor',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 18920.30,
        horasOperacion: 2789,
        fechaAdquisicion: '2020-01-25',
        modelo: 'New Holland T7.315',
        icon: '🚜',
        lat: 29.0456,
        lng: -13.5501,
        historialReparaciones: [
            {
                fecha: '2024-11-05',
                descripcion: 'Reparación sistema hidráulico trasero',
                costo: 1250.80,
                tipo: 'Correctivo',
                tecnico: 'Luis Rodríguez',
                horas: 5.5
            },
            {
                fecha: '2024-08-22',
                descripcion: 'Cambio de filtros y aceites',
                costo: 380.25,
                tipo: 'Preventivo',
                tecnico: 'Miguel Torres',
                horas: 2.0
            }
        ]
    },
    {
        id: 'TR-006',
        nombre: 'Tractor Kubota M7173',
        tipo: 'Tractor',
        ubicacion: 'Fuente el Olmo',
        estado: 'inactivo',
        costoTotalMantenimiento: 8560.15,
        horasOperacion: 1456,
        fechaAdquisicion: '2022-04-12',
        modelo: 'Kubota M7173',
        icon: '🚜',
        lat: 29.1738,
        lng: -13.5802,
        historialReparaciones: [
            {
                fecha: '2024-09-18',
                descripcion: 'Inspección técnica anual',
                costo: 150.00,
                tipo: 'Preventivo',
                tecnico: 'Ana García',
                horas: 1.0
            },
            {
                fecha: '2024-06-15',
                descripcion: 'Cambio de batería',
                costo: 185.45,
                tipo: 'Correctivo',
                tecnico: 'Carlos Méndez',
                horas: 0.5
            }
        ]
    },
    {
        id: 'PV-002',
        nombre: 'Pulverizador Amazone UX 3200',
        tipo: 'Pulverizador',
        categoria: 'Maquinaria Agrícola',
        subcategoria: 'Pulverizadores',
        ubicacion: 'Fuente el Olmo',
        estado: 'mantenimiento',
        costoTotalMantenimiento: 12890.25,
        horasOperacion: 1654,
        fechaAdquisicion: '2019-03-20',
        modelo: 'Amazone UX 3200',
        icon: '🚿',
        historialReparaciones: [
            {
                fecha: '2024-11-10',
                descripcion: 'Reparación bomba principal (EN CURSO)',
                costo: 1850.00,
                tipo: 'Correctivo',
                tecnico: 'Miguel Torres',
                horas: 8.0
            },
            {
                fecha: '2024-09-05',
                descripcion: 'Calibración boquillas pulverización',
                costo: 320.75,
                tipo: 'Preventivo',
                tecnico: 'Ana García',
                horas: 3.0
            },
            {
                fecha: '2024-07-12',
                descripcion: 'Sustitución mangueras alta presión',
                costo: 680.50,
                tipo: 'Correctivo',
                tecnico: 'Luis Rodríguez',
                horas: 4.5
            }
        ]
    },
    {
        id: 'TR-003',
        nombre: 'Tractor Case IH Farmall 55A',
        tipo: 'Tractor',
        categoria: 'Maquinaria Agrícola',
        subcategoria: 'Tractores',
        ubicacion: 'Fuente el Olmo',
        estado: 'programado',
        costoTotalMantenimiento: 15420.75,
        horasOperacion: 3102,
        fechaAdquisicion: '2018-07-10',
        modelo: 'Case IH Farmall 55A',
        icon: '🚜'
    },
    {
        id: 'RI-004',
        nombre: 'Bomba de Riego Principal',
        tipo: 'Sistema de Riego',
        categoria: 'Equipos de Riego',
        subcategoria: 'Bombas',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 8945.30,
        horasOperacion: 4567,
        fechaAdquisicion: '2017-05-15',
        modelo: 'Grundfos CR 32-4',
        icon: '💧'
    },
    {
        id: 'PV-005',
        nombre: 'Pulverizador Hardi Navigator 3000',
        tipo: 'Pulverizador',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 9876.40,
        horasOperacion: 1432,
        fechaAdquisicion: '2021-02-28',
        modelo: 'Hardi Navigator 3000',
        icon: '🚿'
    },
    {
        id: 'GE-006',
        nombre: 'Generador Diesel Caterpillar',
        tipo: 'Generador',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 22340.80,
        horasOperacion: 5892,
        fechaAdquisicion: '2016-11-12',
        modelo: 'Caterpillar C4.4 DE88E0',
        icon: '⚡',
        historialReparaciones: [
            {
                fecha: '2024-09-28',
                descripcion: 'Overhaul motor completo',
                costo: 8500.00,
                tipo: 'Correctivo',
                tecnico: 'Especialista Caterpillar',
                horas: 24.0
            },
            {
                fecha: '2024-06-15',
                descripcion: 'Cambio filtros y aceites',
                costo: 450.80,
                tipo: 'Preventivo',
                tecnico: 'Carlos Méndez',
                horas: 3.0
            },
            {
                fecha: '2024-03-10',
                descripcion: 'Reparación alternador',
                costo: 1250.00,
                tipo: 'Correctivo',
                tecnico: 'Miguel Torres',
                horas: 6.5
            },
            {
                fecha: '2023-12-20',
                descripcion: 'Sustitución batería arranque',
                costo: 380.50,
                tipo: 'Correctivo',
                tecnico: 'Ana García',
                horas: 1.5
            },
            {
                fecha: '2023-09-14',
                descripcion: 'Mantenimiento sistema refrigeración',
                costo: 720.25,
                tipo: 'Preventivo',
                tecnico: 'Luis Rodríguez',
                horas: 4.0
            }
        ]
    },
    {
        id: 'IN-007',
        nombre: 'Sistema de Climatización Invernadero A',
        tipo: 'Infraestructura',
        ubicacion: 'Fuente el Olmo',
        estado: 'mantenimiento',
        costoTotalMantenimiento: 16789.95,
        horasOperacion: 8760,
        fechaAdquisicion: '2019-09-05',
        modelo: 'Munters Oxycom IntrCooll',
        icon: '🏭'
    },
    {
        id: 'TR-008',
        nombre: 'Tractor New Holland T4.75',
        tipo: 'Tractor',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 11567.60,
        horasOperacion: 1789,
        fechaAdquisicion: '2022-04-18',
        modelo: 'New Holland T4.75',
        icon: '🚜'
    },
    {
        id: 'RI-009',
        nombre: 'Sistema de Filtrado de Agua',
        tipo: 'Sistema de Riego',
        ubicacion: 'Fuente el Olmo',
        estado: 'programado',
        costoTotalMantenimiento: 7234.15,
        horasOperacion: 6123,
        fechaAdquisicion: '2018-12-03',
        modelo: 'Netafim SuperNet',
        icon: '💧'
    },
    {
        id: 'PV-010',
        nombre: 'Pulverizador Jacto Arbus 2000',
        tipo: 'Pulverizador',
        ubicacion: 'Fuente el Olmo',
        estado: 'mantenimiento',
        costoTotalMantenimiento: 6892.35,
        horasOperacion: 987,
        fechaAdquisicion: '2023-01-25',
        modelo: 'Jacto Arbus 2000',
        icon: '🚿'
    },
    {
        id: 'IN-011',
        nombre: 'Compresor de Aire Industrial',
        tipo: 'Infraestructura',
        ubicacion: 'Fuente el Olmo',
        estado: 'operativo',
        costoTotalMantenimiento: 4567.80,
        horasOperacion: 2340,
        fechaAdquisicion: '2020-08-14',
        modelo: 'Atlas Copco GA 15',
        icon: '🔧'
    },
    {
        id: 'TR-012',
        nombre: 'Tractor Fendt 211 Vario',
        tipo: 'Tractor',
        ubicacion: 'Fuente el Olmo',
        estado: 'programado',
        costoTotalMantenimiento: 19876.45,
        horasOperacion: 3456,
        fechaAdquisicion: '2017-10-22',
        modelo: 'Fendt 211 Vario',
        icon: '🚜'
    }
];

let maquinasFiltradas = [...MAQUINAS];
let maquinaActual = null; // Para almacenar la máquina seleccionada en el modal

// Funciones principales

function cargarMapa() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    // Clear previous map content
    mapContainer.innerHTML = '<div id="map"></div>';

    // Initialize the map
    const map = L.map('map', {
        zoomControl: false // Disable default zoom control
    }).setView([41.3765, -3.9975], 15); // Centered on Planasa coordinates

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add custom zoom control
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Add scale control
    L.control.scale({
        position: 'bottomleft'
    }).addTo(map);

    // Add markers for all machine locations
    maquinasFiltradas.forEach((maquina, index) => {
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${getMarkerColor(maquina.estado)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`
        });

        // Distribute markers randomly around the center point
        const latOffset = (Math.random() * 0.001) - 0.0005;
        const lngOffset = (Math.random() * 0.001) - 0.0005;

        const marker = L.marker([41.3765 + latOffset, -3.9975 + lngOffset], { icon }).addTo(map);
        marker.bindPopup(`
            <div style="min-width: 200px;">
                <strong style="font-size: 14px;">${maquina.nombre}</strong><br>
                <span style="color: ${getMarkerColor(maquina.estado)}; font-weight: bold;">● ${maquina.estado.toUpperCase()}</span><br>
                <small>Tipo: ${maquina.tipo}</small><br>
                <small>Ubicación: Fuente el Olmo</small>
            </div>
        `);
        
        // Show tooltip on hover
        marker.bindTooltip(maquina.nombre, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });
    });
}

function getMarkerColor(estado) {
    // Return color based on machine state
    const colors = {
        operativo: 'green',
        mantenimiento: 'orange',
        inactivo: 'red'
    };
    return colors[estado] || 'gray';
}

function volverAtras() {
    window.location.href = 'gestortaller.html';
}

function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('gmao_logged_in');
        localStorage.removeItem('gmao_username');
        window.location.href = '../index.html';
    }
}

function filtrarMaquinas() {
    const busqueda = document.getElementById('search-input').value.toLowerCase();
    const estadoFiltro = document.getElementById('estado-filter').value;
    const categoriaFiltro = document.getElementById('categoria-filter').value;
    const tipoFiltro = document.getElementById('tipo-filter').value;
    const ubicacionFiltro = document.getElementById('ubicacion-filter').value;
    
    maquinasFiltradas = MAQUINAS.filter(maquina => {
        // Filtro de búsqueda
        const matchSearch = !busqueda || 
            maquina.nombre.toLowerCase().includes(busqueda) ||
            maquina.id.toLowerCase().includes(busqueda) ||
            maquina.tipo.toLowerCase().includes(busqueda) ||
            maquina.ubicacion.toLowerCase().includes(busqueda) ||
            (maquina.categoria && maquina.categoria.toLowerCase().includes(busqueda));
            
        // Filtro de estado
        const matchEstado = !estadoFiltro || maquina.estado === estadoFiltro;
        
        // Filtro de categoría
        const matchCategoria = !categoriaFiltro || (maquina.categoria && maquina.categoria === categoriaFiltro);
        
        // Filtro de tipo
        const matchTipo = !tipoFiltro || maquina.tipo === tipoFiltro;
        
        // Filtro de ubicación
        const matchUbicacion = !ubicacionFiltro || maquina.ubicacion === ubicacionFiltro;
        
        return matchSearch && matchEstado && matchCategoria && matchTipo && matchUbicacion;
    });
    
    actualizarContadorResultados();
    renderizarMaquinas();
    cargarMapa(); // Actualizar el mapa con las máquinas filtradas
}

function renderizarMaquinas() {
    const grid = document.getElementById('machine-grid');
    
    if (maquinasFiltradas.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No se encontraron máquinas</h3>
                <p>Prueba con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = maquinasFiltradas.map(maquina => createMachineCard(maquina)).join('');
}

function createMachineCard(maquina) {
    const estadoTexto = getEstadoTexto(maquina.estado);
    const estadoIcon = getEstadoIcon(maquina.estado);
    const añosOperacion = calcularAñosOperacion(maquina.fechaAdquisicion);
    
    return `
        <div class="machine-card" onclick="mostrarDetalleMaquina('${maquina.id}')">
            <div class="machine-row">
                <div class="machine-icon">
                    ${maquina.icon}
                </div>
                
                <div class="machine-info">
                    <div class="machine-name">${maquina.nombre}</div>
                    <div class="machine-details">
                        <div class="machine-detail">
                            <i class="fas fa-tag"></i>
                            <span class="machine-id">${maquina.id}</span>
                        </div>
                        <div class="machine-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${maquina.ubicacion}</span>
                        </div>
                        <div class="machine-detail">
                            <i class="fas fa-cog"></i>
                            <span>${maquina.tipo}</span>
                        </div>
                    </div>
                </div>
                
                <div class="machine-status">
                    <div class="status-badge ${maquina.estado}">
                        <i class="fas ${estadoIcon}"></i>
                        ${estadoTexto}
                    </div>
                </div>
                
                <div class="machine-kpis">
                    <div class="kpi-item">
                        <span class="kpi-value">€${maquina.costoTotalMantenimiento.toLocaleString('es-ES')}</span>
                        <span class="kpi-label">Costo Total</span>
                    </div>
                    <div class="kpi-item">
                        <span class="kpi-value">${maquina.horasOperacion.toLocaleString()}</span>
                        <span class="kpi-label">Horas</span>
                    </div>
                    <div class="kpi-item">
                        <span class="kpi-value">${añosOperacion}</span>
                        <span class="kpi-label">Años</span>
                    </div>
                </div>
                
                <div class="machine-actions">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        </div>
    `;
}

function actualizarEstadisticas() {
    const total = MAQUINAS.length;
    const operativas = MAQUINAS.filter(m => m.estado === 'operativo').length;
    const mantenimiento = MAQUINAS.filter(m => m.estado === 'mantenimiento').length;
    const costoTotal = MAQUINAS.reduce((suma, m) => suma + m.costoTotalMantenimiento, 0);
    
    document.getElementById('total-machines').textContent = total;
    document.getElementById('operativas').textContent = operativas;
    document.getElementById('mantenimiento').textContent = mantenimiento;
    document.getElementById('costo-total').textContent = `€${costoTotal.toLocaleString('es-ES')}`;
}

function getEstadoTexto(estado) {
    const textos = {
        'operativo': 'Operativo',
        'mantenimiento': 'En Mantenimiento',
        'programado': 'Programado'
    };
    return textos[estado] || estado;
}

function getEstadoIcon(estado) {
    const iconos = {
        'operativo': 'fa-check-circle',
        'mantenimiento': 'fa-tools',
        'programado': 'fa-calendar-check'
    };
    return iconos[estado] || 'fa-circle';
}

function calcularAñosOperacion(fechaAdquisicion) {
    const fecha = new Date(fechaAdquisicion);
    const ahora = new Date();
    const años = Math.floor((ahora - fecha) / (365.25 * 24 * 60 * 60 * 1000));
    return años;
}

function limpiarFiltros() {
    document.getElementById('search-input').value = '';
    document.getElementById('estado-filter').value = '';
    document.getElementById('categoria-filter').value = '';
    document.getElementById('tipo-filter').value = '';
    document.getElementById('ubicacion-filter').value = '';
    
    maquinasFiltradas = [...MAQUINAS];
    actualizarContadorResultados();
    renderizarMaquinas();
}

function actualizarContadorResultados() {
    const count = maquinasFiltradas.length;
    const resultsElement = document.getElementById('results-count');
    if (resultsElement) {
        resultsElement.textContent = `${count} máquina${count !== 1 ? 's' : ''}`;
    }
}

function mostrarDetalleMaquina(id) {
    const maquina = MAQUINAS.find(m => m.id === id);
    if (!maquina) return;
    
    // Almacenar la máquina actual globalmente
    maquinaActual = maquina;
    
    // Llenar información general
    document.getElementById('modal-title').textContent = `Detalles - ${maquina.nombre}`;
    document.getElementById('modal-id').textContent = maquina.id;
    document.getElementById('modal-nombre').textContent = maquina.nombre;
    document.getElementById('modal-tipo').textContent = maquina.tipo;
    document.getElementById('modal-modelo').textContent = maquina.modelo;
    document.getElementById('modal-ubicacion').textContent = maquina.ubicacion;
    
    // Estado con clase CSS
    const estadoElement = document.getElementById('modal-estado');
    estadoElement.textContent = getEstadoTexto(maquina.estado);
    estadoElement.className = `status-badge ${maquina.estado}`;
    
    // Fechas y años
    const fechaAdquisicion = new Date(maquina.fechaAdquisicion);
    document.getElementById('modal-fecha').textContent = fechaAdquisicion.toLocaleDateString('es-ES');
    document.getElementById('modal-anos').textContent = `${calcularAñosOperacion(maquina.fechaAdquisicion)} años`;
    
    // Estadísticas
    document.getElementById('modal-horas').textContent = maquina.horasOperacion.toLocaleString();
    document.getElementById('modal-costo').textContent = `€${maquina.costoTotalMantenimiento.toLocaleString('es-ES')}`;
    
    // Calcular estadísticas del historial
    const historial = maquina.historialReparaciones || [];
    const totalReparaciones = historial.length;
    const costoPromedio = totalReparaciones > 0 ? (maquina.costoTotalMantenimiento / totalReparaciones) : 0;
    
    document.getElementById('modal-reparaciones').textContent = totalReparaciones;
    document.getElementById('modal-promedio').textContent = `€${costoPromedio.toLocaleString('es-ES', {maximumFractionDigits: 0})}`;
    
    // Cargar historial
    cargarHistorialReparaciones(historial);
    
    // Mostrar modal
    document.getElementById('machine-modal').classList.add('show');
}

function cargarHistorialReparaciones(historial) {
    const container = document.getElementById('historial-container');
    
    if (!historial || historial.length === 0) {
        container.innerHTML = `
            <div class="empty-historial">
                <i class="fas fa-tools"></i>
                <h3>Sin historial de reparaciones</h3>
                <p>Esta máquina no tiene reparaciones registradas</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por fecha descendente
    const historialOrdenado = [...historial].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    container.innerHTML = historialOrdenado.map(reparacion => {
        const fecha = new Date(reparacion.fecha);
        const tipoClass = reparacion.tipo === 'Preventivo' ? 'preventivo' : 'correctivo';
        
        return `
            <div class="reparacion-item clickable" onclick="mostrarDetalleIncidencia(${JSON.stringify(reparacion).replace(/"/g, '&quot;')})">
                <div class="reparacion-header">
                    <span class="reparacion-fecha">${fecha.toLocaleDateString('es-ES')}</span>
                    <span class="reparacion-costo">€${reparacion.costo.toLocaleString('es-ES')}</span>
                </div>
                <div class="reparacion-descripcion">${reparacion.descripcion}</div>
                <div class="reparacion-detalles">
                    <div class="reparacion-detail">
                        <i class="fas fa-tag"></i>
                        <span class="tipo-${tipoClass.toLowerCase()}">${reparacion.tipo}</span>
                    </div>
                    <div class="reparacion-detail">
                        <i class="fas fa-user"></i>
                        <span>${reparacion.tecnico}</span>
                    </div>
                    <div class="reparacion-detail">
                        <i class="fas fa-clock"></i>
                        <span>${reparacion.horas}h</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function cerrarModal() {
    document.getElementById('machine-modal').classList.remove('show');
}

function crearOrdenTrabajo() {
    if (!maquinaActual) {
        alert('Error: No se ha seleccionado ninguna máquina');
        return;
    }
    
    // Crear parámetros URL con la información de la máquina
    const params = new URLSearchParams({
        maquinaId: maquinaActual.id,
        maquinaNombre: maquinaActual.nombre,
        maquinaTipo: maquinaActual.tipo,
        maquinaModelo: maquinaActual.modelo,
        maquinaUbicacion: maquinaActual.ubicacion
    });
    
    cerrarModal();
    window.location.href = `../Tablet/crear-orden-trabajo.html?${params.toString()}`;
}

// Funciones para modal de incidencias
function mostrarDetalleIncidencia(reparacion) {
    if (!maquinaActual || !reparacion) return;
    
    // Llenar información de la incidencia
    const fecha = new Date(reparacion.fecha);
    document.getElementById('incident-fecha').textContent = fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('incident-costo').textContent = `€${reparacion.costo.toLocaleString('es-ES')}`;
    document.getElementById('incident-descripcion').textContent = reparacion.descripcion;
    document.getElementById('incident-tecnico').textContent = reparacion.tecnico;
    document.getElementById('incident-horas').textContent = `${reparacion.horas} horas`;
    
    // Tipo de reparación con clase CSS
    const tipoElement = document.getElementById('incident-tipo');
    tipoElement.textContent = reparacion.tipo;
    tipoElement.className = `incident-type tipo-${reparacion.tipo.toLowerCase()}`;
    
    // Información de la máquina
    document.getElementById('incident-maquina-nombre').textContent = maquinaActual.nombre;
    document.getElementById('incident-maquina-ubicacion').textContent = maquinaActual.ubicacion;
    document.getElementById('incident-maquina-modelo').textContent = maquinaActual.modelo;
    
    // Mostrar modal de incidencia
    document.getElementById('incident-modal').classList.add('show');
}

function cerrarModalIncidencia() {
    document.getElementById('incident-modal').classList.remove('show');
}

function crearOrdenTrabajoDesdeIncidencia() {
    cerrarModalIncidencia();
    crearOrdenTrabajo();
}

// Cerrar modal al hacer click fuera
window.addEventListener('click', (event) => {
    const modal = document.getElementById('machine-modal');
    const incidentModal = document.getElementById('incident-modal');
    
    if (event.target === modal) {
        cerrarModal();
    }
    
    if (event.target === incidentModal) {
        cerrarModalIncidencia();
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const machineModal = document.getElementById('machine-modal');
        const incidentModal = document.getElementById('incident-modal');
        
        if (incidentModal && incidentModal.classList.contains('show')) {
            cerrarModalIncidencia();
        } else if (machineModal && machineModal.classList.contains('show')) {
            cerrarModal();
        }
    }
});

// Inicializar cuando se carga la página
window.addEventListener('load', () => {
    actualizarEstadisticas();
    actualizarContadorResultados();
    renderizarMaquinas();
    cargarMapa(); // Cargar el mapa automáticamente al inicio
});