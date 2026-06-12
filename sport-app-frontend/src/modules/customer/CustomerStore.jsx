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

const PASOS_LINEA_TIEMPO = ["Recibido", "Preparación", "Enviado", "Entregado"];

const CustomerStore = ({ products, onToggleLoginScreen, user, onRegisterSuccess, registeredUsers, orders = [], onAddOrder }) => {
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('catalog'); // 'catalog', 'checkout', 'auth_workflow', 'orders_history'
  const [quantities, setQuantities] = useState({});
  const [authSubView, setAuthSubView] = useState('register'); 

  const [selectedVariants, setSelectedVariants] = useState({});
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

  // 💰 CONFIGURACIÓN DEL VALOR MÍNIMO MAYORISTA
  const MINIMO_COMPRA_MAYORISTA = 200000;

  const myOrders = orders.filter(o => o.email_cliente === user?.email);

  const handleDepartamentoChange = (e) => {
    const depto = e.target.value;
    setShippingData({ ...shippingData, departamento: depto, municipio: colombiaLogistica[depto][0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData({ ...shippingData, [name]: value });
  };

  const handleQuantityChange = (productGroupKey, val, maxStock) => {
    const current = quantities[productGroupKey] || 1;
    const nextVal = current + val;
    if (nextVal >= 1 && nextVal <= maxStock) {
      setQuantities({ ...quantities, [productGroupKey]: nextVal });
    }
  };

  const groupedProducts = products.reduce((acc, current) => {
    if (!acc[current.descripcion]) acc[current.descripcion] = [];
    acc[current.descripcion].push(current);
    return acc;
  }, {});

  const addToCart = (descripcion, availableVariants) => {
    const tallasUnicas = [...new Set(availableVariants.map(v => v.talla))];
    const defaultTalla = tallasUnicas[0];
    const coloresParaTallaDefault = availableVariants.filter(v => v.talla === defaultTalla).map(v => v.color);
    const defaultColor = coloresParaTallaDefault[0];

    const variantConfig = selectedVariants[descripcion] || { talla: defaultTalla, color: defaultColor };
    const targetProduct = availableVariants.find(p => p.talla === variantConfig.talla && p.color === variantConfig.color);

    if (!targetProduct) { alert('Combinación no disponible.'); return; }
    const qtyToAdd = quantities[descripcion] || 1;
    if (targetProduct.stock <= 0) { alert('Sin existencias.'); return; }

    const existingItem = cart.find(item => item.id_producto === targetProduct.id_producto);
    if (existingItem) {
      const totalNewQty = existingItem.quantity + qtyToAdd;
      if (totalNewQty > targetProduct.stock) { alert('Supera existencias.'); return; }
      setCart(cart.map(item => item.id_producto === targetProduct.id_producto ? { ...item, quantity: totalNewQty } : item));
    } else {
      setCart([...cart, { ...targetProduct, quantity: qtyToAdd }]);
    }
    setQuantities({ ...quantities, [descripcion]: 1 });
  };

  const updateCartItemQty = (id, newQty, maxStock) => {
    if (newQty < 1) return;
    if (newQty > maxStock) { alert('Máximo alcanzado.'); return; }
    setCart(cart.map(item => item.id_producto === id ? { ...item, quantity: parseInt(newQty) } : item));
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id_producto !== id));

  const totalCart = cart.reduce((acc, item) => acc + (item.precio_mayorista * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 📦 VALIDACIÓN DEL TOTAL ANTES DE SEGUIR CON LA COMPRA
  const cumpleMinimoCompra = totalCart >= MINIMO_COMPRA_MAYORISTA;

  const proceedToCheckoutWorkflow = (e) => {
    if (e) e.preventDefault();

    // Validar campos obligatorios manualmente antes de procesar el flujo visual
    if (!shippingData.direccion || !shippingData.documentoIdentidad || !shippingData.departamento || !shippingData.municipio) {
      alert("⚠️ Por favor complete todos los campos obligatorios del formulario de envío.");
      return;
    }

    if ((shippingData.metodoPago === 'pse' || shippingData.metodoPago === 'transferencia') && !shippingData.bancoSeleccionado) {
      alert("⚠️ Por favor seleccione una entidad bancaria para continuar con el pago.");
      return;
    }

    if (!cumpleMinimoCompra) {
      alert(`⚠️ El monto actual es de $${totalCart.toLocaleString('es-CO')} COP. Para realizar compras al por mayor, el pedido debe ser igual o superior a $${MINIMO_COMPRA_MAYORISTA.toLocaleString('es-CO')} COP.`);
      return;
    }
    if (!user) {
      setAuthSubView('register');
      setView('auth_workflow');
    } else {
      processFinalOrder();
    }
  };

  const processFinalOrder = () => {
    const nuevoPedido = {
      id_pedido: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
      email_cliente: user.email,
      fecha: new Date().toLocaleDateString('es-CO'),
      productos: [...cart],
      total: totalCart,
      estado: "Recibido",
      shipping: { ...shippingData }
    };

    onAddOrder(nuevoPedido);

    alert(`🎉 ¡PEDIDO PROCESADO CORRECTAMENTE! 🎉\n\nCódigo: ${nuevoPedido.id_pedido}\nMonto: $${totalCart.toLocaleString('es-CO')} COP\n\nYa puedes rastrear su línea de tiempo en la pestaña "Mis Pedidos".`);

    setCart([]);
    setView('orders_history');
  };

  const handleInternalLoginSubmit = (e) => {
    e.preventDefault();
    const matchedUser = registeredUsers.find(u => u.email === loginEmail && u.password === loginPassword);
    if (matchedUser) {
      setLoginError('');
      onRegisterSuccess(matchedUser); 
      setView('catalog');       
    } else {
      setLoginError('Credenciales incorrectas.');
    }
  };

  const handleVariantChange = (descripcion, field, val, availableVariants) => {
    const currentSelection = selectedVariants[descripcion] || { talla: [...new Set(availableVariants.map(v => v.talla))][0], color: '' };
    let updatedSelection = { ...currentSelection, [field]: val };
    if (field === 'talla') {
      const coloresValidosParaTalla = availableVariants.filter(v => v.talla === val).map(v => v.color);
      updatedSelection.color = coloresValidosParaTalla[0] || '';
    }
    setSelectedVariants({ ...selectedVariants, [descripcion]: updatedSelection });
  };

  if (view === 'auth_workflow') {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button onClick={() => setAuthSubView('register')} className="nav-btn" style={{ color: '#111', fontWeight: authSubView === 'register' ? 'bold' : 'normal', textDecoration: authSubView === 'register' ? 'underline' : 'none', fontSize: '1.1rem', margin: '0 15px' }}>
            1. Crear Cuenta Mayorista
          </button>
          <button onClick={() => setAuthSubView('login')} className="nav-btn" style={{ color: '#111', fontWeight: authSubView === 'login' ? 'bold' : 'normal', textDecoration: authSubView === 'login' ? 'underline' : 'none', fontSize: '1.1rem', margin: '0 15px' }}>
            2. Ya tengo cuenta (Iniciar Sesión)
          </button>
        </div>

        {authSubView === 'register' ? (
          <RegisterCard 
            totalCart={totalCart} 
            onRegister={(newUserData) => {
              const userToStore = { email: newUserData.email, password: newUserData.password || 'cliente123', name: newUserData.name || 'Nuevo Distribuidor', role: 'Cliente' };
              onRegisterSuccess(userToStore);
              setView('catalog'); 
            }}
            onCancel={() => setView('catalog')} 
          />
        ) : (
          <div className="card-form" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h3>Identifícate como Distribuidor</h3>
            {loginError && <div className="alert-danger">{loginError}</div>}
            <form onSubmit={handleInternalLoginSubmit} className="grid-form">
              <div className="form-group">
                <label>Correo Electrónico:</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Contraseña:</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Ingresar y Continuar Compra</button>
              <button type="button" onClick={() => setView('catalog')} className="btn-logout" style={{ color: '#333', borderColor: '#ccc', width: '100%', marginTop: '10px' }}>Volver</button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="store-container">
      {/* HEADER NAVBAR */}
      <header className="navbar-main" style={{ background: 'linear-gradient(135deg, #111, #222)' }}>
        <div className="nav-brand">
          <h1>Kinetic Store</h1>
          <span className="role-tag" style={{ backgroundColor: user ? '#2e7d32' : '#777' }}>
            {user ? `${user.role}: ${user.name}` : 'Modo Invitado Público'}
          </span>
        </div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setView('catalog')} className="nav-btn" style={{ fontWeight: view === 'catalog' ? 'bold' : 'normal' }}>Catálogo</button>
          
          {user && (
            <button onClick={() => setView('orders_history')} className="nav-btn" style={{ backgroundColor: '#1976d2', padding: '5px 12px', borderRadius: '4px', fontWeight: view === 'orders_history' ? 'bold' : 'normal' }}>
              📋 Mis Pedidos ({myOrders.length})
            </button>
          )}

          <button onClick={() => setView('checkout')} className="nav-btn" style={{ backgroundColor: '#b21f1f', padding: '5px 12px', borderRadius: '4px' }}>
            📦 Mi Carrito ({totalItems})
          </button>
          
          {!user && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setAuthSubView('register'); setView('auth_workflow'); }} className="nav-btn" style={{ backgroundColor: '#00e676', color: '#111', padding: '3px 15px', borderRadius: '4px', fontWeight: 'bold' }}>📝 Registrarse</button>
              <button onClick={onToggleLoginScreen} className="nav-btn" style={{ border: '1px solid #fff', padding: '3px 15px', borderRadius: '4px' }}>🔒 Ingreso</button>
            </div>
          )}
        </div>
        {user && <button onClick={onToggleLoginScreen} className="btn-logout">Cerrar Sesión</button>}
      </header>

      <main className="main-content">
        
        {/* VISTA 1: CATÁLOGO */}
        {view === 'catalog' && (
          <>
            <h2 className="section-title">Vitrina Comercial Mayorista</h2>
            <div className="products-grid">
              {Object.keys(groupedProducts).map((descripcion) => {
                const availableVariants = groupedProducts[descripcion];
                const tallasUnicas = [...new Set(availableVariants.map(v => v.talla))];
                const currentTallaSeleccionada = selectedVariants[descripcion]?.talla || tallasUnicas[0];
                const coloresFiltradosPorTalla = availableVariants.filter(v => v.talla === currentTallaSeleccionada).map(v => v.color);
                const currentColorSeleccionado = selectedVariants[descripcion]?.color || coloresFiltradosPorTalla[0];
                const activeProductMatch = availableVariants.find(v => v.talla === currentTallaSeleccionada && v.color === currentColorSeleccionado) || availableVariants[0];
                const selectedQty = quantities[descripcion] || 1;

                return (
                  <div className="product-card" key={descripcion}>
                    <img src={activeProductMatch.imagen || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'} alt={descripcion} className="product-img" />
                    <div className="product-info">
                      <h3>{descripcion}</h3>
                      <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Talla:</label>
                          <select value={currentTallaSeleccionada} onChange={(e) => handleVariantChange(descripcion, 'talla', e.target.value, availableVariants)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            {tallasUnicas.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Color:</label>
                          <select value={currentColorSeleccionado} onChange={(e) => handleVariantChange(descripcion, 'color', e.target.value, availableVariants)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                            {coloresFiltradosPorTalla.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <p className="product-price">${activeProductMatch.precio_mayorista.toLocaleString('es-CO')} COP</p>
                      <p className="product-stock-status">{activeProductMatch.stock <= 0 ? <span style={{ color: '#c62828', fontWeight: 'bold' }}>Sin existencias</span> : `Disponibles: ${activeProductMatch.stock} unidades`}</p>
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px' }}>
                          <button onClick={() => handleQuantityChange(descripcion, -1, activeProductMatch.stock)} style={{ padding: '5px 10px', background: '#eee', border: 'none' }}>-</button>
                          <span style={{ padding: '0 10px', fontWeight: 'bold' }}>{selectedQty}</span>
                          <button onClick={() => handleQuantityChange(descripcion, 1, activeProductMatch.stock)} style={{ padding: '5px 10px', background: '#eee', border: 'none' }}>+</button>
                        </div>
                        <button onClick={() => addToCart(descripcion, availableVariants)} className="btn-success" style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }} disabled={activeProductMatch.stock <= 0}>
                          {activeProductMatch.stock <= 0 ? 'Agotado' : 'Añadir al Carrito'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* VISTA 2: HISTORIAL Y LÍNEA DE TIEMPO */}
        {view === 'orders_history' && (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px' }}>
            <h2 className="section-title">📦 Estado y Seguimiento de mis Pedidos</h2>
            {myOrders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', marginTop: '30px' }}>Aún no has realizado pedidos con esta cuenta.</p>
            ) : (
              myOrders.map((ord) => {
                const currentStepIdx = PASOS_LINEA_TIEMPO.indexOf(ord.estado);

                return (
                  <div key={ord.id_pedido} style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', marginBottom: '25px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', borderBottom: '2px solid #f5f5f5', paddingBottom: '12px', marginBottom: '15px' }}>
                      <div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#111' }}>Código: {ord.id_pedido}</span>
                        <div style={{ fontSize: '0.85rem', color: '#757575', marginTop: '4px' }}>Fecha Operación: {ord.fecha}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#2e7d32' }}>${ord.total.toLocaleString('es-CO')} COP</span>
                        <div style={{ fontSize: '0.85rem', color: '#616161' }}>Destino: {ord.shipping.municipio} ({ord.shipping.departamento})</div>
                      </div>
                    </div>

                    {/* TIMELINE VISUAL */}
                    <div style={{ margin: '30px 0 25px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', top: '15px', left: '5%', right: '5%', height: '4px', backgroundColor: '#e0e0e0', zIndex: 1 }}></div>
                        <div style={{ position: 'absolute', top: '15px', left: '5%', width: `${(currentStepIdx / (PASOS_LINEA_TIEMPO.length - 1)) * 90}%`, height: '4px', backgroundColor: '#2e7d32', zIndex: 2, transition: 'width 0.4s ease' }}></div>

                        {PASOS_LINEA_TIEMPO.map((stepName, idx) => {
                          const isCompleted = idx <= currentStepIdx;
                          const isCurrent = idx === currentStepIdx;

                          return (
                            <div key={stepName} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 3, width: '20%' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: isCompleted ? '#2e7d32' : '#fff',
                                border: isCurrent ? '4px solid #81c784' : '3px solid #e0e0e0',
                                color: isCompleted ? '#fff' : '#9e9e9e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}>
                                {isCompleted ? '✓' : idx + 1}
                              </div>
                              <span style={{ fontSize: '0.8rem', marginTop: '8px', fontWeight: isCurrent ? 'bold' : 'normal', color: isCurrent ? '#2e7d32' : '#616161', textAlign: 'center' }}>
                                {stepName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f9f9f9', borderRadius: '6px', padding: '12px 15px', marginTop: '15px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '8px' }}>ARTÍCULOS SOLICITADOS:</span>
                      {ord.productos.map((prod, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0', borderBottom: pIdx < ord.productos.length - 1 ? '1px dashed #e0e0e0' : 'none' }}>
                          <div>
                            <span style={{ fontWeight: '500' }}>{prod.descripcion}</span>
                            <span style={{ fontSize: '0.75rem', color: '#777', marginLeft: '8px' }}>[Talla: {prod.talla} | Color: {prod.color}]</span>
                          </div>
                          <div style={{ color: '#333' }}>
                            {prod.quantity} unds x ${prod.precio_mayorista.toLocaleString('es-CO')}
                          </div>
                        </div>
                      ))}
                      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #e0e0e0' }}>
                        📍 <strong>Dirección de entrega:</strong> {ord.shipping.direccion} | {ord.shipping.indicaciones || 'Sin indicaciones adicionales.'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* VISTA 3: CARRITO DE COMPRAS / CHECKOUT */}
        {view === 'checkout' && (
          <div className="checkout-grid">
            <div className="cart-summary-box">
              <h3>Resumen de Compra</h3>
              {cart.length === 0 ? (
                <p>El carrito está vacío.</p>
              ) : (
                cart.map((item) => (
                  <div className="cart-item" key={item.id_producto}>
                    <div>
                      <strong>{item.descripcion}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Talla: {item.talla} | Color: {item.color}</div>
                      <div>${item.precio_mayorista.toLocaleString('es-CO')} x {item.quantity}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="number" min="1" value={item.quantity} onChange={(e) => updateCartItemQty(item.id_producto, e.target.value, item.stock)} style={{ width: '50px', padding: '4px' }} />
                      <button onClick={() => removeFromCart(item.id_producto)} style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontWeight: 'bold' }}>Eliminar</button>
                    </div>
                  </div>
                ))
              )}
              <h4 style={{ marginTop: '20px', textAlign: 'right', fontSize: '1.2rem' }}>Total: ${totalCart.toLocaleString('es-CO')} COP</h4>
              
              {/* ⚠️ ALERTA VISUAL DE MONTO MÍNIMO DE COMPRA */}
              {!cumpleMinimoCompra && cart.length > 0 && (
                <div style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', marginTop: '15px', borderLeft: '5px solid #ff9800', fontWeight: 'bold' }}>
                  🚫 Pedido mínimo para mayoristas: $200,000 COP. Te hacen falta ${(MINIMO_COMPRA_MAYORISTA - totalCart).toLocaleString('es-CO')} COP para poder tramitar la orden.
                </div>
              )}
            </div>

            <div className="card-form">
              <h3>Datos de Envío y Despacho</h3>
              <form onSubmit={proceedToCheckoutWorkflow} className="grid-form">
                
                <div className="form-group">
                  <label>Tipo de Persona (*):</label>
                  <select name="tipoPersona" value={shippingData.tipoPersona} onChange={handleInputChange} required>
                    <option value="Natural">Persona Natural</option>
                    <option value="Juridica">Persona Jurídica / Empresa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Documento de Identidad / NIT (*):</label>
                  <input type="text" name="documentoIdentidad" value={shippingData.documentoIdentidad} onChange={handleInputChange} placeholder="CC o NIT sin puntos" required />
                </div>

                {shippingData.tipoPersona === 'Juridica' && (
                  <div className="form-group">
                    <label>Razón Social (*):</label>
                    <input type="text" name="razonSocial" value={shippingData.razonSocial} onChange={handleInputChange} placeholder="Nombre de la empresa" required />
                  </div>
                )}

                <div className="form-group">
                  <label>Departamento (*):</label>
                  <select name="departamento" value={shippingData.departamento} onChange={handleDepartamentoChange} required>
                    {Object.keys(colombiaLogistica).map(depto => <option key={depto} value={depto}>{depto}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Municipio / Ciudad (*):</label>
                  <select name="municipio" value={shippingData.municipio} onChange={handleInputChange} required>
                    {colombiaLogistica[shippingData.departamento].map(muni => <option key={muni} value={muni}>{muni}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Dirección de Entrega (*):</label>
                  <input type="text" name="direccion" value={shippingData.direccion} onChange={handleInputChange} placeholder="Calle, Carrera, Número, Barrio" required />
                </div>

                <div className="form-group">
                  <label>Indicaciones Adicionales:</label>
                  <input type="text" name="indicaciones" value={shippingData.indicaciones} onChange={handleInputChange} placeholder="Apto, Casa, etc." />
                </div>
                
                <div className="form-group">
                  <label>Método de Pago Preferido (*):</label>
                  <select name="metodoPago" value={shippingData.metodoPago} onChange={handleInputChange} required>
                    <option value="contraentrega">Efectivo Contraentrega (Nacional)</option>
                    <option value="pse">PSE - Débito Bancario Directo</option>
                    <option value="transferencia">Transferencia Bancaria Directa</option>
                  </select>
                </div>

                {/* 🏦 LISTADO EXTENSO DE BANCOS COLOMBIANOS (OBLIGATORIO SI ES PSE O TRANSFERENCIA) */}
                {(shippingData.metodoPago === 'pse' || shippingData.metodoPago === 'transferencia') && (
                  <div className="form-group">
                    <label>Seleccione su Banco (*):</label>
                    <select name="bancoSeleccionado" value={shippingData.bancoSeleccionado} onChange={handleInputChange} required>
                      <option value="">-- Seleccione una entidad --</option>
                      <option value="bogota">Banco de Bogotá</option>
                      <option value="popular">Banco Popular</option>
                      <option value="corpbanca">Banco Itaú (antiguo Corpbanca)</option>
                      <option value="bancolombia">Bancolombia</option>
                      <option value="occidente">Banco de Occidente</option>
                      <option value="villas">Banco AV Villas</option>
                      <option value="cajasocial">Banco Caja Social</option>
                      <option value="agrario">Banco Agrario de Colombia</option>
                      <option value="davivienda">Banco Davivienda</option>
                      <option value="bbva">BBVA Colombia</option>
                      <option value="gnb">GNB Sudameris</option>
                      <option value="pichincha">Banco Pichincha</option>
                      <option value="bancamia">Bancamía</option>
                      <option value="w">Banco W</option>
                      <option value="nequi">Nequi</option>
                      <option value="daviplata">Daviplata</option>
                      <option value="scotiabank">Scotiabank Colpatria</option>
                    </select>
                  </div>
                )}

                <button 
                  type="submit"
                  className="btn-primary" 
                  style={{ 
                    marginTop: '15px', 
                    backgroundColor: cumpleMinimoCompra ? '#2e7d32' : '#9e9e9e', 
                    cursor: cumpleMinimoCompra ? 'pointer' : 'not-allowed',
                    opacity: cumpleMinimoCompra ? 1 : 0.7,
                    width: '100%'
                  }} 
                  disabled={cart.length === 0 || !cumpleMinimoCompra}
                >
                  {cumpleMinimoCompra ? 'Confirmar y Tramitar Pedido Mayorista' : 'Monto Mínimo Insuficiente ($200,000)'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerStore;