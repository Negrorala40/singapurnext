'use client';
import React, { useEffect, useRef } from 'react';
import './Cart.css';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
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

  // Cerrar al hacer clic fuera del carrito
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Cargar carrito desde backend
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Error al obtener el carrito');
        const data = await res.json();

        const transformedItems: CartItem[] = data.map((item: any) => ({
          id: item.id,
          image: item.images?.[0] || '/placeholder.png', // ✅ Manejo seguro de imagen
          name: item.productName,
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        }));

        setCartItems(transformedItems);
      } catch (err) {
        console.error('🛑 Error al cargar el carrito:', err);
      }
    };

    fetchCart();
  }, []);

  // Actualizar cantidad
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/update/${itemId}?quantity=${newQuantity}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Error actualizando cantidad');

      const updatedCart = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
    } catch (err) {
      console.error('🛑 Error actualizando cantidad:', err);
    }
  };

  // Eliminar producto
  const removeItem = async (itemId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Error eliminando el producto');

      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart);
    } catch (err) {
      console.error('🛑 Error eliminando producto:', err);
    }
  };

  return (
    <div className="cart-overlay">
      <div ref={cartRef} className="cart-container">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Tu carrito 🚀</h2>

        {cartItems.length === 0 ? (
          <p className="empty-message">Tu carrito está vacío.</p>
        ) : (
          <>
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
              <button
                className="btn-checkout"
                onClick={() => {
                  router.push('/checkout');
                  onClose();
                }}
              >
                Ir a Pagar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
