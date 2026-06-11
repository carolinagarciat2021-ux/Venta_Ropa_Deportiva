import React from 'react';

/**
 * Componente: Navbar
 * Controla la navegación del sistema y muestra información del usuario en sesión.
 */
const Navbar = ({ user, onLogout, setView }) => {
  return (
    <header className="navbar-main">
      <div className="nav-brand">
        <h1>Sport-App Admin</h1>
        <span className="role-tag">{user.role}</span>
      </div>
      <nav className="nav-links">
        <button onClick={() => setView('inventario')} className="nav-btn">📋 Ver Inventario</button>
        <button onClick={() => setView('crear')} className="nav-btn">➕ Registrar Producto</button>
      </nav>
      <div className="nav-user">
        <span>Bienvenido, <strong>{user.name}</strong></span>
        <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
      </div>
    </header>
  );
};

export default Navbar;