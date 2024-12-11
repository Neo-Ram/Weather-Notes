document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const tituloInput = document.querySelector('.titulonota2 input[type="text"]');
    const fechaInput = document.querySelector('.calendario-input2');
    const contenidoTextarea = document.querySelector('.contenidonota2 textarea');
    const ubicacionElement = document.querySelector('.ubicacion2');
    const climaElement = document.querySelector('.botonesnota2 h3');
    const guardarBtn = document.querySelector('.botonesnota-inferior2 button:first-child');
    const cancelarBtn = document.querySelector('.botonesnota-inferior2 button:last-child');

    // Obtener el correo del localStorage (asumiendo que lo guardaste durante el login)
    const correo = localStorage.getItem('correo');

    guardarBtn.addEventListener('click', async function() {
        // Obtener los valores actuales
        const titulo = tituloInput.value;
        const fechaHora = new Date(fechaInput.value);
    
        // Formatear la hora al estilo "09:54 a.m."
        const hora = fechaHora.toLocaleTimeString('es-MX', { 
            hour: '2-digit',
            minute: '2-digit',
            hour12: true 
        });
    
        // Formatear la fecha al estilo "YYYY-MM-DD"
        const fecha = fechaHora.toISOString().split('T')[0];
    
        const contenido = contenidoTextarea.value;
        const ubicacion = document.getElementById('ciudadNombre').textContent;
        const clima = document.getElementById('descripcion').textContent;
    
        if (!titulo || !fechaInput.value || !contenido) {
            alert('Por favor completa todos los campos');
            return;
        }
    
        const notaData = {
            title: titulo,
            content: contenido,
            timestamp: hora,
            date: fecha,
            location: ubicacion || 'Ubicación no disponible',
            clima: clima || 'Clima no disponible'
        };
    
        try {
            const response = await fetch(`http://localhost:8000/notacrear/${correo}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(notaData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error del servidor:', errorData);
                throw new Error(errorData.detail || 'Error al crear la nota');
            }
    
            // Limpiar y ocultar el formulario
            tituloInput.value = '';
            fechaInput.value = '';
            contenidoTextarea.value = '';
            document.querySelector('.crearnota2').style.display = 'none';
    
        } catch (error) {
            console.error('Error completo:', error);
        }
    });

    // Manejar el botón de cancelar
    cancelarBtn.addEventListener('click', function() {
        // Limpiar el formulario
        tituloInput.value = '';
        fechaInput.value = '';
        contenidoTextarea.value = '';
        
        // Ocultar el formulario
        document.querySelector('.crearnota2').style.display = 'none';
    });
});