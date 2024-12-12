document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los elementos con clase lineapronosticodias
    const lineasPronostico = document.querySelectorAll('.lineapronosticodias');
    const crearNota3 = document.querySelector('.crearnota3');
    
    // Agregar evento click a cada línea de pronóstico
    lineasPronostico.forEach(linea => {
        linea.addEventListener('click', function() {
            // Mostrar crearnota3
            crearNota3.style.display = 'block';
            
            // Crear y mostrar overlay
            const overlay = document.createElement('div');
            overlay.className = 'overlay3';
            document.body.appendChild(overlay);
            overlay.style.display = 'block';

            // Agregar evento para cerrar con el botón Cancelar
            const btnCancelar = crearNota3.querySelector('.botonesnota-inferior3 button:last-child');
            btnCancelar.addEventListener('click', cerrarNota);

            // Agregar evento para cerrar al hacer clic en el overlay
            overlay.addEventListener('click', cerrarNota);
        });
    });

    // Funci��n para cerrar la nota
    function cerrarNota() {
        crearNota3.style.display = 'none';
        const overlay = document.querySelector('.overlay3');
        if (overlay) {
            overlay.remove();
        }
    }
});
