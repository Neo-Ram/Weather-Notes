document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos
    const botonCrearNota = document.querySelector('.barralateral .crea');
    const seccionCrearNota2 = document.querySelector('.crearnota2');
    const botonCancelar = seccionCrearNota2.querySelector('.botonesnota-inferior2 button:last-child');
    const botonGuardar = seccionCrearNota2.querySelector('.botonesnota-inferior2 button:first-child');

    // Crear y añadir el overlay2 específico para crearnota2
    const overlay2 = document.createElement('div');
    overlay2.className = 'overlay2';
    document.body.appendChild(overlay2);

    // Función para mostrar la sección
    function mostrarSeccionNota2() {
        const ciudad = document.querySelector('#ciudadNombre').textContent;
        const clima = document.querySelector('#descripcion').textContent;

        // Establecer la fecha actual
        const fechaActual = new Date();
        document.querySelector('.calendario-input2').value = fechaActual.toISOString().split('T')[0];

        // Actualizar ubicación y clima
        const Ubicacion = seccionCrearNota2.querySelector('.ubicacion2');
        const climaUbicacion = seccionCrearNota2.querySelector('.botonesnota2 h3');
        Ubicacion.textContent = ciudad;
        climaUbicacion.textContent = clima;

        seccionCrearNota2.style.display = 'block';
        overlay2.style.display = 'block';
    }

    // Función para ocultar la sección
    function ocultarSeccionNota2() {
        seccionCrearNota2.style.display = 'none';
        overlay2.style.display = 'none';
    }

    // Función para guardar la nota
    async function guardarNota2() {
        const titulo = document.querySelector('.titulonota2 input[type="text"]').value;
        const contenido = document.querySelector('.contenidonota2 textarea').value;
        const fecha = document.querySelector('.calendario-input2').value;
        const ciudad = document.querySelector('#ciudadNombre').textContent;
        const clima = document.querySelector('#descripcion').textContent;
        const correo = localStorage.getItem('correo');

        const notaData = {
            title: titulo,
            content: contenido,
            date: fecha,
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
                ocultarSeccionNota2();
            }
        } catch (error) {
            console.error('Error al crear la nota:', error);
        }
    }

    // Añadir eventos
    botonCrearNota.addEventListener('click', mostrarSeccionNota2);
    botonCancelar.addEventListener('click', ocultarSeccionNota2);
    botonGuardar.addEventListener('click', guardarNota2);
    overlay2.addEventListener('click', ocultarSeccionNota2);

    // Evitar que los clicks dentro de la sección cierren el modal
    seccionCrearNota2.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
