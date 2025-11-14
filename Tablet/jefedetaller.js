function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('gmao_logged_in');
        localStorage.removeItem('gmao_username');
        window.location.href = '../index.html';
    }
}

function volverAtras() {
    window.location.href = '../';
}

function verSolicitudes() {
    // Redirigir a la página de visualización de solicitudes
    window.location.href = 'ver-solicitudes.html';
}

function crearSolicitud() {
    // Redirigir a la página de creación de órdenes de trabajo
    window.location.href = 'crear-orden-trabajo.html';
}

function verOrdenesTrabajo() {
    // Redirigir a la página de órdenes de trabajo kanban
    window.location.href = 'ver-ordenes-trabajo.html';
}

// Verificar autenticación al cargar la página
window.addEventListener('load', () => {
    if (localStorage.getItem('gmao_logged_in') !== 'true') {
        window.location.href = '../index.html';
    }
    
    // Verificar que sea el usuario correcto
    const username = localStorage.getItem('gmao_username');
    if (username !== 'jefedetaller') {
        alert('❌ Acceso no autorizado para este usuario');
        window.location.href = '../index.html';
    }
});