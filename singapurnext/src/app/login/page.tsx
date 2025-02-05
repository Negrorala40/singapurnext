'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        confirmPassword: '',
    });
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams?.get('redirect') || '/';

    // Cambiar entre iniciar sesión y registrar
    const toggleRegister = () => {
        setIsRegistering(!isRegistering);
        setFormData({ email: '', password: '', username: '', confirmPassword: '' });
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

        // Aquí iría la lógica para enviar los datos a una API
        console.log('Formulario enviado:', formData);

        // Redirigir después del envío
        router.push(redirectUrl);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.formContainer}>
                <h2>{isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}</h2>
                <form onSubmit={handleSubmit}>
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
                        <>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Ingrese su nombre de usuario"
                                    required
                                />
                            </div>
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
                        </>
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