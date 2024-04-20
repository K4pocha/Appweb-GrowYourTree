document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        validateForm();
    });

    function validateForm() {
        // Reiniciar la validación personalizada
        emailInput.setCustomValidity('');
        passwordInput.setCustomValidity('');

        // Verificación de los campos
        if (!emailInput.value.includes('@')) {
            emailInput.setCustomValidity('Correo erróneo');
            emailError.textContent = 'Correo erróneo';
        } else {
            emailError.textContent = '';
        }

        if (passwordInput.value.trim() === '') {
            passwordInput.setCustomValidity('Contraseña necesaria');
            passwordError.textContent = 'Contraseña necesaria';
        } else {
            passwordError.textContent = '';
        }

        if (loginForm.checkValidity() === false) {
            event.stopPropagation();
        } else {
            loginError.textContent = '';
            authenticateUser(emailInput.value, passwordInput.value);
        }
        loginForm.classList.add('was-validated');
    }

    function authenticateUser(email, password) {
        fetch('users.json')
            .then(response => response.json())
            .then(users => {
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    localStorage.setItem('userEmail', user.email);
                    updateUIWithUser(user.email);
                    alert('Inicio de sesión exitoso');
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                } else {
                    loginError.textContent = 'Correo electrónico o contraseña incorrectos';  // Mostrar el mensaje de error
                }
            })
            .catch(error => {
                console.error('Error al cargar los usuarios:', error);
                loginError.textContent = 'Error al procesar la solicitud';
            });
    }

    if (localStorage.getItem('userEmail')) {
        updateUIWithUser(localStorage.getItem('userEmail'));
    }
});

function updateUIWithUser(email) {
    document.getElementById('userEmail').textContent = email;
    document.getElementById('userUI').classList.remove('d-none');
    document.getElementById('loginButton').classList.add('d-none');
}

function logout() {
    localStorage.removeItem('userEmail');
    document.getElementById('userUI').classList.add('d-none');
    document.getElementById('loginButton').classList.remove('d-none');
}
