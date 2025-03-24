'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');
  };

  // Manejar cambios en los inputs
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (isRegistering && formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
 
    try {
      const endpoint = isRegistering ? `${API_URL}/api/users` : `${API_URL}/api/auth/login`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      // Leer la respuesta en texto y luego convertir a JSON
      const responseText = await response.text();
      console.log("Respuesta del servidor:", responseText);
      const data = JSON.parse(responseText);

      if (!response.ok) throw new Error(data.message || 'Error en la autenticación');

      if (!isRegistering) {
        const { token, roles } = data;
        if (!token) throw new Error('No se recibió un token válido');

        // ✅ Priorizar el rol de ADMIN si está presente
        const role = roles.includes('ADMIN') ? 'ADMIN' : roles[0] || 'CUSTOMER';

        // Eliminar el token anterior antes de guardar el nuevo
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        Cookies.remove('token');

// Guardar el nuevo token
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        Cookies.set('token', token, { expires: 1, secure: true });


        // ✅ Redirección según el rol
        if (role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } else {
        alert('Usuario registrado exitosamente');
        toggleRegister();
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <h2>{isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}</h2>
        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">Nombre</label>
                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Apellido</label>
                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Teléfono</label>
                <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </>
          )}
          <div className={styles.formGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange} required />
          </div>
          {isRegistering && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          )}
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Cargando...' : isRegistering ? 'Registrar' : 'Iniciar Sesión'}
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
