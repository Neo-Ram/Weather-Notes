document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos
    const elementosInteractivos = document.querySelectorAll('[id^="hora"], [id^="dia"]');
    const seccionCrearNota = document.querySelector('.crearnota');
    const botonCancelar = seccionCrearNota.querySelector('.botonesnota-inferior button:last-child');

    // Crear y añadir el overlay al body
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Función para mostrar la sección
    function mostrarSeccionNota(event) {
        event.stopPropagation(); // Evitar que el click se propague
        seccionCrearNota.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Función para ocultar la sección
    function ocultarSeccionNota() {
        seccionCrearNota.style.display = 'none';
        overlay.style.display = 'none';
    }

    // Añadir eventos
    elementosInteractivos.forEach(elemento => {
        elemento.addEventListener('click', mostrarSeccionNota);
    });

    botonCancelar.addEventListener('click', ocultarSeccionNota);
    overlay.addEventListener('click', ocultarSeccionNota);

    // Evitar que los clicks dentro de la sección cierren el modal
    seccionCrearNota.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
