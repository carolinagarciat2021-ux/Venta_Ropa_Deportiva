import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginCard from './modules/auth/LoginCard';
import AdminDashboard from './modules/dashboard/AdminDashboard';
import ProductForm from './modules/products/ProductForm';
import ProductList from './modules/products/ProductList';
import './App.css';

/**
 * Componente Principal: App
 * Gestiona el estado de autenticación y la navegación entre módulos
 * de la plataforma mayorista Sport-App.
 */
function App() {
  // Estado para controlar el usuario autenticado
  const [user, setUser] = useState(null);
  // Estado para la vista activa en el Dashboard ("inventario", "crear")
  const [currentView, setCurrentView] = useState('inventario');
  // Estado local simulado de productos (Sincronizado conceptualmente con MySQL)
  const [products, setProducts] = useState([
    { id_producto: 1, descripcion: 'Camiseta Dry-Fit', talla: 'M', color: 'Negro', precio_grayorista: 45000, stock: 120 },
    { id_producto: 2, descripcion: 'Pantaloneta Deportiva', talla: 'L', color: 'Azul', precio_grayorista: 35000, stock: 12 } // Alerta crítica (< 25)
  ]);

  // Manejador para el inicio de sesión exitoso
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Manejador para el cierre de sesión
  const handleLogout = () => {
    setUser(null);
  };

  // Manejador para agregar un nuevo producto desde el formulario
  const handleAddProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id_producto: products.length + 1
    };
    setProducts([...products, productWithId]);
    setCurrentView('inventario'); // Redirecciona a la lista automáticamente
  };

  // Renderizado condicional: Si no está logueado, muestra la interfaz de Login
  if (!user) {
    return <LoginCard onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} setView={setCurrentView} />
      
      <main className="main-content">
        {currentView === 'inventario' ? (
          <>
            {/* Panel analítico con la alerta de stock crítico */}
            <AdminDashboard products={products} />
            <ProductList products={products} />
          </>
        ) : (
          <ProductForm onAddProduct={handleAddProduct} />
        )}
      </main>
    </div>
  );
}

export default App;