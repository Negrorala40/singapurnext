'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Importa los hooks useRouter y useSearchParams
import styles from './page.module.css'; // Importa el archivo CSS Modules

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const router = useRouter(); // Inicializa el hook useRouter
    const searchParams = useSearchParams(); // Inicializa el hook useSearchParams
    const redirectUrl = searchParams.get('redirect') || '/'; // Obtiene la URL de redirección o usa '/' por defecto

    const toggleRegister = () => {
        setIsRegistering(!isRegistering);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Evita el comportamiento por defecto del formulario

        // Aquí puedes agregar la lógica de validación o API para iniciar sesión o registrar al usuario

        // Después de que el usuario se registre o inicie sesión, redirige a la URL de redirección
        router.push(redirectUrl); // Redirige a la URL de redirección
    };

    return (
        <div className={styles['login-container']}>
            <div className={styles['form-container']}>
                <h2>{isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles['form-group']}>
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" id="email" placeholder="Ingrese su correo" required />
                    </div>
                    <div className={styles['form-group']}>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" placeholder="Ingrese su contraseña" required />
                    </div>
                    {isRegistering && (
                        <>
                            <div className={styles['form-group']}>
                                <label htmlFor="username">Nombre de Usuario</label>
                                <input type="text" id="username" placeholder="Ingrese su nombre de usuario" required />
                            </div>
                            <div className={styles['form-group']}>
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirme su contraseña"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <button type="submit" className={styles['btn-primary']}>
                        {isRegistering ? 'Registrar' : 'Iniciar Sesión'}
                    </button>
                </form>
                <p className={styles['toggle-text']}>
                    {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                    <span onClick={toggleRegister} className={styles['toggle-link']}>
                        {isRegistering ? ' Inicia Sesión' : ' Regístrate'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;