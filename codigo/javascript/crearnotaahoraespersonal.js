document.addEventListener('DOMContentLoaded', function() {
    const lineasPronostico = document.querySelectorAll('.lineapronosticodias');
    const crearNota3 = document.querySelector('.crearnota3');
    
    // Función para capitalizar la primera letra
    function capitalizarPrimeraLetra(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }
    
    lineasPronostico.forEach((linea) => {
        linea.addEventListener('click', function() {
            // Obtener datos del pronóstico
            const ciudad = document.getElementById('ciudadNombre').textContent.trim();
            const fechaTexto = linea.querySelector('h3').textContent.trim(); // Ejemplo: "mié, 11 dic"
            const clima = capitalizarPrimeraLetra(linea.querySelector('img:nth-of-type(2)').alt.trim());

            console.log("Ciudad:", ciudad);
            console.log("Fecha Texto:", fechaTexto);
            console.log("Clima:", clima);

            // Mostrar crearnota3
            crearNota3.style.display = 'block';

            // Rellenar datos automáticamente
            const ubicacionElement = crearNota3.querySelector('.ubicacion3');
            const climaElement = crearNota3.querySelector('h3');
            const fechaInput = crearNota3.querySelector('.calendario-input3');

            // Establecer ubicación y clima
            ubicacionElement.textContent = ciudad;
            climaElement.textContent = clima;

            // Transformar fecha
            const regexFecha = /([\wñáéíóú]+), (\d{1,2}) (\w{3})/u; // La "u" permite caracteres Unicode
            const match = fechaTexto.match(regexFecha);

            if (match) {
                const [, diaSemana, dia, mes] = match;
                const año = new Date().getFullYear();
                const meses = {
                    'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
                    'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
                };

                if (meses[mes] !== undefined) {
                    const fechaPronostico = new Date(año, meses[mes], parseInt(dia));
                    
                    // Obtener la hora actual
                    const horaActual = new Date();
                    fechaPronostico.setHours(horaActual.getHours());
                    fechaPronostico.setMinutes(horaActual.getMinutes());
                    
                    // Ajustar el formato considerando la zona horaria
                    const fechaFormateadaBD = fechaPronostico.getFullYear() + '-' +
                        String(fechaPronostico.getMonth() + 1).padStart(2, '0') + '-' +
                        String(fechaPronostico.getDate()).padStart(2, '0') + 'T' +
                        String(fechaPronostico.getHours()).padStart(2, '0') + ':' +
                        String(fechaPronostico.getMinutes()).padStart(2, '0');
                    
                    // Formato: día-mes-año para visualización
                    const fechaFormateadaVisual = `${dia.padStart(2, '0')}-${String(meses[mes] + 1).padStart(2, '0')}-${año}`;
                    
                    // Nuevo formato: año-mes-día
                    const fechaFormateadaSimple = `${año}-${String(meses[mes] + 1).padStart(2, '0')}-${dia.padStart(2, '0')}`;
                    
                    // Mostrar en el input
                    fechaInput.value = fechaFormateadaBD;
                    console.log("Fecha Formateada (BD):", fechaFormateadaBD);
                    console.log("Fecha Formateada (Visual):", fechaFormateadaVisual);
                    console.log("Fecha Formateada (Simple):", fechaFormateadaSimple);
                } else {
                    console.error("Mes no reconocido:", mes);
                    fechaInput.value = ''; // Deja vacío en caso de error
                }
            } else {
                console.error("El formato de la fecha no coincide:", fechaTexto);
                fechaInput.value = ''; // Deja vacío en caso de error
            }

            // Crear y mostrar overlay
            const overlay = document.createElement('div');
            overlay.className = 'overlay3';
            document.body.appendChild(overlay);
            overlay.style.display = 'block';

            // Agregar evento para cerrar con el botón Cancelar
            const btnCancelar = crearNota3.querySelector('.botonesnota-inferior3 button:last-child');
            btnCancelar.removeEventListener('click', cerrarNota); // Evitar múltiples eventos
            btnCancelar.addEventListener('click', cerrarNota);

            // Agregar evento para cerrar al hacer clic en el overlay
            overlay.removeEventListener('click', cerrarNota); // Evitar múltiples eventos
            overlay.addEventListener('click', cerrarNota);
        });
    });

    function cerrarNota() {
        crearNota3.style.display = 'none';
        const overlay = document.querySelector('.overlay3');
        if (overlay) {
            overlay.remove();
        }
    }
});
