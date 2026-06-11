import React, { useState } from 'react';

/**
 * Componente: LoginCard
 * Formulario de autenticación seguro unificado tanto para Administradores como para Clientes.
 */
const LoginCard = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, diligencie todos los campos.');
      return;
    }

    // --- Control Unificado de Roles ---
    if (email === 'admin@sportapp.com' && password === 'admin123') {
      setError('');
      onLogin({ email: email, role: 'Administrador', name: 'Amelia García' });
    } else if (email === 'cliente@gmail.com' && password === 'cliente123') {
      setError('');
      onLogin({ email: email, role: 'Cliente', name: 'Distribuidor Valle' });
    } else {
      setError('Credenciales incorrectas. Verifique los datos o regístrese al tramitar un pedido.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Sport-App</h2>
        <p className="subtitle">Módulo de Ingreso Seguro</p>
        
        {error && <div className="alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sportapp.com o cliente@gmail.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginBottom: '10px' }}>Iniciar Sesión</button>
          <button type="button" onClick={onCancel} className="btn-logout" style={{ color: '#333', borderColor: '#ccc', width: '100%' }}>
            Volver al Catálogo Público
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;