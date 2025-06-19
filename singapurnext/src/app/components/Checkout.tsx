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

  // 1. Inyectar el script de Bold (una sola vez)
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

  // 2. Obtener productos del carrito
  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) return;

      try {
        const res = await fetch(`http://localhost:8082/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Error al obtener el carrito');
        const data = await res.json();

        const adaptedItems = data.map((item: any) => ({
          id: item.id,
          name: item.productName,
          image: item.imageUrls[0] || '/default.png',
          price: parseFloat(item.price),
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        }));

        setCartItems(adaptedItems);

        const calculatedTotal = adaptedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(Math.round(calculatedTotal));
      } catch (err) {
        console.error('Error cargando carrito:', err);
      }
    };

    fetchCart();
  }, []);

  // 3. Generar firma al cargar productos
  useEffect(() => {
    if (cartItems.length === 0 || total === 0) return;

    const newOrderId = `ORD-${Date.now()}`;
    setOrderId(newOrderId);

    const generateSignature = async () => {
      try {
        const res = await fetch('http://localhost:8082/api/bold/signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            currency: 'COP',
            orderId: newOrderId,
          }),
        });

        if (!res.ok) throw new Error('Error al generar la firma');

        const data = await res.json();
        setSignature(data.signature);
      } catch (error) {
        console.error('Error generando firma:', error);
      }
    };

    generateSignature();
  }, [cartItems, total]);

  // 4. Insertar botón Bold
  useEffect(() => {
    if (!signature || !orderId) return;

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

      script.setAttribute(
        'data-customer-data',
        JSON.stringify({
          email: 'cliente@correo.com',
          fullName: 'Nombre del Cliente',
          phone: '3001234567',
          dialCode: '+57',
          documentNumber: '123456789',
          documentType: 'CC',
        }),
      );

      script.setAttribute(
        'data-billing-address',
        JSON.stringify({
          address: 'Calle 123 #4-5',
          zipCode: '110111',
          city: 'Bogotá',
          state: 'Cundinamarca',
          country: 'CO',
        }),
      );

      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      container.appendChild(script);
    }
  }, [signature, orderId]);

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
