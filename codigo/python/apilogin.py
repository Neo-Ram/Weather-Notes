from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

# Crear instancia de FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes (puedes restringir esto a dominios específicos)
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los headers
)

# Inicializar Firebase
cred = credentials.Certificate('C:/Users/Omarius/Downloads/weathernotes-8e4e9-firebase-adminsdk-9x4cf-634d9208d1.json')
initialize_app(cred)
db = firestore.client()

# Modelo de solicitud de login
class LoginRequest(BaseModel):
    correo: str
    contraseña: str

@app.post("/login")
async def login(request: LoginRequest):
    # Consultar el usuario por correo
    users_ref = db.collection('usuarios')
    query = users_ref.where('correo', '==', request.correo).stream()

    user_found = None
    for user in query:
        user_data = user.to_dict()
        
        # Comparar la contraseña directamente
        if user_data['password'] == request.contraseña:
            user_found = user_data
            break

    if user_found:
        
        return {"message": "Inicio de sesion exitoso2"}
    else:
       
       raise HTTPException(status_code=401, detail="Credenciales incorrectas")