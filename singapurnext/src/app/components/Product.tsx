'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../product/page.module.css';

const Product: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [availableStock, setAvailableStock] = useState<number>(0);

  useEffect(() => {
    if (!productId) {
      console.error('No se encontró productId en la URL');
      setError('Producto no encontrado');
      setLoading(false);
      return;
    }

    console.log('Obteniendo producto con ID:', productId);

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8082/api/products/${productId}`);
        if (!response.ok) throw new Error('Producto no encontrado');

        const data = await response.json();
        console.log('Producto recibido:', data);
        setProduct(data);
      } catch (err: any) {
        console.error('Error al obtener producto:', err.message);
        setError(err.message);
      }
    };

    const fetchVariants = async () => {
      try {
        const response = await fetch(`http://localhost:8082/api/product-variants?productId=${productId}`);
        if (!response.ok) throw new Error('No se encontraron variantes del producto');

        const data = await response.json();
        console.log('Variantes recibidas:', data);
        setVariants(data);
      } catch (err: any) {
        console.error('Error al obtener variantes:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchVariants();
  }, [productId]);

  useEffect(() => {
    if (selectedSize && selectedColor) {
      const variant = variants.find(v => v.size === selectedSize && v.color === selectedColor);
      setAvailableStock(variant ? variant.stock : 0);
    }
  }, [selectedSize, selectedColor, variants]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSize(e.target.value);
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedColor(e.target.value);
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value));

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Por favor selecciona talla y color');
      return;
    }
    if (quantity > availableStock) {
      alert('Cantidad seleccionada excede el stock disponible');
      return;
    }

    const cartItem = { ...product, selectedSize, selectedColor, quantity };
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));

    router.push('/menu');
    alert('Producto agregado al carrito');
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Producto no encontrado. Regresa al menú.</p>;

  const availableSizes = [...new Set(variants.map(v => v.size))];
  const availableColors = [...new Set(variants.map(v => v.color))];

  return (
    <div className={styles.product}>
      <img src={product.image} alt={product.name} className={styles['product-image']} />
      <div className={styles['product-info']}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p className={styles['product-price']}>${product.price.toLocaleString('es-CO')}</p>

        <div className={styles['product-options']}>
          <div className={styles['size-selector']}>
            <label>Talla:</label>
            <select value={selectedSize} onChange={handleSizeChange}>
              <option value="">Selecciona una talla</option>
              {availableSizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className={styles['color-selector']}>
            <label>Color:</label>
            <select value={selectedColor} onChange={handleColorChange}>
              <option value="">Selecciona un color</option>
              {availableColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className={styles['quantity-selector']}>
            <label>Cantidad:</label>
            <input type="number" value={quantity} onChange={handleQuantityChange} min="1" max={availableStock} />
            <p>Stock disponible: {availableStock}</p>
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
