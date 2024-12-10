async function obtenerNotasProximas() {
    try {
        const correo = localStorage.getItem('correo');
        const response = await fetch(`http://localhost:8000/proximas-notas/${correo}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener las notas próximas');
        }

        const notasProximas = await response.json();
        const contenedorNotas = document.querySelector('.notas');
        
        // Mantener el título principal
        contenedorNotas.innerHTML = '<h1>Notas próximas</h1>';

        if (notasProximas.length === 0) {
            contenedorNotas.innerHTML += `
                <p>No hay notas próximas</p>
            `;
        } else {
            notasProximas.forEach(nota => {
                // Formatear la fecha para que sea más legible
                const fecha = new Date(nota.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long'
                });
                
                contenedorNotas.innerHTML += `
                    <div class="nota-item">
                        <p class="fecha">${fecha}</p>
                        <h3>${nota.timestamp}</h3>
                        <p>${nota.title}</p>
                    </div>
                `;
            });
        }

        // Agregar el botón al final
        contenedorNotas.innerHTML += `
            <button onclick="window.location.href='todaslasnotas.html'">Ver todas</button>
        `;

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar las notas próximas');
    }
}

document.addEventListener('DOMContentLoaded', obtenerNotasProximas);