import React from 'react';

/**
 * Componente: AdminDashboard
 * Muestra KPIs de inventario y un sistema reactivo de alertas críticas.
 */
const AdminDashboard = ({ products }) => {
  // Filtra los productos que tienen stock inferior a 25 unidades
  const criticalStockItems = products.filter(p => p.stock < 25);

  // ✅ CORREGIDO: Se unificó la variable en español (precio * cantidad) para evitar el ReferenceError
  const totalValue = products.reduce((acc, p) => {
    const precio = Number(p.precio_mayorista) || 0;
    const cantidad = Number(p.stock) || 0;
    return acc + (precio * cantidad); // ¡Ahora sí coincide perfectamente!
  }, 0);

  return (
    <div className="dashboard-summary">
      <div className="metrics-grid">
        <div className="metric-card">
          <h4>Total Ítems Distintos</h4>
          <p className="metric-value">{products.length}</p>
        </div>
        <div className="metric-card">
          <h4>Valoración de Inventario</h4>
          {/* Muestra el total con formato limpio de moneda en pesos colombianos */}
          <p className="metric-value">${totalValue.toLocaleString('es-CO')} COP</p>
        </div>
      </div>

      {/* Sistema de Alertas Críticas de Inventario */}
      {criticalStockItems.length > 0 && (
        <div className="alert-critical-box">
          <h5>⚠️ ALERTA CRÍTICA DE INVENTARIO (Stock &lt; 25 unidades)</h5>
          <ul>
            {criticalStockItems.map(item => (
              <li key={item.id_producto}>
                <strong>{item.descripcion} ({item.talla})</strong> - Solo quedan {item.stock} unidades en bodega.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;