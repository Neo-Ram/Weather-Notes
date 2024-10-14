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
            alert("Inicio de sesión exitoso");
            //alert("Inicio de sesión exitoso: " + data.message);
            // Aquí podrías redirigir a otra página si quieres, como:
            // window.location.href = "/dashboard";
        } else {
            console.log("Constraseña o usuario incorrectos");
            alert("Error: Credenciales incorrectas");
            
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un error al intentar iniciar sesión');
    }
});