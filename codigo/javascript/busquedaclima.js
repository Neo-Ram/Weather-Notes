// Asegurarte de que el DOM esté completamente cargado antes de añadir el evento
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('buscarButton').addEventListener('click', obtenerClima);
});
const traducciones = {
    "clear sky": "Cielo despejado",
    "few clouds": "Pocas nubes",
    "scattered clouds": "Nubes dispersas",
    "broken clouds": "Nubes rotas",
    "shower rain": "Lluvia ligera",
    "rain": "Lluvia",
    "thunderstorm": "Tormenta eléctrica",
    "snow": "Nieve",
    "mist": "Neblina",
    "moderate rain": "Lluvia moderada",
    "overcast clouds": "Nubes cubiertas",
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

        // Verifica que los elementos existan antes de modificarlos
        const ciudadNombre = document.getElementById('ciudadNombre');
        const temperatura = document.getElementById('temperatura');
        const descripcion = document.getElementById('descripcion');
        const tempMinimaMaxima = document.getElementById('tempMinimaMaxima');
        const humedadValue = document.getElementById('humedadValue');
        const velocidadViento = document.getElementById('velocidadViento');
        const puntoRocio = document.getElementById('puntoRocio');
        const presionAtmosferica = document.getElementById('presionAtmosferica');
        const indiceUV = document.getElementById('indiceUV');
        const visibilidad = document.getElementById('visibilidad');

        if (ciudadNombre && temperatura && descripcion && tempMinimaMaxima && humedadValue) {
            ciudadNombre.textContent = data.ciudad;
            temperatura.textContent = `${data.temperatura.toFixed(2)}°C`; // Redondear a 2 decimales
            const descripcionTraducida = traducciones[data.descripcion] || data.descripcion;
            descripcion.textContent = descripcionTraducida;
            tempMinimaMaxima.textContent = `Min: ${data.temp_minima.toFixed(2)}°C, Max: ${data.temp_maxima.toFixed(2)}°C`;
            humedadValue.textContent = `${data.humedad}%`;

            // Nuevos parámetros del clima
            if (velocidadViento) velocidadViento.textContent = `${data.velocidad_viento} km/h`;
            if (puntoRocio) puntoRocio.textContent = `${data.punto_rocio}°C`;
            if (presionAtmosferica) presionAtmosferica.textContent = `${data.presion} hPa`;
            if (indiceUV) indiceUV.textContent = data.indice_uv;
            if (visibilidad) visibilidad.textContent = `${(data.visibilidad / 1000).toFixed(1)} km`;
        } else {
            console.error('Uno o más elementos no se encontraron en el DOM.');
        }

    } catch (error) {
        console.error('Error al obtener el clima:', error);
        document.getElementById('resultado').innerHTML = 'Error al obtener el clima.';
    }
}