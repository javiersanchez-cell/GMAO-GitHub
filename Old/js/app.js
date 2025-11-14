// Los datos se importan desde data.js

// ===== Variables globales =====

// ===== Kanban (drag & drop) =====
const kbTodo = document.getElementById('kb-todo');
const kbProgress = document.getElementById('kb-progress');
const kbDone = document.getElementById('kb-done');
const kbStopped = document.getElementById('kb-stopped');

function makeCard(order){
  const li = document.createElement('div');
  li.className = 'kcard';
  li.draggable = true;
  li.dataset.id = order.id;
  
  // Formatear tipo para mostrar
  const typeDisplay = order.type === 'correctivo' ? 'Correctivo' : 
                     order.type === 'preventivo' ? 'Preventivo' : 'Construcción';
  
  // Formatear prioridad
  const priorityDisplay = order.priority === 'high' ? 'Alta' : 
                         order.priority === 'medium' ? 'Media' : 'Baja';
  
  // Calcular fechas adicionales
  let additionalDates = [];
  if (order.nextPreventiveDate) {
    const prevDate = new Date(order.nextPreventiveDate).toLocaleDateString('es-ES');
    additionalDates.push(`📅 Próximo preventivo: ${prevDate}`);
  }
  if (order.constructionDate) {
    const constDate = new Date(order.constructionDate).toLocaleDateString('es-ES');
    additionalDates.push(`🏗️ Construcción: ${constDate}`);
  }
  if (order.duration && order.duration > 1) {
    additionalDates.push(`⏱️ Duración: ${order.duration} días`);
  }
  
  li.innerHTML = `
    <div class="card-header">
      <div class="card-title">${order.description}</div>
      <div class="card-id">${order.id}</div>
    </div>
    <div class="card-badges">
      <span class="badge priority-${order.priority}">${priorityDisplay}</span>
      <span class="badge type-${order.type}">${typeDisplay}</span>
    </div>
    <div class="card-info">
      <div class="info-row">
        <span>📅 ${new Date(order.dueDate).toLocaleDateString('es-ES')}</span>
        <span>⏰ ${order.estimatedHours}h</span>
      </div>
      <div class="info-row">
        <span>🔧 ${order.equipment}</span>
      </div>
      <div class="info-row">
        <span>👤 ${order.assignedTo}</span>
      </div>
    </div>
    ${additionalDates.length > 0 ? `
      <div class="card-additional">
        ${additionalDates.map(date => `<div class="additional-item">${date}</div>`).join('')}
      </div>
    ` : ''}
    ${order.notes ? `
      <div class="card-notes">
        💬 ${order.notes}
      </div>
    ` : ''}
    <div class="card-click-hint">
      <span>👆 Click para editar</span>
    </div>
  `;
  
  // Remove any existing event listeners by cloning the element
  const newLi = li.cloneNode(true);
  if (li.parentNode) {
    li.parentNode.replaceChild(newLi, li);
  }
  
  newLi.addEventListener('click', () => openModal(order));
  newLi.addEventListener('dragstart', ev => {
    ev.dataTransfer.setData('text/plain', order.id);
    setTimeout(() => newLi.classList.add('dragging'), 0);
  });
  newLi.addEventListener('dragend', () => newLi.classList.remove('dragging'));
  
  return newLi;
  return li;
}

function renderKanban(){
  if (!kbTodo || !kbProgress || !kbDone || !kbStopped) return;
  
  // Limpiar todas las columnas
  kbTodo.innerHTML=''; 
  kbProgress.innerHTML='';
  kbDone.innerHTML='';
  kbStopped.innerHTML='';
  
  // Aplicar filtros
  const filteredData = WORK_ORDERS.filter(order => {
    const statusMatch = !currentFilters.status || order.status === currentFilters.status;
    const priorityMatch = !currentFilters.priority || order.priority === currentFilters.priority;
    const typeMatch = !currentFilters.type || order.type === currentFilters.type;
    const searchMatch = !currentFilters.search || 
      order.description.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      order.equipment.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      order.id.toLowerCase().includes(currentFilters.search.toLowerCase());
    
    return statusMatch && priorityMatch && typeMatch && searchMatch;
  }).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  // Distribuir tarjetas en las columnas correctas
  filteredData.forEach(order => {
    const card = makeCard(order);
    switch(order.status) {
      case 'todo':
        kbTodo.appendChild(card);
        break;
      case 'in-progress':
        kbProgress.appendChild(card);
        break;
      case 'done':
        kbDone.appendChild(card);
        break;
      case 'stopped':
        kbStopped.appendChild(card);
        break;
      default:
        kbTodo.appendChild(card); // Fallback a "Por Hacer"
    }
  });
}

