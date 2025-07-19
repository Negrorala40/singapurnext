'use client';

import React, { useState, useEffect } from 'react';
import './Perfil.css';

interface Address {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses?: Address[];
}

const API_BASE_URL = 'http://localhost:8082/api/users';

const Perfil = () => {
  const [formData, setFormData] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addresses: [],
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    address: '',
    city: '',
    state: '',
    country: '',
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedAddress, setEditedAddress] = useState<Address | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: authHeaders,
      });

      if (!response.ok) throw new Error('Error al cargar los datos');

      const userData: User = await response.json();
      setFormData(userData);
      setAddresses(userData.addresses || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos del usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleAddAddress = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/me/addresses`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(newAddress),
      });

      if (!response.ok) throw new Error('Error al agregar la dirección');

      setNewAddress({ address: '', city: '', state: '', country: '' });
      await loadUserData();
      setSuccess('Dirección agregada correctamente');
    } catch (err) {
      setError('Error al agregar la dirección');
      console.error(err);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/me/addresses/${addressId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      if (!response.ok) throw new Error('Error al eliminar la dirección');

      await loadUserData();
      setSuccess('Dirección eliminada correctamente');
    } catch (err) {
      setError('Error al eliminar la dirección');
      console.error(err);
    }
  };

  const handleEditAddress = (index: number) => {
    setEditIndex(index);
    setEditedAddress(addresses[index]);
  };

  const handleSaveAddress = async () => {
    if (!editedAddress) return;
    try {
      const response = await fetch(`${API_BASE_URL}/me/addresses/${editedAddress.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(editedAddress),
      });

      if (!response.ok) throw new Error('Error al actualizar la dirección');

      setEditIndex(null);
      setEditedAddress(null);
      await loadUserData();
      setSuccess('Dirección actualizada correctamente');
    } catch (err) {
      setError('Error al actualizar la dirección');
      console.error(err);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        password: '',
      };

      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Error al actualizar');

      const updatedUser = await response.json();
      setFormData(updatedUser);
      setSuccess('Perfil actualizado correctamente');
      setError(null);
    } catch (err) {
      setError('Error al actualizar los datos del usuario');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="perfil-container">
      <h1>🚀 Bienvenido a tu Perfil en <span className="highlight">A Marte</span> 🪐</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <section className="info-section">
        <h2>👩‍🚀 Información Personal</h2>
        <form onSubmit={handleUpdateUser}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={formData.email} disabled />
          </div>
          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              pattern="\d{10,15}"
            />
          </div>
          <button type="submit" className="update-button">Actualizar Información</button>
        </form>
      </section>

      <section className="address-section">
        <h2>📦 Direcciones de Envío</h2>
        {addresses.length > 0 ? (
          <ul className="address-list">
            {addresses.map((addr, index) => (
              <li key={addr.id} className="address-item">
                {editIndex === index && editedAddress ? (
                  <div className="edit-fields">
                    <input
                      value={editedAddress.address}
                      onChange={(e) =>
                        setEditedAddress({ ...editedAddress, address: e.target.value })
                      }
                    />
                    <input
                      value={editedAddress.city}
                      onChange={(e) =>
                        setEditedAddress({ ...editedAddress, city: e.target.value })
                      }
                    />
                    <input
                      value={editedAddress.state}
                      onChange={(e) =>
                        setEditedAddress({ ...editedAddress, state: e.target.value })
                      }
                    />
                    <input
                      value={editedAddress.country}
                      onChange={(e) =>
                        setEditedAddress({ ...editedAddress, country: e.target.value })
                      }
                    />
                    <button onClick={handleSaveAddress} className="save-button">Guardar</button>
                    <button onClick={() => setEditIndex(null)} className="cancel-button">Cancelar</button>
                  </div>
                ) : (
                  <>
                    <p>{addr.address}, {addr.city}, {addr.state}, {addr.country}</p>
                    <div className="address-actions">
                      <button onClick={() => handleEditAddress(index)} className="edit-button">Editar</button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="delete-button">Eliminar</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay direcciones registradas</p>
        )}

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
          <button onClick={handleAddAddress} className="add-button">Agregar dirección</button>
        </div>
      </section>
    </div>
  );
};

export default Perfil;
