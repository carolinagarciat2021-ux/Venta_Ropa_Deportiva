# ==============================================================================
# MÓDULO: DAO Clientes (Data Access Object)
# ESTÁNDAR: PEP 8 - Gestión de persistencia de la tabla `clientes`
# ==============================================================================

from conexion import obtener_conexion

class ClienteDAO:

    @staticmethod
    def seleccionar_todos():
        """Ejecuta una consulta estructurada para recuperar el listado completo de clientes."""
        conexion = obtener_conexion()
        lista_clientes = []
        if conexion:
            try:
                cursor = conexion.cursor(dictionary=True)
                cursor.execute("SELECT id_clientes, nombre, apellido, identificacion, telefono, correo FROM clientes")
                lista_clientes = cursor.fetchall()
            except Exception as e:
                print(f"[-] Error al leer la tabla clientes: {e}")
            finally:
                cursor.close()
                conexion.close()
        return lista_clientes

    @staticmethod
    def insertar_cliente(nombre, apellido, identificacion, telefono, direccion, correo):
        """Persiste un nuevo registro de distribuidor mayorista en la capa de datos."""
        conexion = obtener_conexion()
        if conexion:
            try:
                cursor = conexion.cursor()
                query = """INSERT INTO clientes (nombre, apellido, identificacion, telefono, direccion, correo) 
                           VALUES (%s, %s, %s, %s, %s, %s)"""
                valores = (nombre, apellido, identificacion, telefono, direccion, correo)
                cursor.execute(query, valores)
                conexion.commit() # Confirmación de la transacción
                print("[+] Cliente registrado exitosamente en el sistema.")
            except Exception as e:
                print(f"[-] Error en inserción de datos: {e}")
            finally:
                cursor.close()
                conexion.close()