// ===== Funciones de Calendario =====
let currentCalendarDate = new Date();

function renderCalendar() {
  const container = document.querySelector('.calendar-container');
  if (!container) return;

  const month = currentCalendarDate.getMonth();
  const year = currentCalendarDate.getFullYear();
  
  // Actualizar header del calendario
  const monthTitle = container.querySelector('.calendar-nav + h3');
  if (monthTitle) {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    monthTitle.textContent = `${monthNames[month]} ${year}`;
  }

  // Generar días del calendario
  const daysContainer = container.querySelector('.calendar-days');
  if (!daysContainer) return;

  daysContainer.innerHTML = '';

  // Obtener primer día del mes y número de días
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Días del mes anterior para completar la primera semana
  const prevMonth = new Date(year, month - 1, 0);
  const daysFromPrevMonth = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
  
  for (let i = daysFromPrevMonth; i > 0; i--) {
    const dayElement = createCalendarDay(prevMonth.getDate() - i + 1, 'other-month');
    daysContainer.appendChild(dayElement);
  }

  // Días del mes actual
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const isToday = isDateToday(currentDate);
    const dayElement = createCalendarDay(day, isToday ? 'today' : '');
    
    // Agregar eventos del día
    const dayEvents = getEventsForDate(currentDate);
    dayEvents.slice(0, 3).forEach(event => { // Limitar a 3 eventos visibles por día
      const eventDot = document.createElement('div');
      eventDot.className = `event-dot ${event.type}`;
      eventDot.title = `${event.description} - ${event.equipment}`;
      eventDot.textContent = event.eventType === 'due' ? 'Vence' : 
                           event.eventType === 'preventive' ? 'Prev' :
                           event.eventType === 'construction' ? 'Const' : 'Prog';
      
      // Hacer eventos clickeables
      if (event.order) {
        eventDot.style.cursor = 'pointer';
        eventDot.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(event.order);
        });
      }
      
      dayElement.appendChild(eventDot);
    });
    
    // Mostrar indicador si hay más eventos
    if (dayEvents.length > 3) {
      const moreIndicator = document.createElement('div');
      moreIndicator.className = 'more-events';
      moreIndicator.textContent = `+${dayEvents.length - 3}`;
      moreIndicator.style.cssText = `
        font-size: 10px;
        color: var(--txt-2);
        text-align: center;
        cursor: pointer;
        margin-top: 2px;
      `;
      moreIndicator.addEventListener('click', (e) => {
        e.stopPropagation();
        showDayEventsModal(currentDate, dayEvents);
      });
      dayElement.appendChild(moreIndicator);
    }

    daysContainer.appendChild(dayElement);
  }

  // Días del siguiente mes para completar la última semana
  const totalCells = daysContainer.children.length;
  const remainingCells = 42 - totalCells; // 6 filas x 7 días = 42 celdas
  
  for (let day = 1; day <= remainingCells; day++) {
    const dayElement = createCalendarDay(day, 'other-month');
    daysContainer.appendChild(dayElement);
  }
}

function createCalendarDay(dayNumber, className = '') {
  const dayElement = document.createElement('div');
  dayElement.className = `calendar-day ${className}`;
  dayElement.textContent = dayNumber;
  return dayElement;
}

function isDateToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

