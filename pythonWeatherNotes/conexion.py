import mysql.connector

#Obtener la conexion con la Base de datos, el Neo no contesta asi 
#que usare el My Sql
def obtener_conexion():
    conexion = mysql.connector.connect(
        user='root',
        password='admin123',
        host='localhost',
        database='CLIMA',
        port='3306')
    return conexion

#Registrarse
def registrar_usuario(username,correo,password):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    #Verificar si el usuario existe
    cursor.execute("SELECT * FROM usuarios WHERE username = %s",(username,))
    if cursor.fetchone():
        cursor.close()
        conexion.close()
        return False
    
    #Insertar nuevo usuario
    sql = "INSERT INTO usuarios (username, correo, password) VALUES (%s, %s, %s)"
    values = (username, correo, password)

    cursor.execute(sql,values)
    conexion.commit()

    cursor.close()
    conexion.close()
    return True


if __name__ == "__main__":
    #Verificar si la conexion es exitosa
    conexion = obtener_conexion()
    if conexion.is_connected():
        print("Conexion exitosa")
    conexion.close()

    #Prueba de insercion de usuario
    insercion = registrar_usuario("Ejemplin","ejemplo123@gmail.com","1234")
    if insercion:
        print("Usuario registrado exitosamente")
    else:
        print("El usuario ya esiste u ocurrio un error")