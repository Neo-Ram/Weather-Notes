document.addEventListener('DOMContentLoaded', function() {
    // Configuración del Intersection Observer
    const options = {
        threshold: 0.2, // 20% del elemento debe ser visible
        rootMargin: '0px'
    };

    // Función que se ejecuta cuando un elemento es observado
    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // El elemento está entrando en la vista
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            } else {
                // El elemento está saliendo de la vista
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'scale(0.95)';
            }
        });
    };

    // Crear el observer
    const observer = new IntersectionObserver(callback, options);

    // Observar todas las secciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        // Establecer estado inicial
        section.style.transition = 'all 0.5s ease-in-out';
        section.style.opacity = '0';
        section.style.transform = 'scale(0.95)';
        
        // Comenzar a observar
        observer.observe(section);
    });
});
