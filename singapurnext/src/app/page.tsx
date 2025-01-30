'use client'; // Esto asegura que el componente se ejecute del lado del cliente

import React, { useState } from 'react';
import Header from './components/Header'; // Importa el componente Header
import Home from './home/page'; // Importa el componente Home
import Menu from './menu/page'; // Importa el componente Menu
import Footer from './components/Footer'; // Importa el componente Footer

const Page: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]); // Tu estado de ejemplo

  return (
    <div>
      <Home />
      <Menu />
    </div>
  );
};

export default Page; // Asegúrate de que el componente se exporte correctamente