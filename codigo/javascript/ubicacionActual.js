// Función para obtener el nombre de la ciudad por coordenadas
async function obtenerCiudadPorCoordenadas(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=41b4a934fb8c0f06f57497c2ccada01f`);
        const data = await response.json();
        if (data && data[0]) {
            // Una vez que tenemos la ciudad, usamos la función de búsqueda existente
            document.getElementById('ciudadInput').value = data[0].name;
            document.getElementById('buscarButton').click();
        }
    } catch (error) {
        console.error('Error al obtener ciudad:', error);
    }
}

// Función para obtener la ubicación actual
function obtenerUbicacionActual() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            obtenerCiudadPorCoordenadas(lat, lon);
        }, function(error) {
            console.error("Error al obtener ubicación:", error);
            // Si falla, usar una ubicación por defecto
            document.getElementById('ciudadInput').value = "Ciudad de México";
            document.getElementById('buscarButton').click();
        });
    }
}

// Ejecutar cuando se carga la página
document.addEventListener('DOMContentLoaded', obtenerUbicacionActual);