"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Admin.module.css";

interface Image {
  fileName: string;
  imageUrl: string;
}

interface Variant {
  color: string;
  size: string;
  stock: number;
  price: number;
  images: Image[];
}

interface Product {
  id?: number;
  name: string;
  description: string;
  gender: string;
  type: string;
  variants: Variant[];
}

const Admin = () => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [type, setType] = useState("");
  const [fileName, setFileName] = useState("");

  // Variante actual (solo una variante editable a la vez)
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);

  // Para edición
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole !== "ADMIN") {
      router.push("/");
    } else {
      setRole(storedRole);
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8082/api/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Error al obtener los productos:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setGender("");
    setType("");
    setColor("");
    setSize("");
    setStock(0);
    setPrice(0);
    setFileName("");
    setImageUrls([""]);
    setEditingProductId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (
      !name.trim() ||
      !description.trim() ||
      !gender.trim() ||
      !type.trim() ||
      price <= 0 ||
      !color.trim() ||
      !size.trim() ||
      stock <= 0 ||
      imageUrls.some((url) => !url.trim())
    ) {
      alert("Todos los campos deben estar completos antes de enviar el formulario.");
      return;
    }

    const filteredImageUrls = imageUrls.filter((url) => url.trim() !== "");

    const variant: Variant = {
      color,
      size,
      stock,
      price,
      images: filteredImageUrls.map((url, index) => ({
        fileName: fileName
          ? `${fileName}_${index + 1}.jpg`
          : `image_${index + 1}.jpg`,
        imageUrl: url,
      })),
    };

    const productData: Product = {
      name,
      description,
      gender,
      type,
      variants: [variant],
    };

    try {
      const token = localStorage.getItem("token");

      const response = editingProductId
        ? await fetch(`http://localhost:8082/api/products/${editingProductId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          })
        : await fetch("http://localhost:8082/api/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          });

      if (response.ok) {
        const data = await response.json();
        console.log(
          editingProductId ? "Producto actualizado:" : "Producto guardado exitosamente:",
          data
        );
        fetchProducts();
        resetForm();
      } else {
        console.error("Error al guardar el producto:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8082/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Producto eliminado exitosamente");
        fetchProducts();
      } else {
        console.error("Error al eliminar el producto:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setDescription(product.description);
    setGender(product.gender);
    setType(product.type);

    if (product.variants && product.variants.length > 0) {
      const variant = product.variants[0];
      setColor(variant.color);
      setSize(variant.size);
      setStock(variant.stock);
      setPrice(variant.price);
      setImageUrls(variant.images.map((img) => img.imageUrl));
      setFileName(variant.images[0]?.fileName || "");
    } else {
      setColor("");
      setSize("");
      setStock(0);
      setPrice(0);
      setImageUrls([""]);
      setFileName("");
    }
    setEditingProductId(product.id || null);
  };

  if (role !== "ADMIN") {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {editingProductId ? "Editar Producto" : "Agregar Producto"}
      </h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Nombre:</label>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className={styles.label}>Descripción:</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className={styles.label}>Color:</label>
        <input
          className={styles.input}
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <label className={styles.label}>Talla:</label>
        <input
          className={styles.input}
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />

        <label className={styles.label}>Stock:</label>
        <input
          className={styles.input}
          type="number"
          value={stock.toString()}
          onChange={(e) => setStock(Number(e.target.value))}
        />

        <label className={styles.label}>Género:</label>
        <select
          className={styles.select}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Género</option>
          <option value="MUJER">MUJER</option>
          <option value="HOMBRE">HOMBRE</option>
          <option value="UNISEX">UNISEX</option>
        </select>

        <label className={styles.label}>Tipo:</label>
        <select
          className={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Seleccionar Tipo</option>
          <option value="SUPERIOR">SUPERIOR</option>
          <option value="INFERIOR">INFERIOR</option>
          <option value="CALZADO">CALZADO</option>
        </select>

        <label className={styles.label}>Precio:</label>
        <input
          className={styles.input}
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
        />

        <label className={styles.label}>Nombre de la Imagen:</label>
        <input
          className={styles.input}
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />

        <label className={styles.label}>URL de las Imágenes:</label>
        {imageUrls.map((url, index) => (
          <div key={index} className={styles.urlContainer}>
            <input
              className={styles.input}
              type="text"
              value={url}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
            />
          </div>
        ))}
        <button
          className={styles.addButton}
          type="button"
          onClick={handleAddImageUrl}
        >
          Agregar otra URL
        </button>

        <button className={styles.button} type="submit">
          {editingProductId ? "Actualizar Producto" : "Guardar Producto"}
        </button>
      </form>

      <h2 className={styles.title}>Lista de Productos</h2>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <button onClick={() => handleEdit(product)}>Editar</button>
            <button onClick={() => handleDelete(product.id!)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
