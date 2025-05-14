'use client';

import React, { useState, useEffect } from 'react';
import './Perfil.css'; // Asegúrate de tener este archivo CSS para estilos

interface Address {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
}

const Perfil = () => {
  const [formData, setFormData] = useState({
    firstName: 'Juan',
    lastName: 'Martínez',
    email: 'juan@example.com',
    phone: '3120000000',
  });

  const [addresses, setAddresses] = useState<Address[]>([
    { id: 1, address: 'Calle 1 #123', city: 'Bogotá', state: 'Cundinamarca', country: 'Colombia' },
  ]);

  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
  });

  const handleAddAddress = () => {
    const id = Math.random();
    setAddresses([...addresses, { id, ...newAddress }]);
    setNewAddress({ address: '', city: '', state: '', country: '' });
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <div className="perfil-container">
      <h1>🚀 Bienvenido a tu Perfil en <span className="highlight">A Marte</span> 🪐</h1>

      <section className="info-section">
        <h2>👩‍🚀 Información Personal</h2>
        <p><strong>Nombre:</strong> {formData.firstName} {formData.lastName}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Teléfono:</strong> {formData.phone}</p>
      </section>

      <section className="address-section">
        <h2>📦 Direcciones de Envío</h2>
        <ul>
          {addresses.map((addr) => (
            <li key={addr.id} className="address-item">
              <p>{addr.address}, {addr.city}, {addr.state}, {addr.country}</p>
              <button onClick={() => handleDeleteAddress(addr.id)}>Eliminar</button>
            </li>
          ))}
        </ul>

        <div className="new-address-form">
          <h3>Agregar nueva dirección</h3>
          <input
            type="text"
            placeholder="Dirección"
            value={newAddress.address}
            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Ciudad"
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Departamento"
            value={newAddress.state}
            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
          />
          <input
            type="text"
            placeholder="País"
            value={newAddress.country}
            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
          />
          <button onClick={handleAddAddress}>Agregar dirección</button>
        </div>
      </section>
    </div>
  );
};

export default Perfil;
