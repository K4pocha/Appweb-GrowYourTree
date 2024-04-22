document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');

    // Validación de campos individuales
    function validateField(field) {
        if (!field.checkValidity()) {
            field.classList.add('is-invalid');
        } else {
            field.classList.remove('is-invalid');
        }
    }

    // Añadir eventos a cada campo para validar individualmente
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        // Validar cuando el usuario deja el campo (blur) o mientras escribe (input)
        input.addEventListener('blur', function() {
            validateField(this);
        });
        input.addEventListener('input', function() {
            validateField(this);
        });
    });

    // Manejar el evento de envío del formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevenir el envío normal del formulario
        let isValid = true;
        inputs.forEach(input => {
            validateField(input);
            isValid = isValid && input.checkValidity(); // Comprobar la validez global
        });

        if (isValid) {
            // Imprimir datos en consola para demostrar lectura correcta.
            console.log('Usuario:', form.elements.username.value);
            console.log('Correo:', form.elements.email.value);
            console.log('Contraseña:', form.elements.password.value);

            // Mostrar mensaje de éxito
            displaySuccessMessage();

            // Redirigir al usuario después de 3 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            form.classList.add('was-validated');
        }
    });
});

function displaySuccessMessage() {
    const messageContainer = document.createElement('div');
    messageContainer.textContent = 'Registro exitoso, redirigiendo al inicio...';
    messageContainer.style.cssText = 'position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%); background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; z-index: 1000; font-size: 1.5rem;';
    document.body.appendChild(messageContainer);
}