function getEventsForDate(date) {
  const events = [];
  const dateStr = date.toISOString().split('T')[0];
  
  // Aplicar filtros antes de generar eventos
  const filteredOrders = WORK_ORDERS.filter(order => {
    const statusMatch = !currentFilters.status || order.status === currentFilters.status;
    const priorityMatch = !currentFilters.priority || order.priority === currentFilters.priority;
    const typeMatch = !currentFilters.type || order.type === currentFilters.type;
    const searchMatch = !currentFilters.search || 
      order.description.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      order.equipment.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      order.id.toLowerCase().includes(currentFilters.search.toLowerCase());
    
    return statusMatch && priorityMatch && typeMatch && searchMatch;
  });
  
  filteredOrders.forEach(order => {
    // Verificar fecha de vencimiento
    if (order.dueDate === dateStr) {
      events.push({
        type: order.type,
        description: order.description,
        equipment: order.equipment,
        eventType: 'due',
        order: order
      });
    }
    
    // Verificar fecha de próximo preventivo
    if (order.nextPreventiveDate === dateStr) {
      events.push({
        type: 'preventivo',
        description: `Preventivo: ${order.description}`,
        equipment: order.equipment,
        eventType: 'preventive',
        order: order
      });
    }
    
    // Verificar fecha de construcción
    if (order.constructionDate === dateStr) {
      events.push({
        type: 'construccion',
        description: `Construcción: ${order.description}`,
        equipment: order.equipment,
        eventType: 'construction',
        order: order
      });
    }
    
    // Agregar duración para trabajos en progreso
    if (order.status === 'in-progress' && order.duration) {
      const startDate = new Date(order.dueDate);
      for (let i = 0; i < order.duration; i++) {
        const workDate = new Date(startDate);
        workDate.setDate(startDate.getDate() + i);
        if (workDate.toISOString().split('T')[0] === dateStr) {
          events.push({
            type: order.type,
            description: `En progreso: ${order.description}`,
            equipment: order.equipment,
            eventType: 'inprogress',
            order: order
          });
        }
      }
    }
  });
  
  return events;
}

// Drag and drop para Kanban
if (kbTodo && kbProgress && kbDone && kbStopped) {
  [kbTodo, kbProgress, kbDone, kbStopped].forEach(col=>{
    col.addEventListener('dragover', e=>{ 
      e.preventDefault(); 
      col.classList.add('drop-hint'); 
    });
    
    col.addEventListener('dragleave', (e)=> {
      // Solo remover la clase si realmente salimos del elemento
      if (!col.contains(e.relatedTarget)) {
        col.classList.remove('drop-hint');
      }
    });
    
    col.addEventListener('drop', e=>{
      e.preventDefault(); 
      col.classList.remove('drop-hint');
      const id = e.dataTransfer.getData('text/plain');
      
      // Determinar el estado basado en el ID de la columna
      let targetStatus = 'todo';
      switch(col.id) {
        case 'kb-todo':
          targetStatus = 'todo';
          break;
        case 'kb-progress':
          targetStatus = 'in-progress';
          break;
        case 'kb-done':
          targetStatus = 'done';
          break;
        case 'kb-stopped':
          targetStatus = 'stopped';
          break;
      }
      
      const order = WORK_ORDERS.find(x=>x.id===id);
      if(order && order.status !== targetStatus){ 
        order.status = targetStatus; 
        renderKanban(); 
        renderCalendar(); 
        if(typeof renderTable === 'function') renderTable(); 
        
        // Mostrar notificación de cambio
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = `✅ ${order.id} movido a ${
          targetStatus === 'todo' ? 'Por Hacer' :
          targetStatus === 'in-progress' ? 'En Progreso' :
          targetStatus === 'done' ? 'Hechas' : 'Paradas'
        }`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.remove();
        }, 2000);
      }
    });
  });
}

// ===== Modal =====
const modal = document.getElementById('modal');
const mTitle = document.getElementById('mTitle');
const mContent = document.getElementById('mContent');
const mToggle = document.getElementById('mToggle');
const mClose = document.getElementById('mClose');
const mSave = document.getElementById('mSave');
const mCancel = document.getElementById('mCancel');
const newOrderBtn = document.getElementById('newOrderBtn');
let currentEvent = null;
let isEditMode = false;

