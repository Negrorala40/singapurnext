'use client';

import { useEffect, useState } from 'react';
import './Checkout.css';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  // 1. Inyectar script de Bold solo una vez
  useEffect(() => {
    const scriptId = 'bold-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      script.async = true;
      script.id = scriptId;
      document.head.appendChild(script);
    }
  }, []);

  // 2. Obtener productos del carrito y firma
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Obtener productos
        const resCart = await fetch('http://localhost:8082/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!resCart.ok) throw new Error('Error al obtener el carrito');
        const cartData = await resCart.json();
        console.log("🛒 Carrito recibido:", cartData);
        setCartItems(cartData);

        // Obtener firma segura desde backend
        const resFirma = await fetch('http://localhost:8082/api/bold/signature', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!resFirma.ok) throw new Error('Error al obtener firma');
        const { orderId, signature, amount } = await resFirma.json();

        setOrderId(orderId);
        setSignature(signature);
        setTotal(amount);

        console.log('🧾 Firma recibida:', { orderId, signature, amount });

      } catch (err) {
        console.error('❌ Error en Checkout:', err);
      }
    };

    fetchData();
  }, []);

  // 3. Montar botón Bold
  useEffect(() => {
    if (!signature || !orderId || total === 0) return;

    const container = document.getElementById('bold-button-container');
    if (container && !container.querySelector('[data-bold-button]')) {
      const script = document.createElement('script');
      script.setAttribute('data-bold-button', 'dark-M');
      script.setAttribute('data-api-key', '-BI64vW_4AMd7AI_cCzzA1KDdVSTsq55Ikrm5Iym1EE');
      script.setAttribute('data-amount', total.toString());
      script.setAttribute('data-currency', 'COP');
      script.setAttribute('data-order-id', orderId);
      script.setAttribute('data-integrity-signature', signature);
      script.setAttribute('data-redirection-url', 'http://localhost:3000/checkout/success');
      script.setAttribute('data-description', 'Compra desde tienda');
      script.setAttribute('data-tax', 'vat-19');

      // Opcional: reemplaza con datos reales del usuario
      script.setAttribute('data-customer-data', JSON.stringify({
        email: 'cliente@correo.com',
        fullName: 'Nombre del Cliente',
        phone: '3001234567',
        dialCode: '+57',
        documentNumber: '123456789',
        documentType: 'CC',
      }));

      script.setAttribute('data-billing-address', JSON.stringify({
        address: 'Calle 123 #4-5',
        zipCode: '110111',
        city: 'Bogotá',
        state: 'Cundinamarca',
        country: 'CO',
      }));

      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      container.appendChild(script);
    }
  }, [signature, orderId, total]);

  return (
    <div className="checkout-page">
      <h1>Finalizar compra</h1>
      <div className="checkout-container">
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <img src={item.image} alt={item.name} width={80} />
              <div>
                <p>{item.name}</p>
                <p>Talla: {item.size} | Color: {item.color}</p>
                <p>Cantidad: {item.quantity}</p>
                <p>Precio: ${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="checkout-summary">
          <h2>Total: ${total.toFixed(2)}</h2>
          <div id="bold-button-container" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
