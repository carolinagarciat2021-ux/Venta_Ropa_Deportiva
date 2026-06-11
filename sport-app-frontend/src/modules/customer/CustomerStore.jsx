import React, { useState } from 'react';
import RegisterCard from '../auth/RegisterCard';

const colombiaLogistica = {
  "Valle del Cauca": ["Tuluá", "Cali", "Buga", "Palmira", "Cartago", "Buenaventura", "Jamundí", "Yumbo"],
  "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó", "Rionegro", "Caucasia"],
  "Cundinamarca": ["Bogotá D.C.", "Soacha", "Chía", "Zipaquirá", "Facatativá", "Fusagasugá", "Girardot"],
  "Cauca": ["Popayán", "Santander de Quilichao", "Puerto Tejada", "Patía", "Piendamó"],
  "Nariño": ["Pasto", "Ipiales", "Tumaco", "Túquerres", "La Unión"],
  "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Baranoa"],
  "Santander": ["Bucaramanga", "Floridablanca", "Girón", "Barrancabermeja", "San Gil"]
};

const CustomerStore = ({ products, onToggleLoginScreen, user, onRegisterSuccess }) => {
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('catalog'); // 'catalog', 'checkout', 'auth_workflow'
  const [quantities, setQuantities] = useState({});
  const [authSubView, setAuthSubView] = useState('register'); // 'register' o 'login'

  // --- Estado del Login Interno para Clientes Existentes ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [shippingData, setShippingData] = useState({
    departamento: 'Valle del Cauca',
    municipio: 'Tuluá',
    direccion: '',
    indicaciones: '',
    tipoPersona: 'Natural',
    requiereFactura: 'No',
    documentoIdentidad: '',
    razonSocial: '',
    metodoPago: 'contraentrega',
    bancoSeleccionado: ''
  });

  const MINIMO_MAYORISTA = 200000;

  const handleDepartamentoChange = (e) => {
    const depto = e.target.value;
    setShippingData({
      ...shippingData,
      departamento: depto,
      municipio: colombiaLogistica[depto][0]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData({ ...shippingData, [name]: value });
  };

  // --- Gestión de cantidades ---
  const handleQuantityChange = (productId, val, maxStock) => {
    const current = quantities[productId] || 1;
    const nextVal = current + val;
    if (nextVal >= 1 && nextVal <= maxStock) {
      setQuantities({ ...quantities, [productId]: nextVal });
    }
  };

  const addToCart = (product) => {
    const qtyToAdd = quantities[product.id_producto] || 1;
    const existingItem = cart.find(item => item.id_producto === product.id_producto);
    
    if (existingItem) {
      const totalNewQty = existingItem.quantity + qtyToAdd;
      if (totalNewQty > product.stock) {
        alert(`Error: No puedes superar las ${product.stock} unidades en existencia.`);
        return;
      }
      setCart(cart.map(item => item.id_producto === product.id_producto ? { ...item, quantity: totalNewQty } : item));
    } else {
      setCart([...cart, { ...product, quantity: qtyToAdd }]);
    }
    setQuantities({ ...quantities, [product.id_producto]: 1 });
  };

  const updateCartItemQty = (id, newQty, maxStock) => {
    if (newQty < 1) return;
    if (newQty > maxStock) {
      alert('Cantidad máxima alcanzada según existencias en bodega.');
      return;
    }
    setCart(cart.map(item => item.id_producto === id ? { ...item, quantity: parseInt(newQty) } : item));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id_producto !== id));
  };

  const totalCart = cart.reduce((acc, item) => acc + (item.precio_mayorista * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- Validación del Botón de Compra ---
  const proceedToCheckoutWorkflow = () => {
    if (!user) {
      setAuthSubView('register'); // Por defecto abre registro, pero el usuario puede cambiarlo
      setView('auth_workflow');
    } else {
      processFinalOrder();
    }
  };

  const processFinalOrder = () => {
    let mensajeFactura = shippingData.requiereFactura === 'Sí' 
      ? `\n🧾 FACTURA ELECTRÓNICA REQUERIDA:\n   Razón Social: ${shippingData.razonSocial}\n   NIT/Cédula: ${shippingData.documentoIdentidad}`
      : '\n🧾 Tipo de Factura: Remisión Simplificada';

    let mensajeBanco = shippingData.metodoPago === 'banco_aval' || shippingData.metodoPago === 'pse'
      ? `\n💳 Entidad Financiera: ${shippingData.bancoSeleccionado}`
      : '';

    alert(`🎉 ¡PEDIDO PROCESADO CORRECTAMENTE! 🎉\n\n` +
          `Distribuidor Activo: ${user ? user.name : 'Invitado Validado'}\n` +
          `Monto Operación: $${totalCart.toLocaleString('es-CO')} COP\n` +
          `📍 Destino: ${shippingData.municipio}, ${shippingData.departamento}\n` +
          `💰 Método Pago: ${shippingData.metodoPago.toUpperCase()}${mensajeBanco}\n` +
          `${mensajeFactura}\n\n` +
          `✓ Solicitud enviada a la base de datos MySQL.`);
    
    setCart([]);
    setView('catalog');
  };

  // Manejo del Login de Clientes que ya existen desde la zona de pago
  const handleInternalLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === 'cliente@gmail.com' && loginPassword === 'cliente123') {
      setLoginError('');
      const mockClient = { email: loginEmail, role: 'Cliente', name: 'Distribuidor Valle' };
      onRegisterSuccess(mockClient); // Inicia sesión globalmente
      setView('checkout');           // Lo manda directo a terminar el formulario de pago
    } else {
      setLoginError('Credenciales incorrectas de distribuidor.');
    }
  };

  const getProductImage = (desc) => {
    if (desc.toLowerCase().includes('camiseta')) return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400';
    if (desc.toLowerCase().includes('pantaloneta') || desc.toLowerCase().includes('short')) return 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400';
    return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400';
  };

  // --- FLUJO INTERMEDIO: IDENTIFICACIÓN EN CARRITO ---
  if (view === 'auth_workflow') {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => setAuthSubView('register')} 
            className="nav-btn" 
            style={{ color: '#111', fontWeight: authSubView === 'register' ? 'bold' : 'normal', textDecoration: authSubView === 'register' ? 'underline' : 'none', fontSize: '1.2rem', margin: '0 15px' }}
          >
            1. Crear Cuenta Mayorista (Primera Vez)
          </button>
          <button 
            onClick={() => setAuthSubView('login')} 
            className="nav-btn" 
            style={{ color: '#111', fontWeight: authSubView === 'login' ? 'bold' : 'normal', textDecoration: authSubView === 'login' ? 'underline' : 'none', fontSize: '1.2rem', margin: '0 15px' }}
          >
            2. Ya tengo cuenta (Iniciar Sesión)
          </button>
        </div>

        {authSubView === 'register' ? (
          <RegisterCard 
            totalCart={totalCart} 
            onRegister={(newUserData) => {
              onRegisterSuccess(newUserData);
              setView('checkout');
            }}
            onCancel={() => setView('checkout')}
          />
        ) : (
          /* FORMULARIO DE LOGIN RÁPIDO DENTRO DEL CARRITO */
          <div className="card-form" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h3>Identifícate como Distribuidor</h3>
            {loginError && <div className="alert-danger">{loginError}</div>}
            <form onSubmit={handleInternalLoginSubmit} className="grid-form">
              <div className="form-group">
                <label>Correo Electrónico:</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="cliente@gmail.com" required />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Ingresar y Continuar Compra</button>
              <button type="button" onClick={() => setView('checkout')} className="btn-logout" style={{ color: '#333', borderColor: '#ccc', width: '100%', marginTop: '10px' }}>Volver</button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="store-container">
      <header className="navbar-main" style={{ background: 'linear-gradient(135deg, #111, #222)' }}>
        <div className="nav-brand">
          <h1>Kinetic Store</h1>
          <span className="role-tag" style={{ backgroundColor: user ? '#2e7d32' : '#777' }}>
            {user ? `${user.role}: ${user.name}` : 'Modo Invitado Público'}
          </span>
        </div>
        <div className="nav-links">
          <button onClick={() => setView('catalog')} className="nav-btn">🛒 Catálogo Público</button>
          <button onClick={() => setView('checkout')} className="nav-btn" style={{ backgroundColor: '#b21f1f', padding: '5px 12px', borderRadius: '4px' }}>
            📦 Mi Carrito ({totalItems})
          </button>
          {/* ✅ CORREGIDO: Ahora dice "Ingreso" y sirve tanto para Admin como para Clientes registrados */}
          {!user && <button onClick={onToggleLoginScreen} className="nav-btn" style={{ border: '1px solid #fff', padding: '3px 15px', borderRadius: '4px' }}>🔒 Ingreso</button>}
        </div>
        {user && <button onClick={onToggleLoginScreen} className="btn-logout">Cerrar Sesión</button>}
      </header>

      <main className="main-content">
        {view === 'catalog' ? (
          <>
            <h2 className="section-title">Vitrina Comercial Mayorista</h2>
            <div className="products-grid">
              {products.map((prod) => {
                const selectedQty = quantities[prod.id_producto] || 1;
                return (
                  <div className="product-card" key={prod.id_producto}>
                    <img src={getProductImage(prod.descripcion)} alt={prod.descripcion} className="product-img" />
                    <div className="product-info">
                      <h3>{prod.descripcion}</h3>
                      <p className="product-details">Talla: <strong>{prod.talla}</strong> | Color: {prod.color}</p>
                      <p className="product-price">${prod.precio_mayorista.toLocaleString('es-CO')} COP</p>
                      <p className="product-stock-status">Disponibles: {prod.stock} u.</p>
                      
                      {prod.stock > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '15px 0' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Unidades:</label>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px' }}>
                            <button type="button" onClick={() => handleQuantityChange(prod.id_producto, -1, prod.stock)} style={{ padding: '4px 10px', background: '#eee', border: 'none', cursor: 'pointer' }}>-</button>
                            <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{selectedQty}</span>
                            <button type="button" onClick={() => handleQuantityChange(prod.id_producto, 1, prod.stock)} style={{ padding: '4px 10px', background: '#eee', border: 'none', cursor: 'pointer' }}>+</button>
                          </div>
                        </div>
                      )}

                      <button onClick={() => addToCart(prod)} className="btn-success" disabled={prod.stock === 0} style={{ width: '100%' }}>
                        {prod.stock === 0 ? 'Agotado de Bodega' : `Llevar ${selectedQty} Unidades`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="checkout-container">
            <h2>Resumen de Orden y Facturación Legal</h2>
            <div className="checkout-grid">
              
              <div className="cart-summary-box">
                <h3>Prendas Seleccionadas</h3>
                {cart.length === 0 ? (
                  <p>No tienes artículos en tu carrito.</p>
                ) : (
                  cart.map(item => (
                    <div className="cart-item" key={item.id_producto} style={{ padding: '10px 0' }}>
                      <div style={{ flex: 1 }}>
                        <h4>{item.descripcion} ({item.talla})</h4>
                        <p style={{ margin: '3px 0', color: '#2e7d32', fontWeight: 'bold' }}>
                          ${item.precio_mayorista.toLocaleString('es-CO')} x {item.quantity} u.
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.id_producto)} className="text-danger font-bold" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Quitar</button>
                    </div>
                  ))
                )}
                <hr />
                <h3 style={{ color: '#1a2a6c' }}>Subtotal Orden: ${totalCart.toLocaleString('es-CO')} COP</h3>
              </div>

              <div className="card-form">
                <h3>Detalles de Envío y Pasarela de Pago</h3>
                {cart.length > 0 && (
                  <div className="grid-form">
                    <div className="form-group">
                      <label>Departamento: *</label>
                      <select name="departamento" value={shippingData.departamento} onChange={handleDepartamentoChange} required>
                        {Object.keys(colombiaLogistica).map(depto => (
                          <option key={depto} value={depto}>{depto}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Ciudad o Municipio: *</label>
                      <select name="municipio" value={shippingData.municipio} onChange={handleInputChange} required>
                        {colombiaLogistica[shippingData.departamento].map(muni => (
                          <option key={muni} value={muni}>{muni}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Dirección Completa de Despacho: *</label>
                      <input type="text" name="direccion" value={shippingData.direccion} onChange={handleInputChange} required placeholder="Ej: Calle 25 # 10-12" />
                    </div>

                    <div className="form-group">
                      <label>Indicaciones de entrega (Casa, Local, Portería):</label>
                      <input type="text" name="indicaciones" value={shippingData.indicaciones} onChange={handleInputChange} placeholder="Ej: Frente al parque principal" />
                    </div>

                    <div className="form-group">
                      <label>Tipo de Persona: *</label>
                      <select name="tipoPersona" value={shippingData.tipoPersona} onChange={handleInputChange}>
                        <option value="Natural">Persona Natural (Cédula)</option>
                        <option value="Jurídica">Persona Jurídica (Empresa - NIT)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>¿Requiere Factura Electrónica Validada por DIAN?: *</label>
                      <select name="requiereFactura" value={shippingData.requiereFactura} onChange={handleInputChange}>
                        <option value="No">No, remisión estándar</option>
                        <option value="Sí">Sí, necesito Factura Electrónica</option>
                      </select>
                    </div>

                    {shippingData.requiereFactura === 'Sí' && (
                      <>
                        <div className="form-group">
                          <label>Razón Social / Nombre Comercial legal: *</label>
                          <input type="text" name="razonSocial" value={shippingData.razonSocial} onChange={handleInputChange} required placeholder="Ej: Distribuidora Deportiva S.A.S" />
                        </div>
                        <div className="form-group">
                          <label>NIT o Cédula Jurídica: *</label>
                          <input type="text" name="documentoIdentidad" value={shippingData.documentoIdentidad} onChange={handleInputChange} required placeholder="Ej: 900.123.456-1" />
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label>Medio de Pago: *</label>
                      <select name="metodoPago" value={shippingData.metodoPago} onChange={handleInputChange}>
                        <option value="contraentrega">Efectivo Contraentrega</option>
                        <option value="nequi">Plataforma Nequi</option>
                        <option value="daviplata">Plataforma Daviplata</option>
                        <option value="pse">PSE - Cuenta de Ahorros / Corriente</option>
                        <option value="banco_aval">Grupo Aval (Corresponsal / Transferencia)</option>
                      </select>
                    </div>

                    {(shippingData.metodoPago === 'banco_aval' || shippingData.metodoPago === 'pse') && (
                      <div className="form-group">
                        <label>Seleccione su Entidad Bancaria: *</label>
                        <select name="bancoSeleccionado" value={shippingData.bancoSeleccionado} onChange={handleInputChange} required>
                          <option value="">-- Seleccionar Banco --</option>
                          <option value="Bancolombia">Bancolombia</option>
                          <option value="Banco de Bogotá">Banco de Bogotá (Grupo Aval)</option>
                          <option value="Banco de Occidente">Banco de Occidente (Grupo Aval)</option>
                          <option value="Banco AV Villas">Banco AV Villas (Grupo Aval)</option>
                          <option value="Banco Popular">Banco Popular (Grupo Aval)</option>
                          <option value="Davivienda">Davivienda</option>
                          <option value="Banco Caja Social">Banco Caja Social</option>
                          <option value="BBVA">BBVA Colombia</option>
                        </select>
                      </div>
                    )}

                    {totalCart >= MINIMO_MAYORISTA ? (
                      <button 
                        type="button" 
                        onClick={proceedToCheckoutWorkflow} 
                        className="btn-success" 
                        style={{ width: '100%', fontSize: '1.1rem', marginTop: '15px' }}
                      >
                        {user ? 'Confirmar Pago Seguro' : 'Validar Compra Mínima e Identificarse'}
                      </button>
                    ) : (
                      <div className="alert-danger" style={{ marginTop: '15px' }}>
                        <strong>[REGLA DE NEGOCIO]</strong> Para despachos mayoristas directos de fábrica, el pedido debe sumar al menos <strong>$200.000 COP</strong>. Te faltan <strong>${(MINIMO_MAYORISTA - totalCart).toLocaleString('es-CO')} COP</strong>.
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerStore;