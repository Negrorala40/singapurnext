'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { products } from '../../../public/data/product';
import styles from '../product/page.module.css';

const Product: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  const product = products.find(p => p.product_id === productId);

  if (!product) {
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
      // Crear el objeto del producto con las opciones seleccionadas
      const cartItem = { ...product, selectedSize, selectedColor, quantity };

      // Obtener el carrito del localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');

      // Añadir el nuevo producto al carrito
      cart.push(cartItem);

      // Guardar el carrito actualizado en localStorage
      localStorage.setItem('cart', JSON.stringify(cart));

      // Redirigir al menú con los filtros actuales
      const queryParams = new URLSearchParams(searchParams.toString()); // Usar los filtros actuales
      router.push(`/menu?${queryParams.toString()}`); // Redirige a la página del menú con los filtros aplicados

      alert('Producto agregado al carrito');
    } else {
      alert('Por favor selecciona talla y color');
    }
  };

  return (
    <div className={styles.product}>
      <img src={product.image} alt={product.name} className={styles['product-image']} />
      <div className={styles['product-info']}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className={styles['product-price']}>
          ${product.price.toLocaleString('es-CO')}
        </p>

        <div className={styles['product-options']}>
          <div className={styles['size-selector']}>
            <label>Talla:</label>
            <select value={selectedSize} onChange={handleSizeChange}>
              <option value="">Selecciona una talla</option>
              {product.size.map((size) => (
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
              {product.color.map((color) => (
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
              max={product.quantity} // Limitar según el stock disponible
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