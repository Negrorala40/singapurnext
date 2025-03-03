// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import styles from './page.module.css'; // Asegúrate de tener un archivo CSS para estilizar
// import { useCartContext } from '../../context/CartContext'; // Cambia esto si usas otro método para manejar el carrito

// const CheckoutPage: React.FC = () => {
//   const { cartItems, totalPrice } = useCartContext(); // Extraer datos del carrito desde el contexto
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   // Simular llamada a la pasarela de pagos
//   const handlePayment = async () => {
//     setIsLoading(true);

//     try {
//       // Aquí iría la integración con tu pasarela de pagos
//       const paymentResponse = await fetch('/api/payment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           items: cartItems,
//           total: totalPrice,
//         }),
//       });

//       const result = await paymentResponse.json();

//       if (result.success) {
//         // Redirigir a una página de éxito de pago
//         router.push('/success');
//       } else {
//         alert('Hubo un problema con el pago. Inténtalo de nuevo.');
//       }
//     } catch (error) {
//       console.error('Error procesando el pago:', error);
//       alert('Hubo un error al intentar procesar el pago.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles.checkoutContainer}>
//       <h1>Proceso de Pago</h1>
//       <div className={styles.orderSummary}>
//         <h2>Resumen del Pedido</h2>
//         <ul>
//           {cartItems.map((item: { product_id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; quantity: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; price: { toLocaleString: (arg0: string) => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }) => (
//             <li key={item.product_id}>
//               {item.name} x {item.quantity} - ${item.price.toLocaleString('es-CO')}
//             </li>
//           ))}
//         </ul>
//         <h3>Total: ${totalPrice.toLocaleString('es-CO')}</h3>
//       </div>
//       <button
//         className={styles.paymentButton}
//         onClick={handlePayment}
//         disabled={isLoading}
//       >
//         {isLoading ? 'Procesando...' : 'Ir a Pagar'}
//       </button>
//     </div>
//   );
// };

// export default CheckoutPage;
