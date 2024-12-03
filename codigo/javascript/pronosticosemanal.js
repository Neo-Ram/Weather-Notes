// Mapeo de códigos de clima a nuestros íconos personalizados
const iconosPersonalizados = {
    // Día despejado y noche despejada
    '01d': 'assets/Icons/Sol.png',
    '01n': 'assets/Icons/night.png',
    
    // Pocas nubes
    '02d': 'assets/Icons/clouds.png',
    '02n': 'assets/Icons/clouds.png',
    
    // Nubes dispersas
    '03d': 'assets/Icons/clouds.png',
    '03n': 'assets/Icons/clouds.png',
    
    // Muy nublado
    '04d': 'assets/Icons/clouds.png',
    '04n': 'assets/Icons/clouds.png',
    
    // Lluvia ligera
    '09d': 'assets/Icons/rain.png',
    '09n': 'assets/Icons/rain.png',
    
    // Lluvia
    '10d': 'assets/Icons/rain.png',
    '10n': 'assets/Icons/rain.png',
    
    // Tormenta
    '11d': 'assets/Icons/storm.png',
    '11n': 'assets/Icons/storm.png',
    
    // Nieve
    '13d': 'assets/Icons/snow.png',
    '13n': 'assets/Icons/snow.png',
    
    // Niebla
    '50d': 'assets/Icons/mist.png',
    '50n': 'assets/Icons/mist.png'
};

// Función para obtener y mostrar el pronóstico
async function actualizarPronostico(ciudad) {
    try {
        const response = await fetch(`http://localhost:8000/pronostico/${ciudad}`);
        const data = await response.json();
        
        // Obtener los pronósticos
        const pronosticos = data.pronostico;

        // Actualizar cada día
        pronosticos.slice(0, 5).forEach((pronostico, index) => {
            const diaElement = document.getElementById(`dia${index + 1}`);
            if (diaElement) {
                // Parsear la fecha manualmente
                const [diaSemana, diaMes] = pronostico.fecha.split(', ');
                const fecha = new Date(diaMes + ' ' + new Date().getFullYear());
                
                // Formatear la fecha para mostrar "mar, 3 dic"
                const dia = fecha.toLocaleDateString('es-ES', { 
                    weekday: 'short', 
                    day: 'numeric',
                    month: 'short'
                }).toLowerCase();

                // Obtener el ícono personalizado o usar uno por defecto
                const iconoSrc = iconosPersonalizados[pronostico.icono] || 'assets/Icons/clouds.png';

                // Actualizar el contenido
                diaElement.innerHTML = `
                    <h3>${dia}</h3>
                    <img src="assets/Icons/drop.png" alt="" class="gotita">
                    <p>${pronostico.humedad}%</p>
                    <img src="${iconoSrc}" alt="${pronostico.descripcion}">
                    <h2>${Math.round(pronostico.temp_min)}/${Math.round(pronostico.temp_max)}°</h2>
                `;
            }
        });
    } catch (error) {
        console.error('Error al obtener el pronóstico:', error);
    }
}

// Llamar a la función cuando se cargue la página
window.addEventListener('load', () => {
    actualizarPronostico('Los Mochis');
});

// Actualizar cuando se busque una nueva ciudad
document.getElementById('buscarButton').addEventListener('click', () => {
    const ciudad = document.getElementById('ciudadInput').value;
    actualizarPronostico(ciudad);
});