function openModal(order, isNew = false){
  if (!modal || !mTitle || !mContent) return;
  
  currentEvent = order;
  isEditMode = true;
  
  if (isNew) {
    mTitle.textContent = '➕ Nueva Orden de Trabajo';
  } else {
    const typeDisplay = order.type === 'correctivo' ? 'Correctivo' : 
                       order.type === 'preventivo' ? 'Preventivo' : 'Construcción';
    mTitle.textContent = `✏️ Editar: ${order.description}`;
  }
  
  let additionalInfo = '';
  if (order.nextPreventiveDate) {
    additionalInfo += `
      <div class="modal-field">
        <label>📅 Próximo Preventivo:</label>
        <input type="date" value="${order.nextPreventiveDate}" onchange="updateField('${order.id}', 'nextPreventiveDate', this.value)">
      </div>`;
  }
  if (order.constructionDate) {
    additionalInfo += `
      <div class="modal-field">
        <label>🏗️ Fecha Construcción:</label>
        <input type="date" value="${order.constructionDate}" onchange="updateField('${order.id}', 'constructionDate', this.value)">
      </div>`;
  }
  if (order.duration) {
    additionalInfo += `
      <div class="modal-field">
        <label>⏱️ Duración Estimada:</label>
        <input type="number" value="${order.duration}" min="1" max="365" onchange="updateField('${order.id}', 'duration', this.value)"> días
      </div>`;
  }
  
  mContent.innerHTML = `
    <form id="orderForm" class="order-form">
      <div class="form-grid">
        <div class="form-section">
          <h4>📋 Información General</h4>
          <div class="form-field">
            <label>🆔 ID:</label>
            <input type="text" id="orderId" value="${order.id || ''}" ${isNew ? '' : 'readonly'} required>
          </div>
          <div class="form-field">
            <label>📝 Descripción:</label>
            <textarea id="orderDescription" rows="2" placeholder="Descripción de la orden..." required>${order.description || ''}</textarea>
          </div>
          <div class="form-field">
            <label>⚙️ Equipo:</label>
            <select id="orderEquipment" required>
              <option value="">Seleccionar equipo...</option>
              <option value="Bomba Principal A1" ${order.equipment === 'Bomba Principal A1' ? 'selected' : ''}>Bomba Principal A1</option>
              <option value="Bomba Principal A2" ${order.equipment === 'Bomba Principal A2' ? 'selected' : ''}>Bomba Principal A2</option>
              <option value="Motor Eléctrico B1" ${order.equipment === 'Motor Eléctrico B1' ? 'selected' : ''}>Motor Eléctrico B1</option>
              <option value="Compresor C1" ${order.equipment === 'Compresor C1' ? 'selected' : ''}>Compresor C1</option>
              <option value="Válvula Control V1" ${order.equipment === 'Válvula Control V1' ? 'selected' : ''}>Válvula Control V1</option>
              <option value="Sistema Refrigeración" ${order.equipment === 'Sistema Refrigeración' ? 'selected' : ''}>Sistema Refrigeración</option>
              <option value="Panel Control" ${order.equipment === 'Panel Control' ? 'selected' : ''}>Panel Control</option>
            </select>
          </div>
          <div class="form-field">
            <label>👤 Asignado a:</label>
            <select id="orderAssignedTo" required>
              <option value="">Seleccionar técnico...</option>
              <option value="Juan Pérez" ${order.assignedTo === 'Juan Pérez' ? 'selected' : ''}>Juan Pérez</option>
              <option value="María García" ${order.assignedTo === 'María García' ? 'selected' : ''}>María García</option>
              <option value="Carlos López" ${order.assignedTo === 'Carlos López' ? 'selected' : ''}>Carlos López</option>
              <option value="Ana Martín" ${order.assignedTo === 'Ana Martín' ? 'selected' : ''}>Ana Martín</option>
              <option value="Luis Torres" ${order.assignedTo === 'Luis Torres' ? 'selected' : ''}>Luis Torres</option>
            </select>
          </div>
        </div>
        
        <div class="form-section">
          <h4>📊 Estado y Prioridad</h4>
          <div class="form-field">
            <label>🚦 Estado:</label>
            <select id="orderStatus" required>
              <option value="todo" ${order.status === 'todo' ? 'selected' : ''}>📝 Por Hacer</option>
              <option value="in-progress" ${order.status === 'in-progress' ? 'selected' : ''}>⚡ En Progreso</option>
              <option value="stopped" ${order.status === 'stopped' ? 'selected' : ''}>⛔ Parado</option>
              <option value="done" ${order.status === 'done' ? 'selected' : ''}>✅ Hecho</option>
            </select>
          </div>
          <div class="form-field">
            <label>🎯 Prioridad:</label>
            <select id="orderPriority" required>
              <option value="low" ${order.priority === 'low' ? 'selected' : ''}>� Baja</option>
              <option value="medium" ${order.priority === 'medium' ? 'selected' : ''}>🟡 Media</option>
              <option value="high" ${order.priority === 'high' ? 'selected' : ''}>� Alta</option>
            </select>
          </div>
          <div class="form-field">
            <label>� Tipo:</label>
            <select id="orderType" required>
              <option value="correctivo" ${order.type === 'correctivo' ? 'selected' : ''}>🔧 Correctivo</option>
              <option value="preventivo" ${order.type === 'preventivo' ? 'selected' : ''}>⚙️ Preventivo</option>
              <option value="construccion" ${order.type === 'construccion' ? 'selected' : ''}>🏗️ Construcción</option>
            </select>
          </div>
        </div>
        
        <div class="form-section">
          <h4>📅 Fechas</h4>
          <div class="form-field">
            <label>📆 Fecha Creación:</label>
            <input type="date" id="orderCreatedDate" value="${order.createdDate || new Date().toISOString().split('T')[0]}" required>
          </div>
          <div class="form-field">
            <label>⏰ Fecha Vencimiento:</label>
            <input type="date" id="orderDueDate" value="${order.dueDate || ''}" required>
          </div>
          <div class="form-field">
            <label>⚡ Duración Estimada:</label>
            <select id="orderDuration" required>
              <option value="">Seleccionar duración...</option>
              <option value="1" ${order.duration === 1 || order.duration === '1' ? 'selected' : ''}>1 día</option>
              <option value="2" ${order.duration === 2 || order.duration === '2' ? 'selected' : ''}>2 días</option>
              <option value="3" ${order.duration === 3 || order.duration === '3' ? 'selected' : ''}>3 días</option>
              <option value="5" ${order.duration === 5 || order.duration === '5' ? 'selected' : ''}>5 días</option>
              <option value="7" ${order.duration === 7 || order.duration === '7' ? 'selected' : ''}>1 semana</option>
              <option value="14" ${order.duration === 14 || order.duration === '14' ? 'selected' : ''}>2 semanas</option>
              <option value="30" ${order.duration === 30 || order.duration === '30' ? 'selected' : ''}>1 mes</option>
            </select>
          </div>
        </div>
        
        <div class="form-section full-width">
          <h4>📝 Notas</h4>
          <div class="form-field">
            <textarea id="orderNotes" rows="3" placeholder="Notas adicionales sobre la orden...">${order.notes || ''}</textarea>
          </div>
        </div>
      </div>
    </form>
  `;
  
  // Configurar botones
  if (mSave) {
    mSave.textContent = isNew ? '💾 Crear Orden' : '💾 Guardar Cambios';
  }
  
  modal.classList.add('show');
}

