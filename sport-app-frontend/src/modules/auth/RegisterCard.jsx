import React, { useState } from 'react';

/**
 * Componente: RegisterCard
 * Captura el correo oficial de notificaciones logísticas para el distribuidor.
 */
const RegisterCard = ({ onRegister, onCancel, totalCart }) => {
  const [formData, setFormData] = useState({
    name: '',
    emailNotificaciones: '', // Correo clave para el seguimiento
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.emailNotificaciones || !formData.password) {
      setError('Por favor, diligencie los campos obligatorios.');
      return;
    }

    // Enviamos la información al estado global
    onRegister({
      email: formData.emailNotificaciones, // Se guarda como su identificador y correo de alertas
      role: 'Cliente',
      name: formData.name
    });
  };

  return (
    <div className="card-form" style={{ maxWidth: '450px', margin: '20px auto' }}>
      <h3>Registro de Cuenta Mayorista</h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>
        Estás consolidando una compra de <strong>${totalCart.toLocaleString('es-CO')} COP</strong>. 
        El correo que registres abajo será el canal oficial para rastrear tu despacho.
      </p>
      
      {error && <div className="alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="grid-form">
        <div className="form-group">
          <label>Nombre de la Empresa o Comercio: *</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Variedades y Deportes Tuluá" />
        </div>
        
        <div className="form-group">
          <label>Correo Electrónico para Notificaciones y Seguimiento: *</label>
          <input type="email" name="emailNotificaciones" value={formData.emailNotificaciones} onChange={handleChange} required placeholder="ejemplo@correo.com" />
        </div>
        
        <div className="form-group">
          <label>Contraseña de Acceso: *</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
        </div>
        
        <div className="form-group">
          <label>Teléfono de Contacto:</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej: 315..." />
        </div>

        <button type="submit" className="btn-success" style={{ width: '100%' }}>Crear Usuario y Confirmar</button>
        <button type="button" onClick={onCancel} className="btn-logout" style={{ color: '#333', borderColor: '#ccc', width: '100%', marginTop: '10px' }}>
          Volver al Carrito
        </button>
      </form>
    </div>
  );
};

export default RegisterCard;