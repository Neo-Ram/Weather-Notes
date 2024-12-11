// Toggle barralateral visibility
function toggleBarraLateral() {
    const barralateral = document.querySelector('.barralateral');

    // Toggle 'active' class to show/hide the barralateral
    if (barralateral.classList.contains('active')) {
        barralateral.classList.remove('active');
    } else {
        barralateral.classList.add('active');
    }
    }

function toggleBarraNotificaciones() {
    const barraNotificaciones = document.querySelector('.barranotificaciones');
    barraNotificaciones.classList.toggle('active');
}