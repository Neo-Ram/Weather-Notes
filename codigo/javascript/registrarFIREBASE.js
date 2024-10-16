import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';

//Configuracion Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBM3i56HQLo8_xuzhjPn186dMSZ43ESrOQ",
    authDomain: "weathernotes-8e4e9.firebaseapp.com",
    projectId: "weathernotes-8e4e9",
    storageBucket: "weathernotes-8e4e9.appspot.com",
    messagingSenderId: "445214911697",
    appId: "1:445214911697:web:55b9385af23d3eaee729f0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

    // if (response.ok) {
    //     alert("Usuario registrado exitosamente");
    //     // Redirigir al usuario o realizar otra acción
    // } else {
    //     alert("Error: " + result.detail); // Mostrar error si no fue exitoso
    // }
    if (response.ok) {
        alert("Usuario registrado exitosamente");

        try {
            // Iniciar sesión automáticamente en Firebase Auth (para poder enviar el correo de verificación)
            const userCredential = await signInWithEmailAndPassword(auth, correo, contraseña);
            const user = userCredential.user;
    
            // Enviar correo de verificación
            await sendEmailVerification(user);
            alert("Correo de verificación enviado. Por favor revisa tu bandeja de entrada.");
        } catch (error) {
            alert("Error: " + error.message);
        }

    } else {
        alert("Error: " + result.detail);
    }

});
