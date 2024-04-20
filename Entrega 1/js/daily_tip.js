$(document).ready(function() {
    console.log("jQuery está funcionando");
    $('#completeTip').click(function() {
        console.log("Botón pulsado");
        $('#confirmationMessage').removeClass('d-none'); // Muestra el mensaje
        $(this).prop('disabled', true); // Deshabilita el botón después de hacer clic
    });
});
