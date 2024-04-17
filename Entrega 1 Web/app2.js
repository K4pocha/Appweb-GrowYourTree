document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const userUI = document.getElementById('userUI');
    const loginError = document.getElementById('loginError');  // Agrega esta línea para obtener el elemento del error

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        

        fetch('users.json')
            .then(response => response.json())
            .then(users => {
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    localStorage.setItem('userEmail', user.email); // Guardar el email del usuario en el almacenamiento local
                    updateUIWithUser(user.email);
                    alert('Inicio de sesión exitoso');
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                } else {
                    loginError.textContent = 'Correo electrónico o contraseña incorrectos';  // Mostrar el mensaje de error
                }
            })
            .catch(error => {
                console.error('Error al cargar los usuarios:', error);
                loginError.textContent = 'Error al procesar la solicitud';  // Mostrar error en caso de fallo en la red o servidor
            });
    });

    if (localStorage.getItem('userEmail')) {
        updateUIWithUser(localStorage.getItem('userEmail'));
    }
});

function updateUIWithUser(email) {
    document.getElementById('userEmail').textContent = email;
    document.getElementById('userUI').classList.remove('d-none');
    document.getElementById('loginButton').classList.add('d-none');
    document.getElementById('loginError').textContent = ''; // Limpiar el mensaje de error al iniciar sesión correctamente
}

function logout() {
    localStorage.removeItem('userEmail');
    document.getElementById('userUI').classList.add('d-none');
    document.getElementById('loginButton').classList.remove('d-none');
}
