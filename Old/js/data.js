// ===== Datos de Órdenes de Trabajo =====
const WORK_ORDERS = [
  {
    id: 'WO-2024-001',
    description: 'Mantenimiento preventivo sistema de riego',
    equipment: 'Bomba Principal A1',
    priority: 'high',
    status: 'todo',
    type: 'correctivo',
    assignedTo: 'Juan Pérez',
    dueDate: '2025-11-15',
    createdDate: '2025-11-10',
    estimatedHours: 4,
    notes: 'Revisar presión del sistema y cambiar juntas si es necesario. Coordinarse con el operario de campo para el corte de agua.',
    nextPreventiveDate: '2025-12-15',
    constructionDate: null,
    duration: 2
  },
  {
    id: 'WO-2024-002', 
    description: 'Reparación sensor de humedad',
    equipment: 'Sensor HUM-05',
    priority: 'medium',
    status: 'in-progress',
    type: 'correctivo',
    assignedTo: 'María García',
    dueDate: '2025-11-13',
    createdDate: '2025-11-08',
    estimatedHours: 2,
    notes: 'Sensor descalibrado. Verificar conexiones eléctricas y realizar calibración según manual del fabricante.',
    nextPreventiveDate: '2025-12-13',
    constructionDate: null,
    duration: 1
  },
  {
    id: 'WO-2024-003',
    description: 'Cambio de filtros HVAC',
    equipment: 'Climatización Sector B',
    priority: 'low',
    status: 'todo',
    type: 'preventivo',
    assignedTo: 'Carlos López',
    dueDate: '2025-11-18',
    createdDate: '2025-11-05',
    estimatedHours: 3,
    nextPreventiveDate: '2026-02-18',
    constructionDate: null,
    duration: 1
  },
  {
    id: 'WO-2024-004',
    description: 'Inspección sistema eléctrico',
    equipment: 'Panel Eléctrico Central',
    priority: 'high',
    status: 'stopped',
    type: 'correctivo',
    assignedTo: 'Ana Martín',
    dueDate: '2025-11-14',
    createdDate: '2025-11-09',
    estimatedHours: 6,
    nextPreventiveDate: '2026-01-14',
    constructionDate: '2026-03-15',
    duration: 3
  },
  {
    id: 'WO-2024-005',
    description: 'Calibración báscula automatizada',
    equipment: 'Báscula BAL-03',
    priority: 'medium',
    status: 'done',
    type: 'preventivo',
    assignedTo: 'Roberto Silva',
    dueDate: '2025-11-16',
    createdDate: '2025-11-11',
    estimatedHours: 2,
    nextPreventiveDate: '2026-01-16',
    constructionDate: null,
    duration: 1
  },
  {
    id: 'WO-2024-006',
    description: 'Revisión bomba secundaria',
    equipment: 'Bomba B2',
    priority: 'medium',
    status: 'todo',
    type: 'preventivo',
    assignedTo: 'Luis Herrera',
    dueDate: '2025-11-20',
    createdDate: '2025-11-12',
    estimatedHours: 3,
    nextPreventiveDate: '2026-02-20',
    constructionDate: null,
    duration: 2
  },
  {
    id: 'WO-2024-007',
    description: 'Reparación motor principal',
    equipment: 'Motor Central M1',
    priority: 'high',
    status: 'todo',
    type: 'correctivo',
    assignedTo: 'Patricia Ruiz',
    dueDate: '2025-11-17',
    createdDate: '2025-11-11',
    estimatedHours: 8,
    nextPreventiveDate: '2026-01-17',
    constructionDate: '2026-04-20',
    duration: 4
  },
  {
    id: 'WO-2024-008',
    description: 'Mantenimiento preventivo tractor',
    equipment: 'Tractor T-05',
    priority: 'low',
    status: 'in-progress',
    type: 'preventivo',
    assignedTo: 'Miguel Santos',
    dueDate: '2025-11-19',
    createdDate: '2025-11-10',
    estimatedHours: 4,
    nextPreventiveDate: '2026-05-19',
    constructionDate: null,
    duration: 2
  },
  {
    id: 'WO-2024-009',
    description: 'Instalación nuevo sistema de fertirrigación',
    equipment: 'Sector C - Nueva Zona',
    priority: 'high',
    status: 'todo',
    type: 'construccion',
    assignedTo: 'Equipo Construcción',
    dueDate: '2025-11-25',
    createdDate: '2025-11-12',
    estimatedHours: 24,
    notes: 'Proyecto de ampliación con nuevo sistema automatizado de fertirrigación para incrementar productividad en sector C.',
    nextPreventiveDate: '2026-01-25',
    constructionDate: '2025-11-25',
    duration: 5
  },
  {
    id: 'WO-2024-010',
    description: 'Modificación sistema eléctrico nave principal',
    equipment: 'Nave Principal - Cuadro Eléctrico',
    priority: 'medium',
    status: 'done',
    type: 'construccion',
    assignedTo: 'Ana Martín',
    dueDate: '2025-11-20',
    createdDate: '2025-11-08',
    estimatedHours: 16,
    notes: 'Actualización del sistema eléctrico para cumplir con nuevas normativas de seguridad.',
    nextPreventiveDate: '2026-02-20',
    constructionDate: '2025-11-20',
    duration: 3
  },
  {
    id: 'WO-2025-001',
    description: 'Mantenimiento sistema de climatización',
    equipment: 'HVAC Oficinas',
    priority: 'medium',
    status: 'todo',
    type: 'preventivo',
    assignedTo: 'Carlos López',
    dueDate: '2025-12-01',
    createdDate: '2025-11-11',
    estimatedHours: 6,
    nextPreventiveDate: '2026-03-01',
    constructionDate: null,
    duration: 1
  },
  {
    id: 'WO-2025-002',
    description: 'Actualización firmware sensores',
    equipment: 'Red de Sensores IoT',
    priority: 'high',
    status: 'todo',
    type: 'correctivo',
    assignedTo: 'María García',
    dueDate: '2025-11-28',
    createdDate: '2025-11-11',
    estimatedHours: 8,
    nextPreventiveDate: '2026-02-28',
    constructionDate: null,
    duration: 2
  }
];

