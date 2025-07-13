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

  const [variants, setVariants] = useState<Variant[]>([
    {
      color: "",
      size: "",
      stock: 0,
      price: 0,
      images: [{ fileName: "", imageUrl: "" }],
    },
  ]);

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

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const updatedVariants = [...variants];
    (updatedVariants[index] as any)[field] = value;
    setVariants(updatedVariants);
  };

  const handleImageChange = (variantIndex: number, imageIndex: number, field: keyof Image, value: string) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images[imageIndex][field] = value;
    setVariants(updatedVariants);
  };

  const handleAddImage = (variantIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images.push({ fileName: "", imageUrl: "" });
    setVariants(updatedVariants);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        size: "",
        stock: 0,
        price: 0,
        images: [{ fileName: "", imageUrl: "" }],
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!name.trim() || !description.trim() || !gender.trim() || !type.trim()) {
      alert("Los campos generales del producto son obligatorios.");
      return;
    }

    for (let variant of variants) {
      if (
        !variant.color ||
        !variant.size ||
        variant.stock <= 0 ||
        variant.price <= 0 ||
        variant.images.some((img) => !img.imageUrl.trim())
      ) {
        alert("Completa correctamente todas las variantes e imágenes.");
        return;
      }
    }

    const productData: Product = {
      name,
      description,
      gender,
      type,
      variants,
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
        console.log("Producto guardado/actualizado:", data);
        fetchProducts();
        resetForm();
      } else {
        console.error("Error al guardar el producto:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setGender("");
    setType("");
    setVariants([
      {
        color: "",
        size: "",
        stock: 0,
        price: 0,
        images: [{ fileName: "", imageUrl: "" }],
      },
    ]);
    setEditingProductId(null);
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setDescription(product.description);
    setGender(product.gender);
    setType(product.type);
    setVariants(product.variants);
    setEditingProductId(product.id || null);
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

  if (role !== "ADMIN") return null;

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

        <hr />
        <h3>Variantes</h3>
        {variants.map((variant, index) => (
          <div key={index} className={styles.variantBox}>
            <label className={styles.label}>Color:</label>
            <input
              className={styles.input}
              type="text"
              value={variant.color}
              onChange={(e) => handleVariantChange(index, "color", e.target.value)}
            />

            <label className={styles.label}>Talla:</label>
            <input
              className={styles.input}
              type="text"
              value={variant.size}
              onChange={(e) => handleVariantChange(index, "size", e.target.value)}
            />

            <label className={styles.label}>Stock:</label>
            <input
              className={styles.input}
              type="number"
              value={variant.stock}
              onChange={(e) => handleVariantChange(index, "stock", Number(e.target.value))}
            />

            <label className={styles.label}>Precio:</label>
            <input
              className={styles.input}
              type="number"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value))}
            />

            <label className={styles.label}>Imágenes:</label>
            {variant.images.map((img, imgIndex) => (
              <div key={imgIndex}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Nombre del archivo"
                  value={img.fileName}
                  onChange={(e) =>
                    handleImageChange(index, imgIndex, "fileName", e.target.value)
                  }
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="URL de la imagen"
                  value={img.imageUrl}
                  onChange={(e) =>
                    handleImageChange(index, imgIndex, "imageUrl", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className={styles.addButton}
              onClick={() => handleAddImage(index)}
            >
              Agregar otra imagen
            </button>
            <hr />
          </div>
        ))}
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddVariant}
        >
          Agregar otra variante
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
