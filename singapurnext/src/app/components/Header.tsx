'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import './Header.css';

interface CartItem {
  image: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

interface HeaderProps {
  cartItems?: CartItem[];
  setCartItems?: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const Header: React.FC<HeaderProps> = ({ cartItems = [], setCartItems }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSubmenu = (menu: string) => setSubmenuOpen(submenuOpen === menu ? null : menu);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleCart = () => setCartOpen(!cartOpen);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (setCartItems) {
      setCartItems(storedCart);
    }
  }, [setCartItems]);

  useEffect(() => {
    if (setCartItems) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

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

  const removeItem = (index: number) => {
    if (setCartItems) {
      const updatedCart = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedCart);
    }
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (setCartItems) {
      const updatedCart = cartItems.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      setCartItems(updatedCart);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const goToCheckout = () => {
    setCartOpen(false);
    const query = new URLSearchParams({
      cartItems: JSON.stringify(cartItems),
      totalPrice: totalPrice.toString()
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
        <div ref={cartRef} className="cart-overlay">
          <div className="cart-container">
            <button className="close-btn" onClick={toggleCart}>X</button>
            <h2>Carrito de Compras</h2>
            <ul className="cart-items">
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p>Talla: {item.size}</p>
                    <p>Color: {item.color}</p>
                    <p>${item.price.toFixed(2)}</p>
                    <div className="quantity-selector">
                      <button onClick={() => updateQuantity(index, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="btn-remove" onClick={() => removeItem(index)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <div className="cart-summary">
              <p>Total: ${totalPrice.toFixed(2)}</p>
              <button className="btn btn-checkout" onClick={goToCheckout}>Ir a Pagar</button>
            </div>
          </div>
        </div>
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
