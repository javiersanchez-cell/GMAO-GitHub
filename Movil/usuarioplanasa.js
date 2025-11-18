// Funciones de navegación principal
function irACrearIncidencia() {
    console.log('📝 Navegando a crear incidencia...');
    window.location.href = 'crear-incidencia.html';
}

function irAVerIncidencias() {
    console.log('👀 Navegando a mis solicitudes...');
    // Redirigir a la página de mis solicitudes en móvil
    window.location.href = 'mis-solicitudes.html';
}

function volverAlMenu() {
    console.log('🏠 Volviendo al menú principal...');
    // Si hay una página anterior, volver a ella, sino ir a index principal
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Redirigir al índice principal del proyecto
        window.location.href = '../index.html';
    }
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        console.log('🚪 Cerrando sesión...');
        
        // Limpiar datos locales
        localStorage.removeItem('incidenciaData');
        localStorage.removeItem('userData');
        
        // Redirigir al login o página principal
        window.location.href = '../index.html';
    }
}

// Acciones rápidas
function escanearQRRapido() {
    console.log('📱 Iniciando escaneo QR rápido...');
    // Ir directamente a crear incidencia y abrir el escáner QR
    sessionStorage.setItem('autoOpenQR', 'true');
    window.location.href = 'crear-incidencia.html';
}

function reportarEmergencia() {
    console.log('🚨 Reportando emergencia...');
    // Ir a crear incidencia con tipo de emergencia preseleccionado
    sessionStorage.setItem('emergencyMode', 'true');
    window.location.href = 'crear-incidencia.html';
}

function mostrarAyuda() {
    console.log('❓ Mostrando ayuda...');
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 90%; max-height: 80%; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="color: rgb(63, 156, 53); margin: 0;">
                    <i class="fas fa-question-circle"></i> Ayuda - GMAO Móvil
                </h2>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="line-height: 1.6; color: #374151;">
                <h3 style="color: rgb(63, 156, 53); margin-bottom: 1rem;">🏠 Menú Principal</h3>
                <p style="margin-bottom: 1rem;"><strong>Crear Incidencia:</strong> Reporta averías, solicita mantenimiento o registra trabajos de construcción.</p>
                <p style="margin-bottom: 1.5rem;"><strong>Ver Incidencias:</strong> Consulta el estado de todas las incidencias que hayas creado.</p>
                
                <h3 style="color: rgb(63, 156, 53); margin-bottom: 1rem;">⚡ Acciones Rápidas</h3>
                <p style="margin-bottom: 0.5rem;"><strong>Escanear QR:</strong> Abre directamente el escáner para identificar activos.</p>
                <p style="margin-bottom: 0.5rem;"><strong>Emergencia:</strong> Crea una incidencia urgente de forma rápida.</p>
                <p style="margin-bottom: 1.5rem;"><strong>Ayuda:</strong> Muestra esta ventana de información.</p>
                
                <h3 style="color: rgb(63, 156, 53); margin-bottom: 1rem;">📱 Uso del QR</h3>
                <p style="margin-bottom: 1rem;">Los códigos QR de los activos contienen información que rellena automáticamente los formularios. Asegúrate de dar permisos de cámara cuando se soliciten.</p>
                
                <h3 style="color: rgb(63, 156, 53); margin-bottom: 1rem;">💡 Consejos</h3>
                <p style="margin-bottom: 0.5rem;">• Mantén la app actualizada para mejor rendimiento</p>
                <p style="margin-bottom: 0.5rem;">• Toma fotos claras de las evidencias</p>
                <p style="margin-bottom: 0.5rem;">• Describe detalladamente los problemas</p>
                
                <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
                    <p><strong>PLANASA GMAO v1.0</strong> - Sistema de Gestión de Mantenimiento</p>
                </div>
            </div>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Función para actualizar estadísticas (simulada)
function actualizarEstadisticas() {
    // Esta función se puede conectar con una API real más tarde
    const stats = {
        pendientes: Math.floor(Math.random() * 10) + 1,
        enProceso: Math.floor(Math.random() * 5) + 1,
        completadas: Math.floor(Math.random() * 20) + 10
    };
    
    // Actualizar los números en la interfaz si existen los elementos
    const pendientesEl = document.querySelector('.stat-item:nth-child(1) .stat-number');
    const procesoEl = document.querySelector('.stat-item:nth-child(2) .stat-number');
    const completadasEl = document.querySelector('.stat-item:nth-child(3) .stat-number');
    
    if (pendientesEl) pendientesEl.textContent = stats.pendientes;
    if (procesoEl) procesoEl.textContent = stats.enProceso;
    if (completadasEl) completadasEl.textContent = stats.completadas;
}

// Función de inicialización
function inicializarPagina() {
    console.log('🚀 Inicializando página principal móvil...');
    
    // Actualizar estadísticas al cargar
    actualizarEstadisticas();
    
    // Verificar si hay parámetros especiales en la URL o sessionStorage
    if (sessionStorage.getItem('fromIncidencia')) {
        // Mostrar mensaje de éxito si viene de crear incidencia
        mostrarNotificacion('✅ ¡Incidencia creada correctamente!', 'success');
        sessionStorage.removeItem('fromIncidencia');
    }
    
    // Configurar refresh de estadísticas cada 30 segundos
    setInterval(actualizarEstadisticas, 30000);
}

function mostrarNotificacion(mensaje, tipo = 'info') {
    const colores = {
        success: 'rgb(22, 163, 74)',
        error: 'rgb(220, 38, 38)',
        warning: 'rgb(245, 158, 11)',
        info: 'rgb(37, 99, 235)'
    };
    
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colores[tipo]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    notificacion.innerHTML = mensaje;
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Inicializar cuando la página esté cargada
document.addEventListener('DOMContentLoaded', inicializarPagina);

// Manejar el botón de volver del navegador
window.addEventListener('popstate', function(event) {
    console.log('🔙 Navegación hacia atrás detectada');
});

// CSS para animaciones (se agregará dinámicamente)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);