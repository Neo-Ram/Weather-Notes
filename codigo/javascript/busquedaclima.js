// Asegurarte de que el DOM esté completamente cargado antes de añadir el evento
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('buscarButton').addEventListener('click', obtenerClima);
});
const traducciones = {
    "clear sky": "Cielo despejado",//YA
    "few clouds": "Pocas nubes", //YA
    "scattered clouds": "Nubes dispersas", //YA
    "broken clouds": "Nubes rotas", //YA
    "shower rain": "Lluvia ligera", //YA
    "rain": "Lluvia", //YA
    "thunderstorm": "Tormenta eléctrica", //YA
    "snow": "Nieve", //YA
    "mist": "Neblina", //YA
    "moderate rain": "Lluvia moderada", //YA
    "overcast clouds": "Nubes cubiertas", //YA
    "heavy rain": "Lluvia intensa", //YA
    "heavy snow": "Nieve intensa", //YA
    "heavy intensity rain": "Lluvia intensa",
    "light intensity shower rain": "Lluvia ligera",  //YA
    "very heavy rain": "Lluvia intensa",
    // Agrega más traducciones según sea necesario
};
const iconosPorDescripcion = {
    "Cielo despejado": "assets/Icons/Sol.png",
    "Pocas nubes": "assets/Icons/clouds.png",
    "Nubes dispersas": "assets/Icons/clouds.png",
    "Nubes rotas": "assets/Icons/clouds.png",
    "Lluvia ligera": "assets/Icons/rain.png",
    "Lluvia": "assets/Icons/rain.png",
    "Tormenta eléctrica": "assets/Icons/storm.png",
    "Nieve": "assets/Icons/snow.png",
    "Neblina": "assets/Icons/clouds.png",
    "Lluvia moderada": "assets/Icons/rain.png",
    "Nubes cubiertas": "assets/Icons/clouds.png",
    "Lluvia intensa": "assets/Icons/rain.png",
    "Nieve intensa": "assets/Icons/snow.png",
    "Lluvia intensa": "assets/Icons/rain.png"
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
            temperatura.textContent = `${data.temperatura.toFixed(0)}°C`; // Redondear a 2 decimales
            const descripcionTraducida = traducciones[data.descripcion] || data.descripcion;
            descripcion.textContent = descripcionTraducida;

            // Llamar a mostrarEfectoNieve aquí, después de procesar la descripción
            //mostrarEfectoNieve(descripcionTraducida, data.temperatura);
            // Obtener el icono correspondiente a la descripción
            const iconoClima = document.querySelector('.iconoclima img');
            if (iconoClima) {
                iconoClima.src = iconosPorDescripcion[descripcionTraducida] || 'assets/Icons/sun.png';
            }
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