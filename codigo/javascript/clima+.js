document.addEventListener('DOMContentLoaded', function() {
    const btnCalendario = document.getElementById('btnCalendario');
    const calendarioContainer = document.getElementById('calendarioContainer');
    
    const calendario = flatpickr(calendarioContainer, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        time_24hr: true,
        minDate: "today",
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            },
            months: {
                shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            }
        },
        onChange: function(selectedDates, dateStr) {
            console.log('Fecha seleccionada:', dateStr);
            // Cerrar el calendario después de seleccionar
            setTimeout(() => {
                cerrarCalendario();
            }, 500);
        }
    });

    // Función para cerrar el calendario
    function cerrarCalendario() {
        calendarioContainer.style.display = 'none';
        calendario.close();
    }

    // Mostrar/ocultar calendario al hacer clic en el botón
    btnCalendario.addEventListener('click', function() {
        if (calendarioContainer.style.display === 'none' || calendarioContainer.style.display === '') {
            calendarioContainer.style.display = 'block';
            calendario.open();
        } else {
            cerrarCalendario();
        }
    });
});
