import firebase_admin
from firebase_admin import credentials, firestore

# Ruta al archivo de clave privada descargada
cred = credentials.Certificate('C:/Users/Omarius/Downloads/weathernotes-8e4e9-firebase-adminsdk-9x4cf-634d9208d1.json')

# Inicializar la aplicación de Firebase
firebase_admin.initialize_app(cred)

# Conectar a Firestore
db = firestore.client()

def list_users():
    # Ref a la colección de usuarios
    users_ref = db.collection('usuarios')

    # Obtener todos los documentos en la colección
    users = users_ref.stream()

    # Recorrer los documentos y mostrar sus datos
    for user in users:
        print(f"ID: {user.id}")
        print(f"Datos: {user.to_dict()}")  # Muestra los campos de cada documento
        print("-------------")

def find_user_by_email(email):
    users_ref = db.collection('usuarios')
    query = users_ref.where('correo', '==', email).stream()
    
    for user in query:
        print(f"ID: {user.id}")
        print(f"Datos: {user.to_dict()}")



# Llamar a la función para listar todos los usuarios
#list_users()
# Ejemplo de uso
find_user_by_email("cota123@gmail.com")