function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;
    
    // Credenciales hardcodeadas
    if (username === 'jefedetaller' && password === 'jefedetaller') {
        localStorage.setItem('gmao_logged_in', 'true');
        localStorage.setItem('gmao_username', username);
        window.location.href = 'Tablet/jefedetaller.html';
    } else if (username === 'gestortaller' && password === 'gestortaller') {
        localStorage.setItem('gmao_logged_in', 'true');
        localStorage.setItem('gmao_username', username);
        window.location.href = 'Web/maquinaria.html';
    } else if (username === 'usuarioplanasa' && password === 'usuarioplanasa') {
        localStorage.setItem('gmao_logged_in', 'true');
        localStorage.setItem('gmao_username', username);
        localStorage.setItem('currentUser', JSON.stringify({username: username, role: 'mobile'}));
        window.location.href = 'Movil/crear-incidencia.html';
    } else {
        alert('❌ Credenciales incorrectas. Verifique su usuario y contraseña.');
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('password-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        passwordIcon.className = 'fas fa-eye';
    }
}