function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;
    
    // Credenciales hardcodeadas
    if (username === 'jefedetaller' && password === 'jefedetaller') {
        localStorage.setItem('gmao_logged_in', 'true');
        localStorage.setItem('gmao_username', username);
        window.location.href = 'Tablet/jefedetaller.html';
    } else if ((username === 'alberto' || username === 'tecnicos') && password === '123456') {
        localStorage.setItem('gmao_logged_in', 'true');
        localStorage.setItem('gmao_username', username);
        window.location.href = 'Web/index.html';
    } else {
        alert('❌ Credenciales incorrectas. Verifique su usuario y contraseña.');
    }
}

// Verificar si ya está logueado
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('gmao_logged_in') === 'true') {
        const username = localStorage.getItem('gmao_username');
        
        // Redirigir según el usuario
        if (username === 'jefedetaller') {
            window.location.href = 'tablet/jefedetaller.html';
        } else {
            window.location.href = 'Web/index.html';
        }
    }
});