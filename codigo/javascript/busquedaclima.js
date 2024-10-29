// Asegurarte de que el DOM esté completamente cargado antes de añadir el evento
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('buscarButton').addEventListener('click', obtenerClima);
});
const traducciones = {
    "clear sky": "cielo despejado",
    "few clouds": "pocas nubes",
    "scattered clouds": "nubes dispersas",
    "broken clouds": "nubes rotas",
    "shower rain": "lluvia ligera",
    "rain": "lluvia",
    "thunderstorm": "tormenta eléctrica",
    "snow": "nieve",
    "mist": "neblina",
    "moderate rain": "lluvia moderada",
    // Agrega más traducciones según sea necesario
};
async function obtenerClima() {
    const ciudad = document.getElementById('ciudadInput').value; // Obtener la ciudad del input
    try {
        const response = await fetch(`http://localhost:8000/clima/${ciudad}`);

        if (!response.ok) {
            throw new Error('Error en la consulta: ' + response.statusText);
        }

        const data = await response.json();

        // Mostrar la información en el frontend
        document.getElementById('ciudadNombre').textContent = data.ciudad;
        document.getElementById('temperatura').textContent = `${data.temperatura.toFixed(2)}°C`; // Redondear a 2 decimales
         // Traducir la descripción
         const descripcionTraducida = traducciones[data.descripcion] || data.descripcion;
         document.getElementById('descripcion').textContent = descripcionTraducida;
        //document.getElementById('descripcion').textContent = data.descripcion;
        document.getElementById('tempMinimaMaxima').textContent = `Min: ${data.temp_minima.toFixed(2)}°C, Max: ${data.temp_maxima.toFixed(2)}°C`;
        //document.getElementById('sensacionTermica').textContent = `${data.sensacion_termica.toFixed(2)}°C`;
        document.getElementById('humedadValue').textContent = data.humedad;
        document.getElementById('velocidadVientoValue').textContent = data.velocidad_viento;

    } catch (error) {
        console.error('Error al obtener el clima:', error);
        document.getElementById('resultado').innerHTML = 'Error al obtener el clima.';
    }
}