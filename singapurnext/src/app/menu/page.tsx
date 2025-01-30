'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importa el hook useRouter
import styles from './page.module.css'; // Importa el archivo CSS Modules

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  category: string;
  subcategory: string;
  gender: string;
  image: string;
  sizes?: string[];
  colors?: string[];
  description?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Zapato Deportivo",
    price: 120000,
    discount: 20,
    category: "Deportivo",
    subcategory: "calzado",
    gender: "mujer",
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/d3123e79-53e5-4a03-aa5b-fbc5c18b9bfd/WMNS+AIR+JORDAN+1+LOW.png",
  },
  {
    id: 2,
    name: "Zapato Casual",
    price: 95000,
    discount: 0,
    category: "Casual",
    subcategory: "calzado",
    gender: "hombre",
    image: "https://via.placeholder.com/150",
  },
  // Agrega más productos aquí
];

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

  const handleProductClick = (product: Product) => {
    const productQuery = encodeURIComponent(JSON.stringify(product));
    router.push(`/product?product=${productQuery}`);
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
            <option value="Formal">Formal</option>
          </select>
        </div>
        <button className={styles['view-all-button']} onClick={handleViewAllClick}>
          Ver Todo
        </button>
      </div>

      <div className={styles['product-grid']}>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={styles['product-card']}
            onClick={() => handleProductClick(product)}
          >
            <img src={product.image} alt={product.name} className={styles['product-image']} />
            <div className={styles['product-details']}>
              <h3 className={styles['product-name']}>{product.name}</h3>
              <p className={styles['product-price']}>
                ${product.price.toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;