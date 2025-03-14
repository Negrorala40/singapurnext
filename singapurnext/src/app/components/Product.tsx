'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../product/page.module.css';

interface Variant {
  id: number;
  color: string;
  size: string;
  stock: number;
  productId: number;
}

interface Image {
  imageUrl: string; // Ajustado para que coincida con el DTO ImgDTO
}

interface Product {
  id: number;
  name: string;
  description: string;
  gender: string;
  type: string;
  price: number;
  images: Image[]; // Lista de imágenes según el backend
  variants: Variant[]; // Lista de variantes disponibles
}

const Product: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [availableStock, setAvailableStock] = useState<number>(0);

  useEffect(() => {
    if (!productId) {
      setError('Producto no encontrado');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8082/api/products/${productId}`);
        if (!response.ok) throw new Error('Producto no encontrado');

        const data: Product = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (selectedSize && selectedColor && product) {
      const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
      setAvailableStock(variant ? variant.stock : 0);
    }
  }, [selectedSize, selectedColor, product]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSize(e.target.value);
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedColor(e.target.value);
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value));

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Por favor selecciona talla y color');
      return;
    }
    if (quantity > availableStock) {
      alert('Cantidad seleccionada excede el stock disponible');
      return;
    }
  
    const userId = localStorage.getItem('userId'); // Obtén el ID del usuario autenticado
    if (!userId) {
      alert('Usuario no identificado. Inicia sesión para agregar al carrito.');
      return;
    }
  
    const variant = product?.variants.find(v => v.size === selectedSize && v.color === selectedColor);
    if (!variant) {
      alert('Variante de producto no encontrada.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8082/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          userId: userId,
          productVariantId: variant.id.toString(),
          quantity: quantity.toString(),
        }),
      });
  
      const data = await response.text();
      if (!response.ok) throw new Error(data);
  
      alert('Producto agregado al carrito con éxito.');
      router.push('/menu'); // Redirigir al usuario
    } catch (err: any) {
      alert('Error al agregar al carrito: ' + err.message);
    }
  };
  

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Producto no encontrado. Regresa al menú.</p>;

  // Filtrar solo las tallas y colores que están disponibles en el backend
  const availableSizes = [...new Set(product.variants.filter(v => v.stock > 0).map(v => v.size))];
  const availableColors = [...new Set(product.variants.filter(v => v.stock > 0).map(v => v.color))];

  return (
    <div className={styles.product}>
      {product.images?.length > 0 && (
        <img src={product.images[0].imageUrl} alt={product.name} className={styles['product-image']} />
      )}

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
