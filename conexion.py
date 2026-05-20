# ==============================================================================
# PROYECTO: Sport-App
# APRENDIZ: Amelia Carolina García Taborda
# FICHA: 3118546
# DESCRIPCIÓN: Administrador de conexión nativa para MySQL (Mapeo Relacional)
# ==============================================================================

import mysql.connector
from mysql.connector import Error

def obtener_conexion():
    """
    Establece y retorna un objeto de conexion activo con el motor de base de datos.
    Reemplaza la sobrecarga de configuraciones (overhead) del persistency-unit de Hibernate.
    """
    try:
        conexion = mysql.connector.connect(
            host='localhost',
            user='root',
            password='1234',  
            database='venta_ropa_deportiva' 
        )
        if conexion.is_connected():
            return conexion
    except Error as e:
        print(f"[-] Error crítico en la infraestructura de conexión: {e}")
        return None