// Función para crear nueva orden
function createNewOrder() {
  const newOrder = {
    id: `WO-${new Date().getFullYear()}-${String(WORK_ORDERS.length + 1).padStart(3, '0')}`,
    description: '',
    equipment: '',
    priority: 'medium',
    status: 'todo',
    type: 'correctivo',
    assignedTo: '',
    estimatedHours: 2,
    createdDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
  };
  
  openModal(newOrder, true);
}

// Función para guardar la orden (nueva o editada)
function saveOrder() {
  const form = document.getElementById('orderForm');
  if (!form) return;
  
  const formData = new FormData(form);
  const orderData = {
    id: document.getElementById('orderId').value,
    description: document.getElementById('orderDescription').value,
    equipment: document.getElementById('orderEquipment').value,
    assignedTo: document.getElementById('orderAssignedTo').value,
    status: document.getElementById('orderStatus').value,
    priority: document.getElementById('orderPriority').value,
    type: document.getElementById('orderType').value,
    createdDate: document.getElementById('orderCreatedDate').value,
    dueDate: document.getElementById('orderDueDate').value,
    duration: parseInt(document.getElementById('orderDuration').value) || 1,
    notes: document.getElementById('orderNotes').value
  };
  
  // Validar campos requeridos
  if (!orderData.id || !orderData.description || !orderData.equipment || !orderData.assignedTo || !orderData.dueDate) {
    alert('Por favor, complete todos los campos requeridos.');
    return;
  }
  
  // Buscar si es una orden existente
  const existingIndex = WORK_ORDERS.findIndex(o => o.id === orderData.id);
  
  if (existingIndex >= 0) {
    // Actualizar orden existente
    WORK_ORDERS[existingIndex] = { ...WORK_ORDERS[existingIndex], ...orderData };
    showToast('✅ Orden actualizada correctamente');
  } else {
    // Agregar nueva orden
    WORK_ORDERS.push(orderData);
    showToast('✅ Nueva orden creada correctamente');
  }
  
  // Actualizar todas las vistas
  renderCurrentView();
  closeModal();
}

