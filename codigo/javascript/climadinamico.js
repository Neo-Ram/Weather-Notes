const configuracionesClima = {
    'Dia/Soleado': {
        icono: 'sol',
        fondo: 'linear-gradient(to bottom, #2AA5FF, #76c6ff)'
    },
    'Dia/Nublado': {
        icono: 'nube',
        fondo: 'linear-gradient(to bottom, #565656, #ffffff)'
    },
    'Noche/Nublado': {
        icono: 'nube',
        fondo: 'linear-gradient(to bottom, #002574, #6d6d6d)'
    },
    'Dia/Lluvia': {
        icono: 'lluvia',
        fondo: 'linear-gradient(to bottom, #000000, #424242)'
    },
    'Noche/Lluvia': {
        icono: 'lluvia',
        fondo: 'linear-gradient(to bottom, #000000, #424242)'
    },
    'Dia/Nieve': {
        icono: 'nieve',
        fondo: 'linear-gradient(to bottom, #82b8ca, #afe9fc)'
    },
    'Noche/Nieve': {
        icono: 'nieve',
        fondo: 'linear-gradient(to bottom, #82b8ca, #afe9fc)'
    },
    'Noche/Despejado': {
        icono: 'noche',
        fondo: 'linear-gradient(to bottom, #000000, #005ab5)'
    },
    'Dia/Tormenta': {
        icono: 'tormenta',
        fondo: 'linear-gradient(to bottom, #252759, #000000)'
    },
    'Noche/Tormenta': {
        icono: 'tormenta',
        fondo: 'linear-gradient(to bottom, #000000, #252759)'
    }
};

function actualizarIconoClima() {
    const descripcion = document.getElementById('descripcion').textContent;
    const iconos = document.querySelectorAll('.iconoclima img');
    const body = document.body;

    // Ocultar todos los iconos primero
    iconos.forEach(icono => icono.style.display = 'none');

    // Buscar la configuración correspondiente
    const config = configuracionesClima[descripcion];
    if (config) {
        // Mostrar el icono correspondiente
        document.querySelector(`.iconoclima img[alt="${config.icono}"]`).style.display = 'block';
        // Aplicar el fondo correspondiente con las propiedades adicionales
        body.style.background = config.fondo;
        body.style.height = '100vh';
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundRepeat = 'no-repeat';
    }

    // Para debugging
    console.log('Descripción actual:', descripcion);
}

// Observar cambios en el elemento descripción
const observador = new MutationObserver(() => {
    actualizarIconoClima();
});

// Configurar el observador
const descripcionElemento = document.getElementById('descripcion');
if (descripcionElemento) {
    observador.observe(descripcionElemento, { 
        childList: true,
        characterData: true,
        subtree: true 
    });
}

// Ejecutar una vez al cargar la página
document.addEventListener('DOMContentLoaded', actualizarIconoClima);
