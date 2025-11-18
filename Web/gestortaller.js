function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        localStorage.removeItem('gmao_logged_in');
        localStorage.removeItem('gmao_username');
        window.location.href = '../index.html';
    }
}

function volverAtras() {
    window.location.href = '../index.html';
}

function irAMaquinaria() {
    // Redirigir a la página de maquinaria
    window.location.href = 'maquinaria.html';
}

function irABusinessIntelligence() {
    // Redirigir a la página de Business Intelligence
    window.location.href = 'businessintelligence.html';
}

// Verificar autenticación al cargar la página
window.addEventListener('load', () => {
    if (localStorage.getItem('gmao_logged_in') !== 'true') {
        alert('Debe iniciar sesión para acceder al sistema');
        window.location.href = '../index.html';
    }
});

// Hacer las funciones disponibles globalmente
window.cerrarSesion = cerrarSesion;
window.volverAtras = volverAtras;
window.irAMaquinaria = irAMaquinaria;
window.irABusinessIntelligence = irABusinessIntelligence;