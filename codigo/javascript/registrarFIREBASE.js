document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevenir que el formulario recargue la página
    
    // Obtener los valores de los campos
    const username = document.getElementById('nombreusuario').value;
    const correo = document.getElementById('correor').value;
    const contraseña = document.getElementById('contraseñar').value;
    const confirmContraseña = document.getElementById('confircontraseña').value;

    // Verificar si las contraseñas coinciden
    if (contraseña !== confirmContraseña) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // Hacer la solicitud al backend
    const response = await fetch('http://localhost:8000/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,  // Asegúrate de enviar el nombre de usuario
            correo: correo,
            contraseña: contraseña   // El campo correcto para la contraseña
        })
    });

    // Manejar la respuesta
    const result = await response.json();

    if (response.ok) {
        alert("Usuario registrado exitosamente");
        // Redirigir al usuario o realizar otra acción
    } else {
        alert("Error: " + result.detail); // Mostrar error si no fue exitoso
    }
});
