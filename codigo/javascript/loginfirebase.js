function mostrarAlerta(mensaje) {
    const alertContainer = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = mensaje;
    
    alertContainer.style.display = 'block';
    
    // Ocultar el alert después de 3 segundos
    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 3000);
}

function mostrarAlertaerror(mensaje) {
    const alertContainer = document.getElementById('customAlert2');
    const alertMessage = document.getElementById('errorMessage');
    alertMessage.textContent = mensaje;
    
    alertContainer.style.display = 'block';
    
    // Ocultar el alert después de 3 segundos
    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 3000);
}

function mostrarAlertawarning(mensaje) {
    const alertContainer = document.getElementById('customAlert3');
    const alertMessage = document.getElementById('warningMessage');
    alertMessage.textContent = mensaje;
    
    alertContainer.style.display = 'block';
    
    // Ocultar el alert después de 3 segundos
    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 3000);
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    const correo = document.getElementById('correoi').value;
    const contraseña = document.getElementById('contraseñai').value;

    try {
        // Enviar los datos al backend usando fetch
        const response = await fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                correo: correo,
                contraseña: contraseña
            })
        });

        // Manejar la respuesta del backend
        if (response.ok) {
            const data = await response.json();
            console.log("Inicio correctamente");
            mostrarAlerta("Inicio de sesión exitoso");
            // Redirigir al usuario a otra página HTML
            setTimeout(() => {
                window.location.href = "clima.html";
            }, 1000);
            //alert("Inicio de sesión exitoso: " + data.message);
            // Aquí podrías redirigir a otra página si quieres, como:
            // window.location.href = "/dashboard";
        } else {
            console.log("Constraseña o usuario incorrectos");
            mostrarAlertaerror("Error: Credenciales incorrectas");
            
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        mostrarAlertawarning('Hubo un error al intentar iniciar sesión');
    }
});