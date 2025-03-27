'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import styles from '../menu/page.module.css';

interface ProductVariant {
  id: number;
  color: string;
  size: string;
  stock: number;
}

interface Img {
  id: number;
  fileName: string;
  imageUrl: string;
}

enum ProductGender {
  MUJER = 'MUJER',
  HOMBRE = 'HOMBRE',
  UNISEX = 'UNISEX'
}

enum ProductType {
  SUPERIOR = 'SUPERIOR',
  INFERIOR = 'INFERIOR',
  CALZADO = 'CALZADO'
}

interface Product {
  id: number;
  name: string;
  description: string;
  gender: ProductGender;
  type: ProductType;
  price: number;
  variants: ProductVariant[];
  images: Img[];
}

const Menu: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // URL del backend
  const API_URL = 'http://localhost:8082/api/products';

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(API_URL);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const searchQuery = searchParams.get('search') || '';
  const genderQuery = searchParams.get('gender') || '';
  const typeQuery = searchParams.get('type') || '';

  // Filtrar productos según los parámetros de búsqueda y categoría seleccionada
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesGender = !genderQuery || product.gender.toLowerCase() === genderQuery.toLowerCase();
      const matchesType = !typeQuery || product.type.toLowerCase() === typeQuery.toLowerCase();
      const matchesCategory = selectedCategory === 'Todos' || product.type === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGender && matchesType && matchesCategory && matchesSearch;
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, genderQuery, typeQuery]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product?id=${productId}`);
  };

  const handleViewAllClick = () => {
    setSelectedCategory('Todos');
    router.push('/menu');
  };

  if (loading) {
    return <p>Cargando productos...</p>;
  }

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
            <option value="SUPERIOR">Superior</option>
            <option value="INFERIOR">Inferior</option>
            <option value="CALZADO">Calzado</option>
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
              key={product.id}
              className={styles['product-card']}
              onClick={() => handleProductClick(product.id)}
            >
              <img
                src={product.images[0]?.imageUrl || '/placeholder.png'} // Usar la URL de la imagen
                alt={product.name}
                className={styles['product-image']}
              />
              <div className={styles['product-details']}>
                <h3 className={styles['product-name']}>{product.name}</h3>
                <p className={styles['product-price']}>
                ${product.variants.length > 0 
                  ? Math.min(...product.variants.map(v => Number(v.price || 0))).toLocaleString('es-CO') 
                  : 'Precio no disponible'}
              </p>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;
