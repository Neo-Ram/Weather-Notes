const configuracionesClima = {
    //Dia/Soleado
    'Cielo despejado': {
        icono: esHoraNocturna() ? 'noche' : 'sol',
        fondo: esHoraNocturna()
        ? 'linear-gradient(to bottom, #000000, #005ab5)'  // noche
        : 'linear-gradient(to bottom, #2AA5FF, #76c6ff)'  // dia
    },
    //Nublado
    //Dia/Nublado
    'Pocas nubes': {
        icono: 'nube',
        fondo: esHoraNocturna()
            ? 'linear-gradient(to bottom, #002574, #6d6d6d)'  // noche
            : 'linear-gradient(to bottom, #565656, #ffffff)'  // día
    },
    'Nubes dispersas': {
        icono: 'nube',
        fondo: esHoraNocturna()
            ? 'linear-gradient(to bottom, #002574, #6d6d6d)'
            : 'linear-gradient(to bottom, #565656, #ffffff)'
    },
    'Nubes rotas': {
        icono: 'nube',
        fondo: esHoraNocturna()
            ? 'linear-gradient(to bottom, #002574, #6d6d6d)'
            : 'linear-gradient(to bottom, #565656, #ffffff)'
    },
    'Nubes cubiertas': {
        icono: 'nube',
        fondo: esHoraNocturna()
            ? 'linear-gradient(to bottom, #002574, #6d6d6d)'
            : 'linear-gradient(to bottom, #565656, #ffffff)'
    },
    'Neblina': {
        icono: 'nube',
        fondo: esHoraNocturna()
            ? 'linear-gradient(to bottom, #002574, #6d6d6d)'
            : 'linear-gradient(to bottom, #565656, #ffffff)'
    },
    //Lluvia
    'Lluvia ligera': {
        icono: 'lluvia',
        fondo: 'linear-gradient(to bottom, #000000, #424242)'
    },
    'Lluvia': {
        icono: 'lluvia',
        fondo: 'linear-gradient(to bottom, #000000, #424242)'
    },
    'Lluvia intensa': {
        icono: 'lluvia',
        fondo: 'linear-gradient(to bottom, #000000, #424242)'
    },
    'Lluvia moderada': {
        icono: 'lluvia',
        fondo: 'linear-gradient(to bottom, #000000, #424242)'
    },
    //Nieve
    'Nieve': {
        icono: 'nieve',
        fondo: 'linear-gradient(to bottom, #82b8ca, #afe9fc)'
    },
    'Nieve intensa': {
        icono: 'nieve',
        fondo: 'linear-gradient(to bottom, #82b8ca, #afe9fc)'
    },
    //Tormenta
    'Tormenta eléctrica': {
        icono: 'tormenta',
        fondo: 'linear-gradient(to bottom, #252759, #000000)'
    },
};
//Es la hora de nochear
function esHoraNocturna() {
    const hora = new Date().getHours();
    return hora >= 19 || hora < 6; // Es noche entre 7pm y 6am
}
//Funcion para obtener el usuario
async function mostrarNombreUsuario() {
    const correo = localStorage.getItem('correo');
    if (correo) {
        try {
            const response = await fetch(`http://localhost:8000/usuario-actual/${correo}`);
            if (response.ok) {
                const data = await response.json();
                // Actualizar el elemento que muestra el nombre de usuario
                const elementoUsuario = document.getElementById('nombreUsuario');
                if (elementoUsuario) {
                    elementoUsuario.textContent = data.username;
                }
            }
        } catch (error) {
            console.error('Error al obtener nombre de usuario:', error);
        }
    }
}

function crearNube(esNublado = false) {
    const nube = document.createElement('div');
    nube.className = 'nube-flotante';
    nube.style.left = '-150px';  // Empieza fuera de la pantalla
    
    // Si es nublado, variar más el tamaño y la opacidad
    if (esNublado) {
        const escala = Math.random() * 1.5 + 0.5; // Entre 0.5 y 2
        const opacidad = Math.random() * 0.4 + 0.2; // Entre 0.2 y 0.6
        nube.style.transform = `scale(${escala})`;
        nube.style.background = `rgba(255, 255, 255, ${opacidad})`;
        nube.style.top = Math.random() * 100 + 'vh';  // Usar todo el alto de la pantalla
    } else {
        nube.style.top = Math.random() * 60 + 'vh';  // Posición vertical más limitada
    }
    
    document.body.appendChild(nube);

    // Animar la nube
    const duracion = Math.random() * (esNublado ? 40000 : 20000) + 30000; // Más variación para nublado
    nube.animate([
        { left: '-150px' },
        { left: '100vw' }
    ], {
        duration: duracion,
        easing: 'linear'
    }).onfinish = () => {
        nube.remove();
    };
}

function crearGotaLluvia() {
    const gota = document.createElement('div');
    gota.className = 'gota-lluvia';
    gota.style.left = Math.random() * 100 + 'vw';
    gota.style.animationDuration = Math.random() * 0.5 + 0.5 + 's'; // Entre 0.5 y 1 segundo
    document.body.appendChild(gota);

    // Eliminar la gota después de la animación
    gota.addEventListener('animationend', () => gota.remove());
}

function iniciarLluvia() {
    // Crear gotas continuamente
    return setInterval(() => {
        for(let i = 0; i < 5; i++) { // Crear varias gotas en cada intervalo
            crearGotaLluvia();
        }
    }, 100); // Cada 100ms
}

