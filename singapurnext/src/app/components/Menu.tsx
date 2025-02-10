// Menu.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importa el hook useRouter
import styles from '../menu/page.module.css'; // Importa el archivo CSS Modules
import { products } from '../../../public/data/product'; // Importa los productos desde el archivo JSON

interface Product {
  product_id: string;
  name: string;
  price: number;
  discount: number;
  category: string;
  image: string;
  size: string[];
  color: string[];
  description?: string;
}

const Menu: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    // Filtra los productos según la categoría seleccionada
    const filtered = selectedCategory === 'Todos'
      ? products
      : products.filter(product => product.category === selectedCategory);
    setFilteredProducts(filtered);
  }, [selectedCategory]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleProductClick = (productId: string) => {
    // Ahora solo pasamos el product_id
    router.push(`/product?id=${productId}`);
  };

  const handleViewAllClick = () => {
    router.push('/menu');
  };

  return (
    <div className={`${styles['menu-container']} ${styles['menu-page']}`}>
      <div className={styles['filter-and-button-container']}>
        <div className={styles['filter-container']}>
          <label htmlFor="filter" className={styles['filter-label']}>Filtrar por:</label>
          <select
            id="filter"
            className={styles['filter-select']}
            value={selectedCategory}
            onChange={handleFilterChange}
          >
            <option value="Todos">Todos</option>
            <option value="Deportivo">Deportivo</option>
            <option value="Casual">Casual</option>
            <option value="Ropa">Ropa</option>
            {/* Agrega más categorías si es necesario */}
          </select>
        </div>
        <button className={styles['view-all-button']} onClick={handleViewAllClick}>
          Ver Todo
        </button>
      </div>

      <div className={styles['product-grid']}>
        {filteredProducts.map((product) => (
          <div
            key={product.product_id}
            className={styles['product-card']}
            onClick={() => handleProductClick(product.product_id)} // Aquí pasamos solo el product_id
          >
            <img src={product.image} alt={product.name} className={styles['product-image']} />
            <div className={styles['product-details']}>
              <h3 className={styles['product-name']}>{product.name}</h3>
              <p className={styles['product-price']}>
                ${product.price.toLocaleString('es-CO')}
              </p>
              {product.discount > 0 && (
                <p className={styles['product-discount']}>
                  Descuento: {Math.round(product.discount * 100)}%
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;