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
  
  // Estado global para guardar las órdenes tramitadas
  const [orders, setOrders] = useState([]);
  
  // 👥 BASE DE DATOS GLOBAL EN MEMORIA: Centraliza los usuarios para toda la App
  const [appUsers, setAppUsers] = useState([
    { email: 'admin@sportapp.com', password: 'admin123', name: 'Amelia García', role: 'Administrador' },
    { email: 'cliente@gmail.com', password: 'cliente123', name: 'Distribuidor Valle', role: 'Cliente' }
  ]);

  const [products, setProducts] = useState([
    { id_producto: 1, descripcion: 'Camiseta Dry-Fit', talla: 'M', color: 'Negro', precio_mayorista: 45000, stock: 120 },
    { id_producto: 2, descripcion: 'Pantaloneta Deportiva', talla: 'L', color: 'Azul', precio_mayorista: 35000, stock: 12 },
    { id_producto: 3, descripcion: 'Short Licra Premium', talla: 'S', color: 'Gris', precio_mayorista: 35000, stock: 30 }
  ]);

  // 🛠️ VALIDACIÓN DINÁMICA: Busca en la lista compartida de usuarios
  const handleLogin = (email, password) => {
    const matchedUser = appUsers.find(u => u.email === email && u.password === password);

    if (matchedUser) {
      setUser(matchedUser);
      if (matchedUser.role === 'Administrador') {
        setAppMode('admin_dashboard');
        setCurrentView('inventario');
      } else {
        setAppMode('public_store'); 
      }
      return { success: true };
    } else {
      return { success: false, error: 'Credenciales incorrectas. Verifique los datos o regístrese al tramitar un pedido.' };
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAppMode('public_store');
  };

  // 🛠️ REGISTRO GLOBAL: Inyecta los nuevos usuarios al estado de la App
  const handleRegisterSuccess = (newUserData) => {
    const userToStore = {
      email: newUserData.email,
      password: newUserData.password || 'cliente123', 
      name: newUserData.name || 'Nuevo Distribuidor',
      role: 'Cliente'
    };

    if (!appUsers.some(u => u.email === userToStore.email)) {
      setAppUsers([...appUsers, userToStore]);
    }
    
    setUser(userToStore);
  };

  const handleAddProduct = (newProduct) => {
    const productWithId = { ...newProduct, id_producto: products.length + 1 };
    setProducts([...products, productWithId]);
    setCurrentView('inventario');
  };

  const handleUpdateProduct = (id, updatedProduct) => {
    setProducts(products.map(p => p.id_producto === id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id_producto !== id));
  };

  const handleAddOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
  };

  // --- RENDER CONDICIONAL ---

  if (appMode === 'login_screen') {
    return (
      <LoginCard 
        onLogin={handleLogin} 
        onCancel={() => setAppMode('public_store')} 
      />
    );
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
              <ProductList 
                products={products} 
                onUpdateProduct={handleUpdateProduct} 
                onDeleteProduct={handleDeleteProduct} 
              />
            </>
          ) : (
            <ProductForm onAddProduct={handleAddProduct} />
          )}
        </main>
      </div>
    );
  }

  // --- VISTA DEL CLIENTE ---
  return (
    <div style={{ position: 'relative' }}>
      
      {user?.role === 'Administrador' && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 9999 }}>
          <button
            onClick={() => setAppMode('admin_dashboard')}
            style={{
              backgroundColor: '#ff3d00',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ⚙️ Volver a Panel Admin
          </button>
        </div>
      )}

      <CustomerStore 
        products={products} 
        user={user} 
        registeredUsers={appUsers} 
        orders={orders}
        onAddOrder={handleAddOrder}
        onToggleLoginScreen={() => {
          if (user) {
            handleLogout();
          } else {
            setAppMode('login_screen');
          }
        }} 
        onRegisterSuccess={handleRegisterSuccess}
      />
    </div>
  );
}

export default App;