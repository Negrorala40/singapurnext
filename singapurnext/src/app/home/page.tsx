'use client';

import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';

const Home = () => {
    return (
        <div>
            <main>
                {/* Contenedor horizontal para Destacados y Descuentos */}
                <div className={styles['horizontal-container']}>
                    {/* Sección Destacados */}
                    <section id="destacados" className={styles.destacados}>
                        <div className="container">
                            <h2>Destacados</h2>
                            <p>Conoce nuestras piezas más exclusivas.</p>
                        </div>
                    </section>

                    {/* Sección Descuentos */}
                    <Link href="/menu?filter=descuento" className={styles['link-completo']}>
                        <section id="descuentos" className={styles.descuentos}>
                            <div className="container">
                                <h2>Descuentos</h2>
                                <p>Aprovecha nuestras ofertas especiales.</p>
                            </div>
                        </section>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Home;