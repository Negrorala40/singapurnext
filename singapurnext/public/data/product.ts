// public/data/product.ts

export const products = [
  {
    product_id: "001",
    name: "Camiseta Básica de Algodón",
    description: "Camiseta de algodón suave, perfecta para el uso diario. Disponible en varios colores y tallas.",
    price: 19.99,
    discount: 0.15,
    size: ["S", "M", "L", "XL"],
    color: ["Rojo", "Azul", "Negro", "Blanco"],
    quantity: 50,
    image: "https://www.ejemplo.com/images/camiseta_basica_algodon.jpg",
    category: "Ropa",
    brand: "MarcaX",
    sku: "CAM12345",
    tags: ["camiseta", "algodón", "básica", "moda"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío estándar",
      delivery_time: "3-5 días hábiles"
    }
  },
  {
    product_id: "002",
    name: "Zapato Deportivo",
    description: "Zapatos deportivos para correr. Ligero y cómodo.",
    price: 120.00,
    discount: 0.10,
    size: ["38", "39", "40", "41", "42"],
    color: ["Negro", "Azul", "Gris"],
    quantity: 30,
    image: "https://www.example.com/images/zapato_deportivo.jpg",
    category: "Deportivo",
    brand: "MarcaY",
    sku: "ZAP12345",
    tags: ["deportivo", "zapato", "correr"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío rápido",
      delivery_time: "2-3 días hábiles"
    }
  },
  {
    product_id: "003",
    name: "Pantalón de Jogging",
    description: "Pantalón de jogging cómodo para hacer ejercicio o para usar en casa.",
    price: 29.99,
    discount: 0.05,
    size: ["M", "L", "XL"],
    color: ["Gris", "Negro"],
    quantity: 40,
    image: "https://www.ejemplo.com/images/pantalon_jogging.jpg",
    category: "Ropa",
    brand: "MarcaZ",
    sku: "PAN12345",
    tags: ["pantalón", "jogging", "deporte"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío estándar",
      delivery_time: "3-5 días hábiles"
    }
  },
  {
    product_id: "004",
    name: "Chaqueta de Cuero",
    description: "Chaqueta de cuero de alta calidad, ideal para días fríos.",
    price: 149.99,
    discount: 0.20,
    size: ["M", "L"],
    color: ["Negro", "Marrón"],
    quantity: 25,
    image: "https://www.ejemplo.com/images/chaqueta_cuero.jpg",
    category: "Ropa",
    brand: "MarcaA",
    sku: "CHA12345",
    tags: ["chaqueta", "cuero", "frío"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío rápido",
      delivery_time: "2-3 días hábiles"
    }
  },
  {
    product_id: "005",
    name: "Camiseta Deportiva",
    description: "Camiseta ligera para entrenamientos. Alta transpirabilidad.",
    price: 15.99,
    discount: 0.10,
    size: ["S", "M", "L", "XL"],
    color: ["Blanco", "Negro", "Azul"],
    quantity: 60,
    image: "https://www.ejemplo.com/images/camiseta_deportiva.jpg",
    category: "Deportivo",
    brand: "MarcaB",
    sku: "CAM54321",
    tags: ["camiseta", "deporte", "entrenamiento"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío estándar",
      delivery_time: "3-5 días hábiles"
    }
  },
  {
    product_id: "006",
    name: "Sudadera con Capucha",
    description: "Sudadera cómoda con capucha, ideal para el invierno.",
    price: 39.99,
    discount: 0.15,
    size: ["M", "L", "XL"],
    color: ["Azul", "Negro", "Rojo"],
    quantity: 35,
    image: "https://www.ejemplo.com/images/sudadera_capucha.jpg",
    category: "Ropa",
    brand: "MarcaC",
    sku: "SUD12345",
    tags: ["sudadera", "invierno", "capucha"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío rápido",
      delivery_time: "2-3 días hábiles"
    }
  },
  {
    product_id: "007",
    name: "Bañador Deportivo",
    description: "Bañador diseñado para nadadores, cómodo y duradero.",
    price: 25.99,
    discount: 0.05,
    size: ["S", "M", "L"],
    color: ["Azul", "Negro", "Verde"],
    quantity: 50,
    image: "https://www.ejemplo.com/images/banador_deportivo.jpg",
    category: "Deportivo",
    brand: "MarcaD",
    sku: "BAN12345",
    tags: ["bañador", "deporte", "natación"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío estándar",
      delivery_time: "3-5 días hábiles"
    }
  },
  {
    product_id: "008",
    name: "Botas de Invierno",
    description: "Botas de invierno resistentes, perfectas para el clima frío.",
    price: 89.99,
    discount: 0.10,
    size: ["38", "39", "40", "41", "42"],
    color: ["Negro", "Marrón"],
    quantity: 20,
    image: "https://www.ejemplo.com/images/botas_invierno.jpg",
    category: "Calzado",
    brand: "MarcaE",
    sku: "BOT12345",
    tags: ["botas", "invierno", "resistentes"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío rápido",
      delivery_time: "2-3 días hábiles"
    }
  },
  {
    product_id: "009",
    name: "Zapatillas Running",
    description: "Zapatillas de running con gran soporte y amortiguación.",
    price: 99.99,
    discount: 0.20,
    size: ["39", "40", "41", "42"],
    color: ["Negro", "Rojo", "Azul"],
    quantity: 15,
    image: "https://www.ejemplo.com/images/zapatillas_running.jpg",
    category: "Deportivo",
    brand: "MarcaF",
    sku: "ZAP67890",
    tags: ["zapatillas", "running", "deporte"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío rápido",
      delivery_time: "2-3 días hábiles"
    }
  },
  {
    product_id: "010",
    name: "Chaqueta Impermeable",
    description: "Chaqueta impermeable para protegerte en días lluviosos.",
    price: 59.99,
    discount: 0.25,
    size: ["S", "M", "L"],
    color: ["Negro", "Azul", "Verde"],
    quantity: 40,
    image: "https://www.ejemplo.com/images/chaqueta_impermeable.jpg",
    category: "Ropa",
    brand: "MarcaG",
    sku: "CHA67890",
    tags: ["chaqueta", "impermeable", "lluvia"],
    availability: "in_stock",
    shipping_info: {
      shipping_method: "Envío estándar",
      delivery_time: "3-5 días hábiles"
    }
  }
];
