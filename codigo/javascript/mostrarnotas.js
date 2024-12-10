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
                <p class="fecha">${nota.date}</p>
                <button onclick="editarNota('${nota.id}')">editar</button>
            `;
            bloqueNotas.appendChild(notaElement);
        });

    } catch (error) {
        console.error('Error al cargar las notas:', error);
    }
});

function editarNota(id) {
    const nota = notas.find(n => n.id === id);
    if (nota) {
        document.getElementById('tituloNota').value = nota.title;
        document.getElementById('contenidoNota').value = nota.content;
        document.getElementById('fechaNota').value = nota.date;
        document.querySelector('.ubicacion').textContent = nota.location || 'Ubicación no disponible';
        document.querySelector('.clima').textContent = nota.clima || 'Clima no disponible';
        document.querySelector('.crearnota').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
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