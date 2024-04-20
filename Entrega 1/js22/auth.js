//JS Para todas las paginas que requieran de autenticación del usuario para acceder.

document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem('userEmail')) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "index.html"; // Redirecciona a la página de inicio de sesión
    }
});