// Función para cerrar el modal
function closeModal() {
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
  currentEvent = null;
  isEditMode = false;
}

// Función para mostrar toast notifications
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Event listeners del modal
if (mClose) {
  mClose.onclick = closeModal;
}

if (mSave) {
  mSave.onclick = saveOrder;
}

if (newOrderBtn) {
  newOrderBtn.onclick = createNewOrder;
}

window.addEventListener('keydown', (e)=>{ 
  if(e.key==='Escape' && modal && modal.classList.contains('show')) {
    closeModal();
  }
});

function updateField(orderId, field, value) {
  const order = getWorkOrderById(orderId);
  if (!order) return;
  
  // Actualizar el valor en el objeto
  if (field === 'estimatedHours' || field === 'duration') {
    order[field] = parseFloat(value);
  } else {
    order[field] = value;
  }
  
  // Actualizar vista actual
  renderCurrentView();
  
  // Mostrar confirmación visual
  showToast('✅ Campo actualizado correctamente');
}

function showDayEventsModal(date, events) {
  if (!modal || !mTitle || !mContent) return;
  
  const dateStr = date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  mTitle.textContent = `Eventos del ${dateStr}`;
  
  let eventsHtml = '';
  events.forEach(event => {
    const typeLabel = event.type === 'correctivo' ? 'Correctivo' : 
                     event.type === 'preventivo' ? 'Preventivo' : 'Construcción';
    
    const eventTypeLabel = event.eventType === 'due' ? 'Vencimiento' :
                          event.eventType === 'preventive' ? 'Mantenimiento Preventivo' :
                          event.eventType === 'construction' ? 'Construcción' : 'En Progreso';
    
    eventsHtml += `
      <div style="padding:12px; border:1px solid var(--border-light); border-radius:8px; margin-bottom:8px; cursor:pointer; transition: all 0.2s ease;"
           onmouseover="this.style.backgroundColor='var(--brand-ultra-light)'"
           onmouseout="this.style.backgroundColor='transparent'"
           onclick="openModal(${JSON.stringify(event.order).replace(/"/g, '&quot;')})">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span class="badge type-${event.type}">${typeLabel}</span>
          <span style="font-size:12px; color:var(--txt-2);">${eventTypeLabel}</span>
        </div>
        <div style="font-weight:600; margin-bottom:4px;">${event.description}</div>
        <div style="font-size:13px; color:var(--txt-2);">${event.equipment}</div>
        ${event.order ? `<div style="font-size:12px; color:var(--txt-3);">Asignado a: ${event.order.assignedTo}</div>` : ''}
      </div>
    `;
  });
  
  mContent.innerHTML = eventsHtml || '<p style="text-align:center; color:var(--txt-2);">No hay eventos para este día</p>';
  
  // Ocultar el botón toggle para esta vista
  if (mToggle) mToggle.style.display = 'none';
  
  modal.style.display = 'flex';
  currentEvent = null; // No hay evento específico seleccionado
}

// ===== Calendar Navigation =====
const prevMonthBtn = document.querySelector('.calendar-nav:first-child');
const nextMonthBtn = document.querySelector('.calendar-nav:last-child');

if (prevMonthBtn) {
  prevMonthBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
  });
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
  });
}

// ===== Tabla =====
let sortKey = 'dueDate';
let sortAsc = true;
let currentFilters = {
  status: '',
  priority: '',
  type: '',
  search: ''
};

