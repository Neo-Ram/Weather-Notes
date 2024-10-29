from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app, auth
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import httpx

# Crear instancia de FastAPI
app = FastAPI()

#API KEY
API_KEY = '41b4a934fb8c0f06f57497c2ccada01f'

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

#================================================================================================
#Modelo de solicitud de registro
class RegisterRequest(BaseModel):
    username: str
    correo: str 
    contraseña: str

# Modelo de solicitud de login
class LoginRequest(BaseModel):
    correo: str
    contraseña: str

#================================================================================================
#Endpoint de Iniciar sesion
@app.post("/login")
async def login(request: LoginRequest):
    try:
        # Consultar el usuario por correo
        users_ref = db.collection('usuarios')
        query = users_ref.where('correo', '==', request.correo).stream()

        user_found = None
        for user in query:
            user_data = user.to_dict()
            
            # Comparar la contraseña directamente
            if user_data['contraseña'] == request.contraseña:  # Cambié 'password' por 'contraseña'
                user_found = user_data
                break

        if user_found:
            return {"message": "Inicio de sesión exitoso"}
        else:
            raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    except Exception as e:
        # Manejar excepciones y devolver el error
        print(f"Error en el login: {str(e)}")  # Agrega esto para registrar el error
        raise HTTPException(status_code=500, detail="Error interno del servidor")

#================================================================================================
#Endpoint de Registrar
@app.post("/registrar")
async def registrar(request: RegisterRequest):
    #Verificar si ya existe un usuario con el correo proporcionado
    users_ref = db.collection('usuarios')
    query = users_ref.where('correo', '==', request.correo).stream()

    for user in query:
        #Si se encuentra mandar una HttpException
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail="El correo ya se encuentra en uso")
    
    try:
        # Crear usuario en Firebase Authentication
        user = auth.create_user(
            email=request.correo,
            password=request.contraseña,
            display_name=request.username
        )
        
        # Guardar el usuario en Firestore con su UID como ID del documento
        new_user_data = {
            'username': request.username,
            'correo': request.correo,
            'contraseña':request.contraseña,
            'uid': user.uid  # Guardamos el UID de Firebase Authentication
        }
        db.collection('usuarios').document(user.uid).set(new_user_data)

        return {"message": "Usuario registrado exitosamente"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
#================================================================================================
@app.get("/clima/{ciudad}")
async def obtener_clima(ciudad: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.openweathermap.org/data/2.5/weather?q={ciudad}&appid={API_KEY}&units=metric"
            )

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())

            data = response.json()

            # Extraer la información deseada, incluyendo el nombre de la ciudad
            clima_info = {
                "ciudad": data['name'],  # Añadir el nombre de la ciudad
                "temperatura": data['main']['temp'],
                "descripcion": data['weather'][0]['description'],
                "temp_maxima": data['main']['temp_max'],
                "temp_minima": data['main']['temp_min'],
                "sensacion_termica": data['main']['feels_like'],
                "humedad": data['main']['humidity'],
                "velocidad_viento": data['wind']['speed']
            }
            return clima_info

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))