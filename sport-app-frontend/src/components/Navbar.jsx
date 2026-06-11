import React from 'react';

/**
 * Componente: Navbar
 * Controla la navegación interna del Administrador y permite regresar a la vitrina comercial.
 */
const Navbar = ({ user, onLogout, setView }) => {
  return (
    <header className="navbar-main" style={{ backgroundColor: '#1a2a6c' }}>
      <div className="nav-brand">
        <h1>Sport-App Admin</h1>
        <span className="role-tag" style={{ backgroundColor: '#b21f1f' }}>{user.role}</span>
      </div>
      <nav className="nav-links">
        <button onClick={() => setView('inventario')} className="nav-btn">📋 Ver Inventario</button>
        <button onClick={() => setView('crear')} className="nav-btn">➕ Registrar Producto</button>
        <button onClick={() => setView('tienda_publica')} className="nav-btn" style={{ color: '#ffeb3b', fontWeight: 'bold' }}>🏪 Ir a Tienda Cliente</button>
      </nav>
      <div className="nav-user">
        <span>Bienvenido, <strong>{user.name}</strong></span>
        <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
      </div>
    </header>
  );
};

export default Navbar;