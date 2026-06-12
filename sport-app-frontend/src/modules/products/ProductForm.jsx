import React, { useState } from 'react';

/**
 * Componente: ProductForm
 * Permite el ingreso de nuevas prendas deportivas incluyendo una URL de imagen opcional.
 */
const ProductForm = ({ onAddProduct }) => {
  const [formData, setFormData] = useState({
    descripcion: '',
    talla: 'M',
    color: '',
    precio_mayorista: '',
    stock: '',
    imagen: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { descripcion, color, precio_mayorista, stock, imagen } = formData;

    // Validación de campos vacíos
    if (!descripcion || !color || !precio_mayorista || !stock) {
      setError('Todos los campos son obligatorios (excepto la imagen).');
      return;
    }

    // Regla de Negocio: No se permiten valores inferiores a cero
    if (Number(precio_mayorista) <= 0 || Number(stock) < 0) {
      setError('[REGLA DE NEGOCIO] El precio debe ser mayor a 0 y el stock no puede ser negativo.');
      return;
    }

    setError('');

    // Conversión de tipos de datos adecuados para persistencia
    onAddProduct({
      descripcion,
      talla: formData.talla,
      color,
      precio_mayorista: parseFloat(precio_mayorista),
      stock: parseInt(stock, 10),
      imagen: imagen.trim() !== '' ? imagen : null
    });

    // Limpiar los campos del formulario tras un guardado exitoso
    setFormData({
      descripcion: '',
      talla: 'M',
      color: '',
      precio_mayorista: '',
      stock: '',
      imagen: ''
    });
  };

  return (
    <div className="card-form">
      <h3>Registrar Nuevo Producto Mayorista</h3>

      {error && <div className="alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="grid-form">
        <div className="form-group">
          <label>Descripción de la Prenda:</label>
          <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Ej. Camiseta Deportiva" />
        </div>

        <div className="form-group">
          <label>Talla:</label>
          <select name="talla" value={formData.talla} onChange={handleChange}>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>

        <div className="form-group">
          <label>Color:</label>
          <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Ej. Negro" />
        </div>

        <div className="form-group">
          <label>Precio Mayorista (COP):</label>
          <input type="number" name="precio_mayorista" value={formData.precio_mayorista} onChange={handleChange} placeholder="0.00" />
        </div>

        <div className="form-group">
          <label>Stock Inicial:</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="0" />
        </div>

        <div className="form-group">
          <label>URL de la Imagen del Producto (Opcional):</label>
          <input type="text" name="imagen" value={formData.imagen} onChange={handleChange} placeholder="https://ejemplo.com/foto.jpg" />
        </div>

        <button type="submit" className="btn-success">Guardar en Catálogo</button>
      </form>
    </div>
  );
};

export default ProductForm;