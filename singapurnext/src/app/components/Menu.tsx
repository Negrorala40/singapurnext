'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import styles from '../menu/page.module.css';

interface Img {
  id: number;
  fileName: string;
  imageUrl: string;
}

interface ProductVariant {
  id: number;
  color: string;
  size: string;
  stock: number;
  price?: number;
  images: Img[];
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
  variants: ProductVariant[];
}

const Menu: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>('');

  const API_URL = 'http://localhost:8082/api/products';

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

  const filteredProducts = products.filter((product) => {
    const matchesGender = !genderQuery || product.gender.toLowerCase() === genderQuery.toLowerCase();
    const matchesType = !typeQuery || product.type.toLowerCase() === typeQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGender && matchesType && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.variants[0]?.price || 0;
    const bPrice = b.variants[0]?.price || 0;

    switch (sortOption) {
      case 'price-asc':
        return aPrice - bPrice;
      case 'price-desc':
        return bPrice - aPrice;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleProductClick = (productId: number) => {
    router.push(`/product?id=${productId}`);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className={`${styles['menu-container']} ${styles['menu-page']}`}>
      <div className={styles['filter-and-button-container']}>
        <div className={styles['filter-container']}>
          <label htmlFor="sort" className={styles['filter-label']}>Ordenar por:</label>
          <select id="sort" className={styles['filter-select']} value={sortOption} onChange={handleSortChange}>
            <option value="">-- Selecciona --</option>
            <option value="price-asc">Precio: Menor a mayor</option>
            <option value="price-desc">Precio: Mayor a menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
          </select>
        </div>
      </div>

      <div className={styles['product-grid']}>
        {sortedProducts.slice(0, visibleCount).length === 0 ? (
          <p>No se encontraron productos que coincidan con los criterios seleccionados.</p>
        ) : (
          sortedProducts.slice(0, visibleCount).map((product) => {
            // Obtener la primera imagen de la primera variante como imagen principal
            const primaryImage = product.variants[0]?.images?.[0]?.imageUrl || '/placeholder.png';
            const price = product.variants.length > 0
              ? Math.min(...product.variants.map(v => Number(v.price || 0)))
              : 0;

            return (
              <div
                key={product.id}
                className={styles['product-card']}
                onClick={() => handleProductClick(product.id)}
              >
                <Image
                  src={primaryImage}
                  alt={product.name}
                  width={240}
                  height={240}
                  className={styles['product-image']}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10px' }}
                />
                <div className={styles['product-details']}>
                  <h3 className={styles['product-name']}>{product.name}</h3>
                  <p className={styles['product-price']}>
                    {price > 0 ? `$${price.toLocaleString('es-CO')}` : 'Precio no disponible'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {visibleCount < sortedProducts.length && (
        <button className={styles['view-all-button']} onClick={handleShowMore}>
          Mostrar más
        </button>
      )}
    </div>
  );
};

export default Menu;
