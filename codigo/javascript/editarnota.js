// Variables globales
let notaActual = null;

// Función para editar nota
function editarNota(id) {
    const nota = notas.find(n => n.id === id);
    if (nota) {
        notaActual = nota; // Guardamos la nota actual para usarla al guardar
        document.getElementById('tituloNota').value = nota.title;
        document.getElementById('contenidoNota').value = nota.content;
        document.getElementById('fechaNota').value = nota.date;
        document.querySelector('.ubicacion').textContent = nota.location || 'Ubicación no disponible';
        document.querySelector('.clima').textContent = nota.clima || 'Clima no disponible';
        
        document.querySelector('.crearnota').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
    }
}

// Función para guardar cambios
async function guardarCambios() {
    if (!notaActual) return;
    
    const correo = localStorage.getItem('correo');
    const datosActualizados = {
        title: document.getElementById('tituloNota').value,
        content: document.getElementById('contenidoNota').value,
        date: document.getElementById('fechaNota').value,
        timestamp: notaActual.timestamp, // Usamos el timestamp original
        location: document.querySelector('.ubicacion').textContent,
        clima: document.querySelector('.clima').textContent
    };

    try {
        const response = await fetch(`http://localhost:8000/editarnota/${correo}/${notaActual.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (response.ok) {
            console.log('Nota actualizada correctamente');
            cerrarModal();
            // Recargar la página para ver los cambios
            window.location.reload();
        } else {
            console.error('Error al actualizar la nota');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Función para cerrar el modal
function cerrarModal() {
    document.querySelector('.crearnota').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    notaActual = null; // Limpiamos la nota actual
}

// Agregar event listeners cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para el botón de cancelar
    const botonCancelar = document.querySelector('.botonesnota-inferior button:last-child');
    if (botonCancelar) {
        botonCancelar.addEventListener('click', cerrarModal);
    }

    // Event listener para el botón de guardar
    const botonGuardar = document.querySelector('.botonesnota-inferior button:first-child');
    if (botonGuardar) {
        botonGuardar.addEventListener('click', guardarCambios);
    }
});