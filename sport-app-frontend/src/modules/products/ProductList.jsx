import React from 'react';

/**
 * Componente: ProductList
 * Renderiza la tabla de datos con el inventario actual disponible para venta al por mayor.
 */
const ProductList = ({ products }) => {
  return (
    <div className="table-container">
      <h3>Inventario General de Prendas</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Talla</th>
            <th>Color</th>
            <th>Precio Mayorista</th>
            <th>Stock Disponible</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            // Pasamos el precio de forma segura a una variable, corrigiendo la "g" de más
            const precioValido = product.precio_mayorista;

            return (
              <tr key={product.id_producto}>
                <td>{product.id_producto}</td>
                <td>{product.descripcion}</td>
                <td><span className="badge-talla">{product.talla}</span></td>
                <td>{product.color}</td>
                <td>
                  {/* Escudo de seguridad contra nulos o indefinidos con formato pesos colombianos */}
                  {precioValido !== undefined && precioValido !== null
                    ? `$${Number(precioValido).toLocaleString('es-CO')}`
                    : '$0'}
                </td>
                <td className={product.stock < 25 ? 'text-danger font-bold' : ''}>
                  {product.stock} u.
                </td>
                <td>
                  <span className={`status-badge ${product.stock < 25 ? 'status-low' : 'status-ok'}`}>
                    {product.stock < 25 ? 'Stock Crítico' : 'Óptimo'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;