function iniciarNubes(esNublado = false) {
    // Crear nubes iniciales
    const cantidadInicial = esNublado ? 8 : 3;
    for (let i = 0; i < cantidadInicial; i++) {
        setTimeout(() => crearNube(esNublado), i * (esNublado ? 2000 : 10000));
    }
    // Crear nuevas nubes periódicamente
    setInterval(() => crearNube(esNublado), esNublado ? 4000 : 15000);
}

function detenerNubes() {
    const nubes = document.querySelectorAll('.nube-flotante');
    nubes.forEach(nube => nube.remove());
    // Limpiar todos los intervalos existentes
    const highestId = window.setTimeout(() => {}, 0);
    for (let i = highestId; i >= 0; i--) {
        window.clearInterval(i);
    }
}

function detenerLluvia() {
    const gotas = document.querySelectorAll('.gota-lluvia');
    gotas.forEach(gota => gota.remove());
}

function crearRayo() {
    const rayo = document.createElement('div');
    rayo.className = 'rayo';
    rayo.style.left = Math.random() * 100 + 'vw';
    document.body.appendChild(rayo);

    // Eliminar el rayo después de la animación
    setTimeout(() => rayo.remove(), 150);
}

function iniciarTormenta() {
    // Iniciar la lluvia
    const lluviaInterval = iniciarLluvia();
    
    // Crear rayos periódicamente
    const rayoInterval = setInterval(() => {
        crearRayo();
        // Posibilidad de rayo doble
        if (Math.random() < 0.4) {
            setTimeout(() => crearRayo(), 100);
        }
    }, 5000); // Cambiado a 5000ms (5 segundos)

    return [lluviaInterval, rayoInterval];
}

function detenerTormenta() {
    detenerLluvia();
    const rayos = document.querySelectorAll('.rayo');
    rayos.forEach(rayo => rayo.remove());
}

function crearCopo() {
    const copo = document.createElement('div');
    copo.className = 'copo-nieve';
    copo.style.left = Math.random() * 100 + 'vw';
    copo.style.opacity = Math.random();
    copo.style.transform = `scale(${Math.random()})`;
    document.body.appendChild(copo);

    // Eliminar el copo después de la animación
    copo.addEventListener('animationend', () => copo.remove());
}

function iniciarNieve() {
    // Crear copos continuamente
    return setInterval(() => {
        for(let i = 0; i < 3; i++) { // Crear varios copos en cada intervalo
            crearCopo();
        }
    }, 100); // Cada 100ms
}

function detenerNieve() {
    const copos = document.querySelectorAll('.copo-nieve');
    copos.forEach(copo => copo.remove());
}

function crearEstrella() {
    const estrella = document.createElement('div');
    estrella.className = 'estrella';
    estrella.style.left = Math.random() * 100 + 'vw';
    estrella.style.top = Math.random() * 100 + 'vh';
    estrella.style.animationDelay = Math.random() * 2 + 's';
    estrella.style.animationDuration = (Math.random() * 2 + 1) + 's';
    document.body.appendChild(estrella);
    return estrella;
}

function iniciarEstrellas() {
    const estrellas = [];
    // Crear 100 estrellas
    for(let i = 0; i < 100; i++) {
        estrellas.push(crearEstrella());
    }
    return estrellas;
}

function detenerEstrellas() {
    const estrellas = document.querySelectorAll('.estrella');
    estrellas.forEach(estrella => estrella.remove());
}

function actualizarIconoClima() {
    const descripcion = document.getElementById('descripcion').textContent;
    const iconos = document.querySelectorAll('.iconoclima img');
    const body = document.body;

    // Ocultar todos los iconos primero
    iconos.forEach(icono => icono.style.display = 'none');

    // Detener efectos existentes
    detenerNubes();
    detenerLluvia();
    detenerTormenta();
    detenerNieve();
    detenerEstrellas();

    // Buscar la configuración correspondiente
    const config = configuracionesClima[descripcion];
    if (config) {
        // Mostrar el icono correspondiente
        document.querySelector(`.iconoclima img[alt="${config.icono}"]`).style.display = 'block';
        // Aplicar el fondo correspondiente
        body.style.background = config.fondo;
        body.style.height = '100vh';
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundRepeat = 'no-repeat';

        // Iniciar efectos según el clima
        if (descripcion === 'Cielo despejado') {
            iniciarNubes(false);
            if(esHoraNocturna()){
                iniciarEstrellas();
            }
        } else if (descripcion === 'Pocas nubes' || descripcion === 'Nubes dispersas' || descripcion === 'Nubes rotas' || descripcion === 'Neblina' || descripcion === 'Nubes cubiertas') {
            iniciarNubes(true);
        } else if (descripcion === 'Lluvia ligera' || descripcion === 'Lluvia' || descripcion === 'Lluvia intensa' || descripcion === 'Lluvia moderada') {
            iniciarLluvia();
        } else if (descripcion === 'Tormenta eléctrica') {
            iniciarTormenta();
        } else if (descripcion === 'Nieve' || descripcion === 'Nieve intensa') {
            iniciarNieve();
        } else if (descripcion === 'Noche/Despejado') {
            iniciarEstrellas();
        }
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
// Llamar a la función cuando se carga la página
//document.addEventListener('DOMContentLoaded', mostrarNombreUsuario);
document.addEventListener('DOMContentLoaded', function() {
    mostrarNombreUsuario();  // La función que ya teníamos

    // Agregar el evento de cerrar sesión
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            // Limpiar el localStorage
            localStorage.clear();
            // Redireccionar al login
            window.location.href = 'login.html';
        });
    }
});