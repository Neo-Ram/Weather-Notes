let notas = []; // Asegúrate de que las notas estén accesibles

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const correo = localStorage.getItem('correo');
        if (!correo) return;

        const response = await fetch(`http://localhost:8000/obtenernotas/${correo}`);
        notas = await response.json();

        const bloqueNotas = document.querySelector('.bloquenotas');
        const titulo = bloqueNotas.querySelector('h1');
        const hr = bloqueNotas.querySelector('hr');
        bloqueNotas.innerHTML = '';
        bloqueNotas.appendChild(titulo);
        bloqueNotas.appendChild(hr);

        notas.forEach(nota => {
            const notaElement = document.createElement('div');
            notaElement.className = 'xnota';
            notaElement.innerHTML = `
                <h2>${nota.title}</h2>
                <p>${nota.content}</p>
                <p class="hora">${nota.timestamp}</p>
                <p class="fecha">${nota.date}</p>
                <button onclick="editarNota('${nota.id}')">editar</button>
                <button onclick="eliminarNota('${nota.id}')" class="eliminar-btn">eliminar</button>
            `;
            bloqueNotas.appendChild(notaElement);
        });

    } catch (error) {
        console.error('Error al cargar las notas:', error);
    }
});
// Función para eliminar nota
async function eliminarNota(id) {
    try {
        const correo = localStorage.getItem('correo');
        if (!correo) return;

        // Confirmar antes de eliminar
        if (!confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            return;
        }

        const response = await fetch(`http://localhost:8000/eliminarnota/${correo}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar la nota');
        }

        // Recargar las notas después de eliminar
        location.reload();

    } catch (error) {
        console.error('Error al eliminar la nota:', error);
        alert('Error al eliminar la nota');
    }
}
function editarNota(id) {
    console.log('ID recibido:', id);
    console.log('Todas las notas:', notas);
    
    const nota = notas.find(n => n.id === id);
    console.log('Nota encontrada:', nota);
    
    if (nota) {
        console.log('Hora original:', nota.timestamp);
        // Convertir el string de hora (ej: "5:00 p.m.") a formato HH:mm
        let [tiempo, periodo] = nota.timestamp.split(' ');
        let [horas, minutos] = tiempo.split(':');
        horas = parseInt(horas);
        
        // Convertir a formato 24 horas
        if (periodo === 'p.m.' && horas !== 12) {
            horas = horas + 12;
        } else if (periodo === 'a.m.' && horas === 12) {
            horas = 0;
        }
        console.log('Horas en número:', horas);
        // Formatear para el input time (HH:mm)
        const horaFormateada = `${String(horas).padStart(2, '0')}:${minutos}`;
        console.log('Hora formateada final:', horaFormateada);

        document.getElementById('tituloNota').value = nota.title;
        document.getElementById('contenidoNota').value = nota.content;
        document.getElementById('horaNota').value = horaFormateada;
        document.getElementById('fechaNota').value = nota.date;
        document.querySelector('.ubicacion').textContent = nota.location || 'Ubicación no disponible';
        document.querySelector('.clima').textContent = nota.clima || 'Clima no disponible';
        document.querySelector('.crearnota').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
    } else {
        console.log('No se encontró la nota con el ID:', id);
    }
}

function cerrarModal() {
    document.querySelector('.crearnota').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}

function guardarCambios() {
    // Implementa la lógica para guardar los cambios
    cerrarModal();
}