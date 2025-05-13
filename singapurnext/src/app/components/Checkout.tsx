'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const total = searchParams.get('total'); // Obtiene el total desde la query string
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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
      } catch (err) {
        console.error('Error cargando carrito:', err);
      }
    };

    fetchCart();
  }, []);

  const handlePayment = async () => {
    // Aquí integrarías la pasarela de pagos
    console.log('Iniciar proceso de pago...');
    alert('Aquí se iniciaría el proceso con la pasarela de pago.');
  };

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
          <h2>Total: ${total}</h2>
          <button className="btn-pay" onClick={handlePayment}>
            Pagar ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