function renderTable() {
  const tableBody = document.getElementById('tableBody');
  if (!tableBody) return;

  // Aplicar filtros
  let filteredData = WORK_ORDERS.filter(order => {
    const statusMatch = !currentFilters.status || order.status === currentFilters.status;
    const priorityMatch = !currentFilters.priority || order.priority === currentFilters.priority;
    const typeMatch = !currentFilters.type || order.type === currentFilters.type;
    const searchMatch = !currentFilters.search || 
      order.description.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      order.equipment.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      order.assignedTo.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
      order.id.toLowerCase().includes(currentFilters.search.toLowerCase());
    
    return statusMatch && priorityMatch && typeMatch && searchMatch;
  });

  // Aplicar ordenación
  filteredData.sort((a, b) => {
    let valueA = a[sortKey];
    let valueB = b[sortKey];
    
    // Convertir fechas para ordenación
    if (sortKey === 'dueDate' || sortKey === 'createdDate') {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }
    
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    
    if (valueA < valueB) return sortAsc ? -1 : 1;
    if (valueA > valueB) return sortAsc ? 1 : -1;
    return 0;
  });

  tableBody.innerHTML = '';
  
  filteredData.forEach(order => {
    const row = document.createElement('tr');
    row.style.cursor = 'pointer';
    
    const typeDisplay = order.type === 'correctivo' ? 'Correctivo' : 
                       order.type === 'preventivo' ? 'Preventivo' : 'Construcción';
    
    const priorityDisplay = order.priority === 'high' ? 'Alta' : 
                           order.priority === 'medium' ? 'Media' : 'Baja';
    
    const statusDisplay = order.status === 'done' ? 'Completada' : 
                         order.status === 'in-progress' ? 'En Progreso' :
                         order.status === 'stopped' ? 'Parada' : 'Por Hacer';
    
    row.innerHTML = `
      <td>${new Date(order.dueDate).toLocaleDateString('es-ES')}</td>
      <td><strong>${order.id}</strong></td>
      <td>${order.description}</td>
      <td><span class="badge type-${order.type}">${typeDisplay}</span></td>
      <td><span class="badge priority-${order.priority}">${priorityDisplay}</span></td>
      <td>${order.equipment}</td>
      <td>${order.assignedTo}</td>
      <td><span class="badge ${getStatusBadgeClass(order.status)}">${statusDisplay}</span></td>
    `;
    
    row.addEventListener('click', () => openModal(order));
    tableBody.appendChild(row);
  });
}

function getStatusBadgeClass(status) {
  const classes = {
    'todo': 'pending',
    'in-progress': 'in-progress', 
    'stopped': 'cancelled',
    'done': 'completed'
  };
  return classes[status] || 'pending';
}

// Event listeners para ordenación de tabla
document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('thead th[data-sort]');
  headers.forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
      const newSortKey = header.getAttribute('data-sort');
      if (sortKey === newSortKey) {
        sortAsc = !sortAsc;
      } else {
        sortKey = newSortKey;
        sortAsc = true;
      }
      
      // Actualizar indicadores visuales
      headers.forEach(h => h.textContent = h.textContent.replace(' ↑', '').replace(' ↓', ''));
      header.textContent += sortAsc ? ' ↑' : ' ↓';
      
      if (currentView === 'table') renderTable();
    });
  });
});

// ===== Filtros =====
function setupFilters() {
  const statusFilter = document.getElementById('statusFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  const typeFilter = document.getElementById('typeFilter');
  const searchInput = document.getElementById('searchInput');

  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      currentFilters.status = e.target.value;
      renderCurrentView();
    });
  }

  if (priorityFilter) {
    priorityFilter.addEventListener('change', (e) => {
      currentFilters.priority = e.target.value;
      renderCurrentView();
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      currentFilters.type = e.target.value;
      renderCurrentView();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.search = e.target.value;
      renderCurrentView();
    });
  }
}

// ===== View switch =====
let currentView = 'kanban';
const viewButtons = document.querySelectorAll('.segmented button');
const viewCalendar = document.getElementById('calendar-view');
const viewTable = document.getElementById('table-view');
const viewKanban = document.getElementById('view-kanban');

if (viewButtons.length > 0) {
  viewButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      viewButtons.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.dataset.view;
      if (viewCalendar) viewCalendar.style.display = currentView==='calendar' ? 'block':'none';
      if (viewTable) viewTable.style.display = currentView==='table' ? 'block':'none';
      if (viewKanban) viewKanban.style.display = currentView==='kanban' ? 'block':'none';
      renderCurrentView();
    });
  });
}

function renderCurrentView(){
  if(currentView==='calendar') renderCalendar();
  if(currentView==='table') renderTable();
  if(currentView==='kanban') renderKanban();
}

// ===== Init =====
(function init(){
  // Inicializar vista por defecto (kanban)
  const defaultViewBtn = document.querySelector('[data-view="kanban"]');
  if (defaultViewBtn) defaultViewBtn.classList.add('active');
  
  // Configurar vistas iniciales
  if (viewCalendar) viewCalendar.style.display = 'none';
  if (viewTable) viewTable.style.display = 'none'; 
  if (viewKanban) viewKanban.style.display = 'block';
  
  renderCurrentView();
})();