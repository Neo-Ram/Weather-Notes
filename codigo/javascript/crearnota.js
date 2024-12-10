document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos
    const elementosInteractivos = document.querySelectorAll('[id^="hora"], [id^="dia"]');
    const seccionCrearNota = document.querySelector('.crearnota');
    const botonCancelar = seccionCrearNota.querySelector('.botonesnota-inferior button:last-child');
    const botonGuardar = seccionCrearNota.querySelector('.botonesnota-inferior button:first-child');

    // Crear y añadir el overlay al body
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Función para obtener la ciudad
    function obtenerCiudad() {
        const elementoCiudad = document.querySelector('#ciudadNombre');
        return elementoCiudad ? elementoCiudad.textContent : 'Ciudad no especificada';
    }

    // Función para mostrar la sección
    function mostrarSeccionNota(event) {
        event.stopPropagation(); // Evitar que el click se propague

        //Obtener datos del elemento clickeado
        const horaDiv = event.currentTarget;
        const hora = horaDiv.querySelector('p').textContent;
        const ciudad = document.querySelector('#ciudadNombre').textContent;
        const clima = document.querySelector('#descripcion').textContent;

        // Guardar datos para usarlos al guardar la nota
        seccionCrearNota.dataset.hora = hora;
        seccionCrearNota.dataset.ciudad= ciudad;

        // Establecer la fecha actual
        const fechaActual = new Date();
        document.querySelector('#fechaNota').value = fechaActual.toISOString().split('T')[0];

        // Actualizar el texto del botón de ubicación con el nombre de la ciudad
        //const ubicacionButton = seccionCrearNota.querySelector('.ubicacion');
        //ubicacionButton.textContent = ciudad;

        // Actualizar el texto de clima
        const climaUbicacion = seccionCrearNota.querySelector('.botonesnota h3');
        const Ubicacion = seccionCrearNota.querySelector('.botonesnota h2');
        climaUbicacion.textContent = clima;
        Ubicacion.textContent = ciudad;

        seccionCrearNota.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Función para ocultar la sección
    function ocultarSeccionNota() {
        seccionCrearNota.style.display = 'none';
        overlay.style.display = 'none';
    }

    // Función para guardar la nota
    async function guardarNota() {
        const titulo = document.querySelector('.titulonota input[type="text"]').value;
        const contenido = document.querySelector('.contenidonota textarea').value;
        const hora = seccionCrearNota.dataset.hora;
        const ciudad = seccionCrearNota.dataset.ciudad;
        const clima = document.querySelector('#descripcion').textContent;
        const correo = localStorage.getItem('correo');

        const notaData = {
            title: titulo,
            content: contenido,
            timestamp: hora,
            date: document.querySelector('#fechaNota').value,
            location: ciudad,
            clima: clima
        };

        try {
            const response = await fetch(`http://localhost:8000/notacrear/${correo}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notaData)
            });

            if (response.ok) {
                console.log('Nota creada exitosamente');
                ocultarSeccionNota();
            }
        } catch (error) {
            console.error('Error al crear la nota:', error);
        }
    }

    // Añadir eventos
    elementosInteractivos.forEach(elemento => {
        elemento.addEventListener('click', mostrarSeccionNota);
    });

    botonCancelar.addEventListener('click', ocultarSeccionNota);
    botonGuardar.addEventListener('click', guardarNota);
    overlay.addEventListener('click', ocultarSeccionNota);

    // Evitar que los clicks dentro de la sección cierren el modal
    seccionCrearNota.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
