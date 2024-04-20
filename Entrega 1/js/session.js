document.addEventListener("DOMContentLoaded", function () {
    updateUI();
});

function updateUI() {
    if (localStorage.getItem('userEmail')) {
        document.getElementById('userEmail').textContent = localStorage.getItem('userEmail');
        document.getElementById('userUI').classList.remove('d-none');
        document.getElementById('loginButton').classList.add('d-none');
    } else {
        document.getElementById('userUI').classList.add('d-none');
        document.getElementById('loginButton').classList.remove('d-none');
    }
}

function logout() {
    localStorage.removeItem('userEmail');
    alert("Has cerrado sesión. Se te enviara a la página de inicio.");
    window.location.href = 'index.html'; // Redirige al usuario al inicio o a la página de login.
    updateUI();
}
