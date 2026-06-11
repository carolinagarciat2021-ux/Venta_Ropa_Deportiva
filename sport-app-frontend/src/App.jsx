import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LoginCard from './modules/auth/LoginCard';
import AdminDashboard from './modules/dashboard/AdminDashboard';
import ProductForm from './modules/products/ProductForm';
import ProductList from './modules/products/ProductList';
import CustomerStore from './modules/customer/CustomerStore';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [appMode, setAppMode] = useState('public_store'); // 'public_store', 'login_screen', 'admin_dashboard'
  const [currentView, setCurrentView] = useState('inventario');
  
  const [products, setProducts] = useState([
    { id_producto: 1, descripcion: 'Camiseta Dry-Fit', talla: 'M', color: 'Negro', precio_mayorista: 45000, stock: 120 },
    { id_producto: 2, descripcion: 'Pantaloneta Deportiva', talla: 'L', color: 'Azul', precio_mayorista: 35000, stock: 12 },
    { id_producto: 3, descripcion: 'Short Licra Premium', talla: 'S', color: 'Gris', precio_mayorista: 35000, stock: 30 }
  ]);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'Administrador') {
      setAppMode('admin_dashboard');
      setCurrentView('inventario');
    } else {
      setAppMode('public_store'); // Los clientes vuelven a la vitrina con su sesión abierta
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAppMode('public_store');
  };

  const handleRegisterSuccess = (newUserData) => {
    setUser(newUserData);
  };

  const handleAddProduct = (newProduct) => {
    const productWithId = { ...newProduct, id_producto: products.length + 1 };
    setProducts([...products, productWithId]);
    setCurrentView('inventario');
  };

  // --- RENDER CONDICIONAL ---

  if (appMode === 'login_screen') {
    return <LoginCard onLogin={handleLogin} onCancel={() => setAppMode('public_store')} />;
  }

  if (appMode === 'admin_dashboard' && user?.role === 'Administrador') {
    return (
      <div className="app-container">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          setView={(view) => {
            if (view === 'tienda_publica') {
              setAppMode('public_store');
            } else {
              setCurrentView(view);
            }
          }} 
        />
        <main className="main-content">
          {currentView === 'inventario' ? (
            <>
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

  return (
    <CustomerStore 
      products={products} 
      user={user} 
      onToggleLoginScreen={() => {
        if (user) {
          handleLogout();
        } else {
          setAppMode('login_screen');
        }
      }} 
      onRegisterSuccess={handleRegisterSuccess}
    />
  );
}

export default App;