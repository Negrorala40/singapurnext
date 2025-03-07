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
  fileType: string;
  data: string; // Base64
}

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  category: string;
  gender: string;
  subcategory: string;
  description?: string;
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
  const API_URL = 'http://localhost:8080/api/products';

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL);
        const transformedProducts = response.data.map((product: Product) => ({
          ...product,
          images: product.images.map((img) => ({
            ...img,
            data: `data:${img.fileType};base64,${img.data}`,
          })),
        }));
        setProducts(transformedProducts);
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
  const subcategoryQuery = searchParams.get('subcategory') || '';

  // Filtrar productos según los parámetros de búsqueda y categoría seleccionada
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesGender = !genderQuery || product.gender.toLowerCase() === genderQuery.toLowerCase();
      const matchesSubcategory = !subcategoryQuery || product.subcategory.toLowerCase() === subcategoryQuery.toLowerCase();
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesGender && matchesSubcategory && matchesCategory && matchesSearch;
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, genderQuery, subcategoryQuery]);

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
            <option value="Deportivo">Deportivo</option>
            <option value="Casual">Casual</option>
            <option value="Ropa">Ropa</option>
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
                src={product.images[0]?.data || '/placeholder.png'} // Mostrar imagen o placeholder si no hay
                alt={product.name}
                className={styles['product-image']}
              />
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
                <div className={styles['variant-info']}>
                  <p className={styles['product-variants']}>
                    Colores: {product.variants.map((v) => v.color).join(', ')}
                  </p>
                  <p className={styles['product-variants']}>
                    Tallas: {product.variants.map((v) => v.size).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;
