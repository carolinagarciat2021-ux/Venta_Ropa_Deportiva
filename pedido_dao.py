# ==============================================================================
# MÓDULO: DAO Pedidos Complejos (Transacciones Maestro-Detalle)
# DESCRIPCIÓN: Relación directa entre las tablas `pedido` y `detalle_pedido`
# ==============================================================================

from conexion import obtener_conexion

class PedidoDAO:

    @staticmethod
    def registrar_pedido_completo(fecha, estado, id_cliente, id_producto, cantidad):
        """
        Ejecuta una transacción ACID segura: registra la cabecera del pedido, 
        extrae el ID generado y crea el renglón de detalle correspondiente.
        """
        conexion = obtener_conexion()
        if conexion:
            try:
                cursor = conexion.cursor()
                
                # 1. Insertar el encabezado en la tabla `pedido`
                query_pedido = "INSERT INTO pedido (fecha, estado, id_cliente) VALUES (%s, %s, %s)"
                cursor.execute(query_pedido, (fecha, estado, id_cliente))
                id_pedido_generado = cursor.lastrowid # Recuperación nativa de la PK autoincremental
                
                # 2. Insertar el renglón del artículo en `detalle_pedido`
                query_detalle = "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad) VALUES (%s, %s, %s)"
                cursor.execute(query_detalle, (id_pedido_generado, id_producto, cantidad))
                
                # 3. Descontar las unidades del stock del producto (Regla de negocio lógica)
                query_stock = "UPDATE producto SET stock = stock - %s WHERE id_producto = %s"
                cursor.execute(query_stock, (cantidad, id_producto))
                
                conexion.commit() # Confirmación de bloque completo
                print(f"[+] Orden de despacho registrada bajo el código de Pedido #{id_pedido_generado}")
            except Exception as e:
                conexion.rollback() # Revierte cambios ante errores para mitigar corrupción de datos
                print(f"[-] Transacción cancelada (Rollback ejecutado): {e}")
            finally:
                cursor.close()
                conexion.close()
