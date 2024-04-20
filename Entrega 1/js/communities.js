$(document).ready(function() {
    $('.community-link, #createGroup').on('click', function(event) {
        event.preventDefault();
        if (!isLoggedIn()) {
            $('#loginModal').modal('show');
        } else {
            alert("Próximamente disponible");
        }
    });

    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }
});
