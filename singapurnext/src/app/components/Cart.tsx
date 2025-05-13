// Cart.tsx
import React, { useEffect, useRef } from 'react';
import './Cart.css';
import { useRouter } from 'next/navigation';


interface CartItem {
  id: string;  // Asegúrate de tener un identificador único para cada item
  image: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onClose: () => void;
}

const API_URL = 'http://localhost:8082/api/cart';

const Cart: React.FC<CartProps> = ({ cartItems, setCartItems, onClose }) => {
  const cartRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();


  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // 🛠️ Eliminar producto del carrito y backend
  const removeItem = async (itemId: string) => {
    // Eliminar del backend
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      console.warn('Falta userId o token');
      return;
    }

    try {
        const res = await fetch(`${API_URL}/remove/${itemId}`, {
            method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!res.ok) {
        throw new Error('Error al eliminar el producto del carrito');
      }

      // Eliminar del estado local (frontend)
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);

    } catch (error) {
      console.error('Error eliminando el producto:', error);
    }
  };

  return (
    <div className="cart-overlay">
      <div ref={cartRef} className="cart-container">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Tu carrito 🎀</h2>
        <ul className="cart-items">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p>Talla: {item.size}</p>
                <p>Color: {item.color}</p>
                <p>${item.price.toFixed(2)}</p>
                <div className="quantity-selector">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button className="btn-remove" onClick={() => removeItem(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
        <div className="cart-summary">
          <p>Total: ${totalPrice.toFixed(2)}</p>
          <button className="btn-checkout" onClick={() => {
            router.push(`/checkout?total=${totalPrice.toFixed(2)}`);
            onClose(); // Cierra el carrito visualmente
            }}>
            Ir a Pagar
            </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
