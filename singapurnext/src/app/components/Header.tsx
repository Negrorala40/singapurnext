'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import './Header.css';
import Cart from './Cart';
import { HiShoppingCart } from "react-icons/hi2";
import { FaUserAstronaut } from "react-icons/fa6";
import {FaBars} from "react-icons/fa6";
import {FaSearch}from "react-icons/fa";

interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSubmenu = (menu: string) =>
    setSubmenuOpen(submenuOpen === menu ? null : menu);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleCart = () => setCartOpen(!cartOpen);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setSubmenuOpen(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderSubmenuLinks = (gender: string) => (
    <ul className={`submenu ${submenuOpen === gender ? 'open' : ''}`}>
      <li>
        <Link href={`/menu?gender=${gender}&type=superior`}>Superior</Link>
      </li>
      <li>
        <Link href={`/menu?gender=${gender}&type=inferior`}>Inferior</Link>
      </li>
      <li>
        <Link href={`/menu?gender=${gender}&type=calzado`}>Calzado</Link>
      </li>
    </ul>
  );

  return (
    <header className="header">
      <div className="header-left">
        <button className="btn btn-menu" onClick={toggleMenu}>
          <FaBars size={20} />
        </button>
        <Link href={`/login?redirect=${encodeURIComponent(pathname)}`} className="btn btn-login">
          <FaUserAstronaut size={25} />
        </Link>
      </div>

      <Link href="/" className="logo" aria-label="Inicio">
        <Image src="/images/AmarteLog.png" alt="Logo Amarte" width={75} height={50} priority />
      </Link>

      <div className="header-right">
        {!searchOpen && (
          <button className="btn btn-search" onClick={toggleSearch}>
            <FaSearch size={30} />
          </button>
        )}

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

        <button className="btn btn-cart" onClick={toggleCart} aria-label="Abrir carrito">
          <HiShoppingCart size={30} />
        </button>
      </div>

      {cartOpen && (
        <Cart
          cartItems={cartItems}
          setCartItems={setCartItems}
          onClose={toggleCart}
        />
      )}

      <div ref={menuRef} className={`menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <button className="submenu-toggle" onClick={() => toggleSubmenu('hombre')}>Hombre</button>
            {renderSubmenuLinks('hombre')}
          </li>
          <li>
            <button className="submenu-toggle" onClick={() => toggleSubmenu('mujer')}>Mujer</button>
            {renderSubmenuLinks('mujer')}
          </li>
          <li>
            <button className="submenu-toggle" onClick={() => toggleSubmenu('unisex')}>Unisex</button>
            {renderSubmenuLinks('unisex')}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
