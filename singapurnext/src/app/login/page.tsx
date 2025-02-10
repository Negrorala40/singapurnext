'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { users as initialUsers, User } from '../../../public/data/users'; // Datos iniciales de usuarios

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
  const [users, setUsers] = useState<User[]>(initialUsers); // Usuarios en el estado
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect') || '/';

  // Cambiar entre iniciar sesión y registrar
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
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isRegistering && formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (isRegistering) {
      // Registrar el nuevo usuario (en el estado)
      const newUser: User = {
        user_id: Math.random().toString(36).substring(7), // Crear un ID aleatorio
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        google_authenticator_secret: "JBSWY3DPEHPK3PXP", // Si se usa Google Authenticator
        is_google_auth_enabled: true,
        address: {
          street: "Calle Principal 123",
          city: "Madrid"
        }
      };
      // Actualizamos el estado con el nuevo usuario
      setUsers([...users, newUser]);
      console.log('Usuario registrado:', newUser);
      alert('Usuario registrado exitosamente');
    } else {
      // Login: Verificar si el usuario existe
      const user = users.find((user) => user.email === formData.email && user.password === formData.password);

      if (user) {
        // Usuario encontrado, redirigir a la página de destino
        console.log('Usuario autenticado:', user);
        router.push(redirectUrl);
      } else {
        // Usuario no encontrado
        alert('Correo electrónico o contraseña incorrectos');
      }
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