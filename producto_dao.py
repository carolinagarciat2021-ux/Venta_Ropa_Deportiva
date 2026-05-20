# ==============================================================================
# MÓDULO: DAO Producto (Data Access Object)
# DESCRIPCIÓN: Gestión transaccional del inventario mayorista de ropa deportiva
# ==============================================================================

from conexion import obtener_conexion

class ProductoDAO:

    @staticmethod
    def consultar_inventario():
        """Recupera los productos disponibles con especificaciones de talla, color y stock."""
        conexion = obtener_conexion()
        inventario = []
        if conexion:
            try:
                cursor = conexion.cursor(dictionary=True)
                cursor.execute("SELECT id_producto, descripcion, talla, color, precio_mayorista, stock FROM producto")
                inventario = cursor.fetchall()
            except Exception as e:
                print(f"[-] Error al consultar la tabla producto: {e}")
            finally:
                cursor.close()
                conexion.close()
        return inventario

    @staticmethod
    def agregar_producto(descripcion, talla, color, precio_mayorista, stock):
        """Registra una nueva referencia de stock dentro de la base de datos."""
        conexion = obtener_conexion()
        if conexion:
            try:
                cursor = conexion.cursor()
                query = """INSERT INTO producto (descripcion, talla, color, precio_mayorista, stock) 
                           VALUES (%s, %s, %s, %s, %s)"""
                valores = (descripcion, talla, color, precio_mayorista, stock)
                cursor.execute(query, valores)
                conexion.commit()
                print("[+] Referencia de prenda agregada correctamente.")
            except Exception as e:
                print(f"[-] Fallo en persistencia de producto: {e}")
            finally:
                cursor.close()
                conexion.close()
