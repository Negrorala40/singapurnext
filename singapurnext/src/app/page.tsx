'use client';

import React from 'react';
import Home from './home/page'; // Asegúrate de que la ruta sea correcta
import Menu from './components/Menu';

const Page: React.FC = () => {
  return (
    <div>
      <Home />
      <Menu />
    </div>
  );
};

export default Page;
