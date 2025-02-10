'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Importa useRouter y useSearchParams
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
  gender: string; // 'hombre' o 'mujer'
  subcategory: string; // 'superior', 'inferior', o 'calzado'
  description?: string;
}

const Menu: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para obtener parámetros de búsqueda en la URL

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Leer los parámetros de búsqueda desde la URL
  const searchQuery = searchParams.get('search') || '';
  const genderQuery = searchParams.get('gender') || ''; // Filtro por género
  const subcategoryQuery = searchParams.get('subcategory') || ''; // Filtro por subcategoría

  useEffect(() => {
    // Filtrar productos según `gender`, `subcategory`, categoría seleccionada y búsqueda
    const filtered = products.filter((product) => {
      const matchesGender =
        !genderQuery || product.gender.toLowerCase() === genderQuery.toLowerCase(); // Coincide con el género

      const matchesSubcategory =
        !subcategoryQuery ||
        product.subcategory.toLowerCase() === subcategoryQuery.toLowerCase(); // Coincide con la subcategoría

      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory; // Coincide con la categoría seleccionada

      const matchesSearch =
        !searchQuery || // Si no hay búsqueda, no filtrar por búsqueda
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Coincide con el nombre
        (product.description &&
          product.description.toLowerCase().includes(searchQuery.toLowerCase())); // Coincide con la descripción

      return matchesGender && matchesSubcategory && matchesCategory && matchesSearch;
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, genderQuery, subcategoryQuery]); // Dependencias: actualiza cuando cambian `gender`, `subcategory`, categoría o búsqueda

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product?id=${productId}`);
  };

  const handleViewAllClick = () => {
    // Restablece los filtros y redirige a /menu sin parámetros adicionales
    setSelectedCategory('Todos');
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
        {filteredProducts.length === 0 ? (
          <p>No se encontraron productos que coincidan con los criterios seleccionados.</p>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className={styles['product-card']}
              onClick={() => handleProductClick(product.product_id)}
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
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;