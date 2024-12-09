from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app, auth
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
import httpx
from datetime import datetime
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
            return {"message": "Inicio de sesión exitoso","correo": request.correo}
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
            # Obtener datos básicos del clima
            response = await client.get(
                f"https://api.openweathermap.org/data/2.5/weather?q={ciudad}&appid={API_KEY}&units=metric"
            )

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())

            data = response.json()
            
            # Obtener coordenadas
            lat = data['coord']['lat']
            lon = data['coord']['lon']

            
            # Llamar a la One Call API para obtener el índice UV
            uv_response = await client.get(
                f"https://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API_KEY}"
            )
            
            if uv_response.status_code != 200:
                raise HTTPException(status_code=uv_response.status_code, detail=uv_response.json())
            
            uv_data = uv_response.json()

            # Acceder al índice UV desde 'value' en lugar de 'current'
            indice_uv = uv_data['value']
            # Calcular el punto de rocío
            temperatura = data['main']['temp']
            humedad = data['main']['humidity']
            punto_rocio = round(temperatura - (100 - humedad) / 5)

            # Extraer la información deseada
            clima_info = {
                "ciudad": data['name'],
                "temperatura": round(data['main']['temp']),
                "descripcion": data['weather'][0]['description'],
                "temp_maxima": round(data['main']['temp_max']),
                "temp_minima": round(data['main']['temp_min']),
                "humedad": data['main']['humidity'],
                "velocidad_viento": data['wind']['speed'],
                "presion": data['main']['pressure'],
                "visibilidad": data.get('visibility', 0),
                "punto_rocio": punto_rocio,
                "indice_uv": indice_uv
            }
            return clima_info

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
#================================================================================================
@app.get("/pronostico/{ciudad}")
async def obtener_pronostico(ciudad: str):
    try:
        async with httpx.AsyncClient() as client:
            # Primero obtener las coordenadas de la ciudad
            response = await client.get(
                f"https://api.openweathermap.org/data/2.5/weather?q={ciudad}&appid={API_KEY}&units=metric"
            )

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())

            data = response.json()
            lat = data['coord']['lat']
            lon = data['coord']['lon']

            # Obtener pronóstico de 5 días
            forecast_response = await client.get(
                f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric&lang=es"
            )

            if forecast_response.status_code != 200:
                raise HTTPException(status_code=forecast_response.status_code, detail=forecast_response.json())

            forecast_data = forecast_response.json()

            # Procesar los datos para obtener un pronóstico por día
            daily_forecasts = {}
            
            for item in forecast_data['list']:
                # Convertir timestamp a fecha
                fecha = datetime.fromtimestamp(item['dt'])
                fecha_str = fecha.strftime('%Y-%m-%d')

                if fecha_str not in daily_forecasts:
                    daily_forecasts[fecha_str] = {
                        'fecha': fecha.strftime('%A, %d %B'),  # Formato: Lunes, 01 Enero
                        'temp_min': item['main']['temp_min'],
                        'temp_max': item['main']['temp_max'],
                        'humedad': item['main']['humidity'],
                        'descripcion': item['weather'][0]['description'],
                        'icono': item['weather'][0]['icon']
                    }
                else:
                    # Actualizar temperaturas máximas y mínimas
                    daily_forecasts[fecha_str]['temp_min'] = min(
                        daily_forecasts[fecha_str]['temp_min'], 
                        item['main']['temp_min']
                    )
                    daily_forecasts[fecha_str]['temp_max'] = max(
                        daily_forecasts[fecha_str]['temp_max'], 
                        item['main']['temp_max']
                    )

            # Convertir el diccionario a una lista
            pronostico = list(daily_forecasts.values())

            return {
                "ciudad": ciudad,
                "pronostico": pronostico
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
#================================================================================================
@app.get("/pronostico_horario/{ciudad}")
async def obtener_pronostico_horario(ciudad: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.openweathermap.org/data/2.5/forecast?q={ciudad}&appid={API_KEY}&units=metric&lang=es"
            )

            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.json())

            return response.json()

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
#================================================================================================
#Obtener el usuario
@app.get("/usuario-actual/{correo}")
async def obtener_usuario_actual(correo: str):
    try:
        users_ref = db.collection('usuarios')
        query = users_ref.where('correo', '==', correo).stream()
        
        for user in query:
            return {"username": user.to_dict()['username']}
            
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

