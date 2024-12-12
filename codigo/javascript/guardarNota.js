document.addEventListener('DOMContentLoaded', function() {
    const crearNota3 = document.querySelector('.crearnota3');
    const btnGuardar = crearNota3.querySelector('.botonesnota-inferior3 button:first-child');

    btnGuardar.addEventListener('click', async function() {
        // Obtener el correo del usuario (asumiendo que está almacenado en localStorage)
        const correo = localStorage.getItem('correo');

        // Obtener todos los datos necesarios del formulario
        const titulo = crearNota3.querySelector('.titulonota3 input[type="text"]').value;
        const contenido = crearNota3.querySelector('.contenidonota3 textarea').value;
        const fechaCompleta = crearNota3.querySelector('.calendario-input3').value;
        const ubicacion = crearNota3.querySelector('.ubicacion3').textContent;
        const clima = crearNota3.querySelector('.botonesnota3 h3').textContent;

        // Separar la fecha y hora
        const [fecha, horaTemp] = fechaCompleta.split('T');
        
        // Formatear la hora al formato deseado (HH:MM a.m./p.m.)
        const horaDate = new Date(`2000-01-01T${horaTemp}`);
        const hora = horaDate.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
        
        try {
            const response = await fetch(`http://localhost:8000/notacrear/${correo}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: titulo,
                    content: contenido,
                    timestamp: hora,
                    date: fecha,
                    location: ubicacion,
                    clima: clima
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Cerrar el modal después de guardar
                const overlay = document.querySelector('.overlay3');
                crearNota3.style.display = 'none';
                if (overlay) overlay.remove();
            } else {
                throw new Error(data.detail || 'Error al guardar la nota');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});