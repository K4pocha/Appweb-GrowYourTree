document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginError = document.getElementById('loginError');
    const adventureButton = document.getElementById('startAdventureButton');

    updateAdventureButtonState();  // Actualiza el estado del botón al cargar la página

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        validateForm();
    });

    function validateForm() {
        emailInput.setCustomValidity('');
        passwordInput.setCustomValidity('');

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

        if (!loginForm.checkValidity()) {
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
                    localStorage.setItem('isLoggedIn', true); // Guarda el estado de la sesión
                    localStorage.setItem('userEmail', user.email);
                    updateUI();
                    updateAdventureButtonState();  // Actualiza el botón después del inicio de sesión
                    alert('Inicio de sesión exitoso');
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                } else {
                    loginError.textContent = 'Correo electrónico o contraseña incorrectos';
                }
            })
            .catch(error => {
                console.error('Error al cargar los usuarios:', error);
                loginError.textContent = 'Error al procesar la solicitud';
            });
    }

    function updateAdventureButtonState() {
        if (localStorage.getItem('isLoggedIn')) {
            adventureButton.textContent = "Buscar logros";
            adventureButton.onclick = function () {
                window.location.href = 'achievements.html'; // Redirecciona a la página de logros
            };
        } 
        if (!localStorage.getItem('isLoggedIn')){
            adventureButton.textContent = "¡Comienza tu aventura!";
            adventureButton.setAttribute('data-bs-toggle', 'modal');
            adventureButton.setAttribute('data-bs-target', '#loginModal');
        }
    }
});
