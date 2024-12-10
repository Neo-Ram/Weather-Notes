// notasPorHora.js

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionar todos los íconos de nota
    const iconosNota = document.querySelectorAll('.notita');
    
    // Agregar el evento click a cada ícono
    iconosNota.forEach(icono => {
        icono.addEventListener('click', function() {
            // Obtener el div padre que contiene la hora
            const horaDiv = this.closest('.horas');
            
            // Obtener la hora y humedad
            const hora = horaDiv.querySelector('p').textContent;
            const humedad = horaDiv.querySelector('.problluvia p').textContent;
            
            // Guardar estos datos temporalmente
            localStorage.setItem('horaSeleccionada', hora);
            localStorage.setItem('humedadSeleccionada', humedad);
            
            // Llamar a tu función existente para mostrar el formulario
            toggleCrearNota(); // O como se llame tu función
        });
    });
});