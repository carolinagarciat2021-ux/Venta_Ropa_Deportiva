import React, { useState } from 'react';

/**
 * Componente: LoginCard
 * Encargado de la validación de credenciales del distribuidor o administrador.
 */
const LoginCard = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica de campos obligatorios
    if (!email || !password) {
      setError('Por favor, diligencie todos los campos.');
      return;
    }

    // Simulación de validación (Equivalente a tu HU1 de acceso seguro)
    if (email === 'admin@sportapp.com' && password === 'admin123') {
      setError('');
      onLogin({ email: email, role: 'Administrador', name: 'Amelia García' });
    } else {
      setError('Credenciales incorrectas. Intente de nuevo.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Sport-App</h2>
        <p className="subtitle">The Kinetic Warehouse - Mayoristas</p>
        
        {error && <div className="alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@sportapp.com"
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button type="submit" className="btn-primary">Ingresar Seguro</button>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;