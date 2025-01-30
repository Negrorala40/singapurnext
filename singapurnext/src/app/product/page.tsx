'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Importa los hooks useRouter y useSearchParams
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

interface ProductProps {
  addToCart: (product: Product) => void;
}

const Product: React.FC<ProductProps> = ({ addToCart }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const product: Product = JSON.parse(searchParams.get('product') || '{}'); // Obtiene el producto desde los parámetros de búsqueda

  // Verifica si el producto está disponible
  if (!product || Object.keys(product).length === 0) {
    return <p>Producto no encontrado. Por favor regresa al menú.</p>;
  }

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColor(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      addToCart({
        ...product,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
      });
    } else {
      alert('Por favor selecciona talla y color');
    }
  };

  return (
    <div className={styles.product}>
      <img src={product.image} alt={product.name} className={styles['product-image']} />
      <div className={styles['product-info']}>
        <h2>{product.name}</h2>
        <p>{product.description || 'Sin descripción disponible.'}</p>
        <p className={styles['product-price']}>
          ${product.price.toLocaleString('es-CO')}
        </p>

        <div className={styles['product-options']}>
          <div className={styles['size-selector']}>
            <label>Talla:</label>
            <select value={selectedSize} onChange={handleSizeChange}>
              <option value="">Selecciona una talla</option>
              {product.sizes?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['color-selector']}>
            <label>Color:</label>
            <select value={selectedColor} onChange={handleColorChange}>
              <option value="">Selecciona un color</option>
              {product.colors?.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div className={styles['quantity-selector']}>
            <label>Cantidad:</label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
            />
          </div>
        </div>

        <button className={styles['btn-add-to-cart']} onClick={handleAddToCart}>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};

export default Product;