document.addEventListener('datosActualizados', function () {
    async function mostrarIconosNotas() {
        try {
            // Obtener el correo del usuario desde localStorage
            const correo = localStorage.getItem('correo');
            console.log('Correo del usuario:', correo);

            if (!correo) return; // Si no hay correo, no se ejecuta la lógica

            // Hacer una solicitud para obtener las notas del usuario
            const response = await fetch(`http://localhost:8000/obtenernotas/${correo}`);
            const notas = await response.json();
            console.log('Notas obtenidas:', notas);

            // Obtener todos los divs que representan horas
            const horasDivs = document.querySelectorAll('[id^="hora"]');
            console.log('Divs de horas encontrados:', horasDivs.length);

            // Iterar sobre cada div de hora
            horasDivs.forEach(horaDiv => {
                // Buscar el elemento <p> dentro del div
                const horaParrafo = horaDiv.querySelector('p');
                if (!horaParrafo) {
                    console.warn('No se encontró un elemento <p> dentro de este horaDiv:', horaDiv);
                    return;
                }

                // Obtener el texto de la hora desde el <p> y normalizarlo
                const horaTexto = horaParrafo.textContent.trim().toLowerCase();
                console.log('Revisando hora:', horaTexto);

                // Verificar si existe una nota para esta hora
                const tieneNota = notas.some(nota => {
                    const horaNota = nota.timestamp.trim().toLowerCase();
                    return horaNota === horaTexto;
                });

                console.log('¿Tiene nota?:', tieneNota);

                // Buscar el ícono de nota (.notita) dentro del div
                const iconoNota = horaDiv.querySelector('.notita');
                if (iconoNota) {
                    // Mostrar u ocultar el ícono según si hay una nota
                    iconoNota.style.visibility = tieneNota ? 'visible' : 'hidden';
                    console.log(`Ícono para ${horaTexto} cambiado a: ${iconoNota.style.visibility}`);
                } else {
                    console.warn('No se encontró un ícono de nota (.notita) en:', horaDiv);
                }
            });
        } catch (error) {
            console.error('Error al mostrar iconos de notas:', error);
        }
    }

    console.log('DOM cargado, iniciando mostrarIconosNotas');
    mostrarIconosNotas();
});
