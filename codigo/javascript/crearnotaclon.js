document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos
    const botonesEditar = document.querySelectorAll('.xnota button');
    const seccionCrearNota = document.querySelector('.crearnota');
    const botonCancelar = seccionCrearNota.querySelector('.botonesnota-inferior button:last-child');

    // Crear y añadir el overlay al body
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Función para mostrar la sección
    function mostrarSeccionNota(event) {
        event.stopPropagation();
        seccionCrearNota.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Función para ocultar la sección
    function ocultarSeccionNota() {
        seccionCrearNota.style.display = 'none';
        overlay.style.display = 'none';
    }

    // Añadir eventos a los botones de editar
    botonesEditar.forEach(boton => {
        boton.addEventListener('click', mostrarSeccionNota);
    });

    botonCancelar.addEventListener('click', ocultarSeccionNota);
    overlay.addEventListener('click', ocultarSeccionNota);

    // Evitar que los clicks dentro de la sección cierren el modal
    seccionCrearNota.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
