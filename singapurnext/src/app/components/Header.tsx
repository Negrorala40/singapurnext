'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import './Header.css';
import Cart from './Cart';

interface CartItem {
  id: string; // Asegúrate de que cada item tenga un ID único
  image: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

const API_URL = 'http://localhost:8082/api/cart';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSubmenu = (menu: string) => setSubmenuOpen(submenuOpen === menu ? null : menu);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleCart = () => setCartOpen(!cartOpen);

  // Eliminar producto desde el carrito
  const removeItem = async (itemId: string) => {
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
        throw new Error('Error al eliminar el producto');
      }

      // Eliminar del carrito en el estado local
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      
    } catch (error) {
      console.error('Error eliminando el producto del carrito:', error);
    }
  };

  // Cargar los items del carrito desde el backend
  useEffect(() => {
    const fetchCartFromBackend = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        console.warn('Falta userId o token');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Error al obtener el carrito');
        const data = await res.json();

        // Adaptamos los datos del carrito
        const adaptedCartItems = data.map((item: any) => ({
          id: item.id, // Asegúrate de que cada producto tenga un id único
          image: item.imageUrls[0] || '/default.png',
          name: item.productName,
          price: parseFloat(item.price),
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        }));

        setCartItems(adaptedCartItems);
      } catch (error) {
        console.error('Error cargando el carrito:', error);
      }
    };

    fetchCartFromBackend();
  }, []);

  // Cerrar el carrito si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setSubmenuOpen(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const goToCheckout = () => {
    setCartOpen(false);
    const query = new URLSearchParams({
      cartItems: JSON.stringify(cartItems),
      totalPrice: totalPrice.toString(),
    }).toString();
    router.push(`/checkout?${query}`);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="btn btn-menu" onClick={toggleMenu}>Menú</button>
        <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className="btn btn-login">
          Usuario
        </Link>
      </div>
      <Link href="/" className="logo">Singapur</Link>
      <div className="header-right">
        {!searchOpen && <button className="btn btn-search" onClick={toggleSearch}>Buscar</button>}
        {searchOpen && (
          <div ref={searchRef} className="search-box">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-submit-btn">Buscar</button>
            </form>
          </div>
        )}
        <button className="btn btn-cart" onClick={toggleCart}>Carrito</button>
      </div>
      {cartOpen && (
        <Cart
          cartItems={cartItems}
          setCartItems={setCartItems}
          onClose={toggleCart}
          onRemove={removeItem} // Pasando la función de eliminar al componente Cart
          onCheckout={goToCheckout}
        />
      )}

      <div ref={menuRef} className={`menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <button className="submenu-toggle" onClick={() => toggleSubmenu('hombre')}>Hombre</button>
            <ul className={`submenu ${submenuOpen === 'hombre' ? 'open' : ''}`}>
              <li><Link href="/menu?gender=hombre&subcategory=superior">Superior</Link></li>
              <li><Link href="/menu?gender=hombre&subcategory=inferior">Inferior</Link></li>
              <li><Link href="/menu?gender=hombre&subcategory=calzado">Calzado</Link></li>
            </ul>
          </li>
          <li>
            <button className="submenu-toggle" onClick={() => toggleSubmenu('mujer')}>Mujer</button>
            <ul className={`submenu ${submenuOpen === 'mujer' ? 'open' : ''}`}>
              <li><Link href="/menu?gender=mujer&subcategory=superior">Superior</Link></li>
              <li><Link href="/menu?gender=mujer&subcategory=inferior">Inferior</Link></li>
              <li><Link href="/menu?gender=mujer&subcategory=calzado">Calzado</Link></li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
