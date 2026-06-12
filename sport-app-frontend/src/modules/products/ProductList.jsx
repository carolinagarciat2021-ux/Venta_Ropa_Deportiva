import React, { useState } from 'react';

const ProductList = ({ products, onUpdateProduct, onDeleteProduct }) => {
  // Estado para saber cuál fila se está editando por su ID
  const [editingId, setEditingId] = useState(null);

  // Estado temporal para almacenar los cambios de la fila que se está editando
  const [editFormData, setEditFormData] = useState({
    descripcion: '',
    talla: '',
    color: '',
    precio_mayorista: '',
    stock: '',
    imagen: ''
  });

  // Activa el modo de edición copiando los datos actuales del producto al estado temporal
  const handleEditClick = (prod) => {
    setEditingId(prod.id_producto);
    setEditFormData({
      descripcion: prod.descripcion,
      talla: prod.talla,
      color: prod.color,
      precio_mayorista: prod.precio_mayorista,
      stock: prod.stock,
      imagen: prod.imagen || ''
    });
  };

  // Captura los cambios de los inputs dentro de la tabla
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Captura el cambio de imagen local por si también deseas cambiar la foto al editar
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData({
          ...editFormData,
          imagen: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Guarda los cambios combinados y apaga el modo edición
  const handleSaveSubmit = (id) => {
    if (!editFormData.descripcion || !editFormData.color || !editFormData.precio_mayorista || !editFormData.stock) {
      alert('Todos los campos son obligatorios para actualizar el producto.');
      return;
    }

    // Estructuramos el objeto final asegurando valores numéricos correctos
    const updatedProduct = {
      id_producto: id,
      descripcion: editFormData.descripcion,
      talla: editFormData.talla,
      color: editFormData.color,
      precio_mayorista: Number(editFormData.precio_mayorista),
      stock: Number(editFormData.stock),
      imagen: editFormData.imagen
    };

    // Enviamos los datos actualizados a la función global en App.jsx
    onUpdateProduct(id, updatedProduct);
    setEditingId(null); // Sale del modo edición
  };

  return (
    <div className="card-form" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h3 style={{ marginTop: 0, color: '#333', borderBottom: '2px solid #1a237e', paddingBottom: '8px' }}>
        Existencias y Control Total de Bodega ({products.length})
      </h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ccc', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Foto</th>
              <th style={{ padding: '10px' }}>Descripción de la Prenda</th>
              <th style={{ padding: '10px' }}>Talla</th>
              <th style={{ padding: '10px' }}>Color</th>
              <th style={{ padding: '10px' }}>Precio Mayorista</th>
              <th style={{ padding: '10px' }}>Stock Actual</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Acciones de Control</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => {
              const isEditing = editingId === prod.id_producto;

              return (
                <tr key={prod.id_producto} style={{ borderBottom: '1px solid #eee', backgroundColor: isEditing ? '#f9fbe7' : 'transparent' }}>
                  
                  {/* COLUMNA FOTO */}
                  <td style={{ padding: '10px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <img 
                          src={editFormData.imagen || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'} 
                          alt="" 
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleEditImageChange} 
                          style={{ fontSize: '0.75rem', width: '120px' }} 
                        />
                      </div>
                    ) : (
                      <img 
                        src={prod.imagen || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'} 
                        alt="" 
                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} 
                      />
                    )}
                  </td>

                  {/* COLUMNA DESCRIPCIÓN */}
                  <td style={{ padding: '10px' }}>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="descripcion" 
                        value={editFormData.descripcion} 
                        onChange={handleEditInputChange}
                        style={{ padding: '6px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #999' }}
                      />
                    ) : (
                      <strong style={{ color: '#222' }}>{prod.descripcion}</strong>
                    )}
                  </td>

                  {/* COLUMNA TALLA */}
                  <td style={{ padding: '10px' }}>
                    {isEditing ? (
                      <select 
                        name="talla" 
                        value={editFormData.talla} 
                        onChange={handleEditInputChange}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #999' }}
                      >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                    ) : (
                      <span style={{ background: '#eee', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{prod.talla}</span>
                    )}
                  </td>

                  {/* COLUMNA COLOR */}
                  <td style={{ padding: '10px' }}>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="color" 
                        value={editFormData.color} 
                        onChange={handleEditInputChange}
                        style={{ padding: '6px', width: '90px', borderRadius: '4px', border: '1px solid #999' }}
                      />
                    ) : (
                      <span>{prod.color}</span>
                    )}
                  </td>

                  {/* COLUMNA PRECIO */}
                  <td style={{ padding: '10px' }}>
                    {isEditing ? (
                      <input 
                        type="number" 
                        name="precio_mayorista" 
                        value={editFormData.precio_mayorista} 
                        onChange={handleEditInputChange}
                        style={{ padding: '6px', width: '90px', borderRadius: '4px', border: '1px solid #999' }}
                        min="0"
                      />
                    ) : (
                      <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>${prod.precio_mayorista.toLocaleString('es-CO')}</span>
                    )}
                  </td>

                  {/* COLUMNA STOCK */}
                  <td style={{ padding: '10px' }}>
                    {isEditing ? (
                      <input 
                        type="number" 
                        name="stock" 
                        value={editFormData.stock} 
                        onChange={handleEditInputChange}
                        style={{ padding: '6px', width: '70px', borderRadius: '4px', border: '1px solid #999' }}
                        min="0"
                      />
                    ) : (
                      <span style={{ fontWeight: prod.stock < 25 ? 'bold' : 'normal', color: prod.stock < 25 ? '#c62828' : '#333' }}>
                        {prod.stock} uds.
                      </span>
                    )}
                  </td>

                  {/* COLUMNA ACCIONES */}
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleSaveSubmit(prod.id_producto)} 
                          style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          Guardar
                        </button>
                        <button 
                          onClick={() => setEditingId(null)} 
                          style={{ backgroundColor: '#757575', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleEditClick(prod)} 
                          style={{ backgroundColor: '#0288d1', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm(`¿Estás segura de eliminar "${prod.descripcion}"?`)) {
                              onDeleteProduct(prod.id_producto);
                            }
                          }} 
                          style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;