// ===== Funciones auxiliares para datos =====
function getWorkOrderById(id) {
  return WORK_ORDERS.find(order => order.id === id);
}

function getWorkOrdersByStatus(status) {
  return WORK_ORDERS.filter(order => order.status === status);
}

function getWorkOrdersByType(type) {
  return WORK_ORDERS.filter(order => order.type === type);
}

function getWorkOrdersByPriority(priority) {
  return WORK_ORDERS.filter(order => order.priority === priority);
}

function getWorkOrdersForDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return WORK_ORDERS.filter(order => {
    const dueDate = new Date(order.dueDate);
    return dueDate >= start && dueDate <= end;
  });
}

function updateWorkOrderStatus(id, newStatus) {
  const order = getWorkOrderById(id);
  if (order) {
    order.status = newStatus;
    return true;
  }
  return false;
}

// ===== Estadísticas =====
function getWorkOrderStats() {
  const total = WORK_ORDERS.length;
  const byStatus = {
    todo: getWorkOrdersByStatus('todo').length,
    'in-progress': getWorkOrdersByStatus('in-progress').length,
    stopped: getWorkOrdersByStatus('stopped').length,
    done: getWorkOrdersByStatus('done').length
  };
  
  const byType = {
    correctivo: getWorkOrdersByType('correctivo').length,
    preventivo: getWorkOrdersByType('preventivo').length,
    construccion: getWorkOrdersByType('construccion').length
  };
  
  const byPriority = {
    high: getWorkOrdersByPriority('high').length,
    medium: getWorkOrdersByPriority('medium').length,
    low: getWorkOrdersByPriority('low').length
  };
  
  return {
    total,
    byStatus,
    byType,
    byPriority
  };
}