'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

const API_URL = 'http://localhost:8082';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect') || '/';

  // Cambiar entre registrar e iniciar sesión
  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
  };

  // Manejar cambios en los inputs
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (isRegistering && formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    console.log("Enviando", formData);
  
    try {
      const endpoint = isRegistering ? `${API_URL}/api/users` : `${API_URL}/api/auth/login`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(isRegistering && {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
          }),
        }),
      });
  
      const data = await response.json(); // Aquí obtenemos la respuesta correctamente
  
      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas'); // Ahora mostramos el error real
      }
  
      if (!isRegistering) {
        const token = data.token; // Aquí extraemos el token del body
        if (!token) {
          throw new Error('No se recibió un token válido');
        }
  
        localStorage.setItem('token', token);
        router.push(redirectUrl);
      } else {
        alert('Usuario registrado exitosamente');
        setIsRegistering(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };
  
  

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <h2>{isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Ingrese su nombre"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Ingrese su apellido"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ingrese su teléfono"
                  required
                />
              </div>
            </>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese su correo"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          {isRegistering && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme su contraseña"
                required
              />
            </div>
          )}
          <button type="submit" className={styles.btnPrimary}>
            {isRegistering ? 'Registrar' : 'Iniciar Sesión'}
          </button>
        </form>
        <p className={styles.toggleText}>
          {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
          <span onClick={toggleRegister} className={styles.toggleLink}>
            {isRegistering ? ' Inicia Sesión' : ' Regístrate'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
