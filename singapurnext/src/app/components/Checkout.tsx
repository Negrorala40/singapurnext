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
  stock?: number;
}

const API_CART_URL = 'http://localhost:8082/api/cart';
const API_SIGNATURE_URL = 'http://localhost:8082/api/bold/signature';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

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

  useEffect(() => {
    const fetchCartAndSignature = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const resCart = await fetch(API_CART_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!resCart.ok) throw new Error('Error al obtener el carrito');
        const data = await resCart.json();

        const items: CartItem[] = data.map((item: any) => ({
          id: item.id,
          image: item.imageUrls?.[0] || '/placeholder.png',
          name: item.productName || item.name,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          stock: item.stock || 100,
        }));

        setCartItems(items);
        calculateTotal(items);

        const resSignature = await fetch(API_SIGNATURE_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!resSignature.ok) throw new Error('Error al obtener firma');
        const { orderId, signature, amount } = await resSignature.json();

        setOrderId(orderId);
        setSignature(signature);
        setTotal(amount);
      } catch (err) {
        console.error('❌ Error en Checkout:', err);
      }
    };

    fetchCartAndSignature();
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.stock && newQuantity > item.stock) {
      alert(`No hay suficiente stock disponible (máximo ${item.stock})`);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_CART_URL}/update/${itemId}?quantity=${newQuantity}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Error actualizando cantidad');

      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error('🛑 Error actualizando cantidad:', err);
    }
  };

  const removeItem = async (itemId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_CART_URL}/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Error eliminando el producto');

      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error('🛑 Error eliminando producto:', err);
    }
  };

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
          {cartItems.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="checkout-item">
                <img
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
                <div>
                  <p><strong>{item.name}</strong></p>
                  <p>Talla: {item.size} | Color: {item.color}</p>
                  <p>Precio: ${item.price.toLocaleString('es-CO')}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.stock !== undefined && item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="checkout-summary">
          <h2>Total: ${total.toLocaleString('es-CO')}</h2>
          <div id="bold-button-container" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
