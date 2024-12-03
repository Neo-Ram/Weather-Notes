// Mapeo de códigos de OpenWeather a nuestros íconos
const iconMapping = {
    '01d': 'assets/Icons/Sol.png',      // día despejado
    '01n': 'assets/Icons/night.png',    // noche despejada
    '02d': 'assets/Icons/clouds.png',   // pocas nubes día
    '02n': 'assets/Icons/clouds.png',   // pocas nubes noche
    '03d': 'assets/Icons/clouds.png',   // nubes dispersas
    '03n': 'assets/Icons/clouds.png',
    '04d': 'assets/Icons/clouds.png',   // muy nublado
    '04n': 'assets/Icons/clouds.png',
    '09d': 'assets/Icons/rain.png',     // lluvia ligera
    '09n': 'assets/Icons/rain.png',
    '10d': 'assets/Icons/rain.png',     // lluvia
    '10n': 'assets/Icons/rain.png',
    '11d': 'assets/Icons/storm.png',    // tormenta
    '11n': 'assets/Icons/storm.png',
    // Añade más mappings según tus íconos disponibles
};
async function obtenerPronosticoHorario(ciudad) {
    try {
        const response = await fetch(`http://localhost:8000/pronostico_horario/${ciudad}`);
        const data = await response.json();
        
        // Obtener solo los primeros 9 períodos (ya que tienes 9 divs de horas)
        const pronosticos = data.list.slice(0, 9);
        
        pronosticos.forEach((pronostico, index) => {
            const horaDiv = document.getElementById(`hora${index + 1}`);
            if (horaDiv) {
                // Convertir timestamp a hora legible
                const fecha = new Date(pronostico.dt * 1000);
                const hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // Actualizar contenido del div
                horaDiv.querySelector('p').textContent = hora;
                
                // Actualizar icono del clima
                const iconCode = pronostico.weather[0].icon;
                const iconPath = iconMapping[iconCode] || 'assets/Icons/sun.png'; // Imagen por defecto si no hay mapeo
                horaDiv.querySelector('img').src = iconPath;
                
                // Actualizar porcentaje de lluvia
                const humedad = pronostico.main.humidity;
                horaDiv.querySelector('.problluvia p').textContent = `${humedad}%`;
            }
        });

    } catch (error) {
        console.error('Error al obtener el pronóstico por hora:', error);
    }
}

// Función para actualizar el pronóstico cuando se busca una ciudad
function actualizarPronosticoHorario() {
    const ciudadInput = document.getElementById('ciudadInput');
    if (ciudadInput && ciudadInput.value) {
        obtenerPronosticoHorario(ciudadInput.value);
    }
}

// Agregar evento al botón de búsqueda
document.getElementById('buscarButton').addEventListener('click', actualizarPronosticoHorario);

// Cargar pronóstico inicial (puedes establecer una ciudad por defecto)
document.addEventListener('DOMContentLoaded', () => {
    obtenerPronosticoHorario('Mexico'); // O la ciudad que prefieras como default
});