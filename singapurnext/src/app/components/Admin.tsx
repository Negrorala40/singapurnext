"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Admin.module.css";

const Admin = () => {
    const router = useRouter();
    const [role, setRole] = useState("");
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [stock, setStock] = useState(0);
    const [gender, setGender] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState(0); // Precio de la variante
    const [fileName, setFileName] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([""]);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("role"); // Obtener rol desde localStorage
        if (storedRole !== "ADMIN") {
            router.push("/"); // Redirigir a "/" si no es ADMIN
        } else {
            setRole(storedRole);
            fetchProducts(); // Fetch products if the role is ADMIN
        }
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8082/api/products", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verificar que todos los campos están completos
        if (!name.trim() || !description.trim() || !gender.trim() || !type.trim() || price <= 0 ||
            !color.trim() || !size.trim() || stock <= 0 || imageUrls.some(url => !url.trim())) {
            alert("Todos los campos deben estar completos antes de enviar el formulario.");
            return;
        }

        // Filtrar URLs de imágenes vacías
        const filteredImageUrls = imageUrls.filter(url => url.trim() !== "");

        // Cambié el `price` de `productData` a `variants`
        const productData = {
            name,
            description,
            gender,
            type,
            variants: [
                {
                    color,
                    size,
                    stock,
                    price, // El precio ahora es parte de la variante
                },
            ],
            images: filteredImageUrls.map((url, index) => ({
                fileName: fileName ? `${fileName}_${index + 1}.jpg` : `image_${index + 1}.jpg`,
                imageUrl: url,
            })),
        };

        try {
            const token = localStorage.getItem("token");

            const response = editingProductId 
                ? await fetch(`http://localhost:8082/api/products/${editingProductId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(productData),
                })
                : await fetch("http://localhost:8082/api/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(productData),
                });

            if (response.ok) {
                const data = await response.json();
                console.log(editingProductId ? "Producto actualizado:" : "Producto guardado exitosamente:", data);
                fetchProducts(); // Refresh the product list after saving/updating the product

                // Reset form states
                setName("");
                setDescription("");
                setColor("");
                setSize("");
                setStock(0);
                setGender("");
                setType("");
                setPrice(0);
                setFileName("");
                setImageUrls([""]);
                setEditingProductId(null); // Reset editing ID
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
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log("Producto eliminado exitosamente");
                fetchProducts(); // Refresh the product list after deletion
            } else {
                console.error("Error al eliminar el producto:", response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    const handleEdit = (product: any) => {
        // Populate the form with the selected product's data for editing
        setName(product.name);
        setDescription(product.description);
        setColor(product.variants[0].color);
        setSize(product.variants[0].size);
        setStock(product.variants[0].stock);
        setGender(product.gender);
        setType(product.type);
        setPrice(product.variants[0].price); // Usar el precio de la variante
        setFileName(product.images[0]?.fileName || "");
        setImageUrls(product.images.map((image: any) => image.imageUrl));
        setEditingProductId(product.id); // Set product ID to enable PUT request
    };

    if (role !== "ADMIN") {
        return null; // Evita que la página cargue si el usuario no es ADMIN
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{editingProductId ? "Editar Producto" : "Agregar Producto"}</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>Nombre:</label>
                <input className={styles.input} type="text" value={name} onChange={(e) => setName(e.target.value)} />

                <label className={styles.label}>Descripción:</label>
                <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} />

                <label className={styles.label}>Color:</label>
                <input className={styles.input} type="text" value={color} onChange={(e) => setColor(e.target.value)} />

                <label className={styles.label}>Talla:</label>
                <input className={styles.input} type="text" value={size} onChange={(e) => setSize(e.target.value)} />

                <label className={styles.label}>Stock:</label>
                <input className={styles.input} type="number" value={stock.toString()} onChange={(e) => setStock(Number(e.target.value))} />

                <label className={styles.label}>Género:</label>
                <select className={styles.select} value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Género</option>
                    <option value="MUJER">MUJER</option>
                    <option value="HOMBRE">HOMBRE</option>
                    <option value="UNISEX">UNISEX</option>
                </select>

                <label className={styles.label}>Tipo:</label>
                <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Seleccionar Tipo</option>
                    <option value="SUPERIOR">SUPERIOR</option>
                    <option value="INFERIOR">INFERIOR</option>
                    <option value="CALZADO">CALZADO</option>
                </select>

                <label className={styles.label}>Precio:</label>
                <input className={styles.input} type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />

                <label className={styles.label}>Nombre de la Imagen:</label>
                <input className={styles.input} type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />

                <label className={styles.label}>URL de las Imágenes:</label>
                {imageUrls.map((url, index) => (
                    <div key={index} className={styles.urlContainer}>
                        <input className={styles.input} type="text" value={url} onChange={(e) => handleImageUrlChange(index, e.target.value)} />
                    </div>
                ))}
                <button className={styles.addButton} type="button" onClick={handleAddImageUrl}>
                    Agregar otra URL
                </button>

                <button className={styles.button} type="submit">{editingProductId ? "Actualizar Producto" : "Guardar Producto"}</button>
            </form>

            <h2 className={styles.title}>Lista de Productos</h2>
            <div className={styles.productList}>
                {products.map((product) => (
                    <div key={product.id} className={styles.productItem}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <button onClick={() => handleEdit(product)}>Editar</button>
                        <button onClick={() => handleDelete(product.id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;
