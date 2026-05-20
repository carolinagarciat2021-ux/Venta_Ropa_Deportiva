# ==============================================================================
# SISTEMA: Sport-App Enterprise Control Center
# ENTRADA PRINCIPAL: Inicializador lógico del sistema Standalone
# ==============================================================================

import datetime
from cliente_dao import ClienteDAO
from producto_dao import ProductoDAO
from pedido_dao import PedidoDAO

def desplegar_menu():
    while True:
        print("\n" + "="*50)
        print("         SPORT-APP - SISTEMA DE CONTROL CORE")
        print("="*50)
        print("1. [TABLA: CLIENTES] Visualizar Distribuidores")
        print("2. [TABLA: CLIENTES] Registrar Nuevo Distribuidor")
        print("3. [TABLA: PRODUCTO] Consultar Stock en Bodega")
        print("4. [TABLA: PRODUCTO] Ingresar Nueva Mercancía")
        print("5. [TRANSACCIÓN]     Crear Orden de Pedido + Detalle")
        print("6. Salir de la Aplicación")
        print("="*50)
        
        opcion = input("Seleccione una operación del ciclo de desarrollo: ")

        if opcion == "1":
            print("\n--- LISTADO GENERAL DE CLIENTES ---")
            for c in ClienteDAO.seleccionar_todos():
                print(f"ID: {c['id_clientes']} | CC: {c['identificacion']} | {c['nombre']} {c['apellido']} | Tel: {c['telefono']}")
                
        elif opcion == "2":
            print("\n--- ALTA DE CLIENTES MAYORISTAS ---")
            nom = input("Nombre: ")
            ape = input("Apellido: ")
            ide = input("Documento de Identificación (Único): ")
            tel = input("Teléfono: ")
            dir_c = input("Dirección de despacho: ")
            cor = input("Correo electrónico: ")
            ClienteDAO.insertar_cliente(nom, ape, ide, tel, dir_c, cor)
            
        elif opcion == "3":
            print("\n--- STOCK EN BODEGA DE ROPA DEPORTIVA ---")
            for p in ProductoDAO.consultar_inventario():
                print(f"ID: {p['id_producto']} | {p['descripcion']} | Talla: {p['talla']} | Color: {p['color']} | COP: ${p['precio_mayorista']} | Stock: {p['stock']} U")
                
        elif opcion == "4":
            print("\n--- INGRESO DE TEXTILES ---")
            desc = input("Descripción de la prenda (ej: Leggins Licra Fit): ")
            talla = input("Talla (S/M/L/XL): ")
            color = input("Color: ")
            precio = float(input("Precio Mayorista unitario (COP): "))
            cant = int(input("Cantidad de unidades iniciales: "))
            ProductoDAO.agregar_producto(desc, talla, color, precio, cant)
            
        elif opcion == "5":
            print("\n--- GENERAR PEDIDO Y ENLAZAR DETALLE ---")
            id_cli = int(input("Ingrese el ID del Cliente: "))
            id_pro = int(input("Ingrese el ID del Producto a despachar: "))
            cantidad = int(input("Cantidad de prendas a solicitar: "))
            fecha_actual = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            PedidoDAO.registrar_pedido_completo(fecha_actual, "Confirmado", id_cli, id_pro, cantidad)
            
        elif opcion == "6":
            print("\n[+] Finalizando servicios de Sport-App. Conexiones liberadas.")
            break
        else:
            print("[-] Opción inválida del sistema.")

if __name__ == "__main__":
    desplegar_menu()
