"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Admin.module.css";

const Admin = () => {
    const router = useRouter();
    const [role, setRole] = useState("");

    useEffect(() => {
        const storedRole = localStorage.getItem("role"); // Obtener rol desde localStorage
        if (storedRole !== "ADMIN") {
            router.push("/"); // Redirigir a "/" si no es ADMIN
        } else {
            setRole(storedRole);
        }
    }, []);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [stock, setStock] = useState(0);
    const [gender, setGender] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState(0);
    const [fileName, setFileName] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([""]);

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

        const productData = {
            name,
            description,
            gender,
            type,
            price,
            variants: [
                {
                    color,
                    size,
                    stock,
                },
            ],
            images: filteredImageUrls.map((url, index) => ({
                fileName: fileName ? `${fileName}_${index + 1}.jpg` : `image_${index + 1}.jpg`,
                imageUrl: url,
            })),
        };

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8082/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Producto guardado exitosamente:", data);

                // Reiniciar los estados del formulario
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
            } else {
                console.error("Error al guardar el producto:", response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    if (role !== "ADMIN") {
        return null; // Evita que la página cargue si el usuario no es ADMIN
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Agregar Producto</h2>
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

                <button className={styles.button} type="submit">Guardar Producto</button>
            </form>
            <h2>Eliminar producto</h2>
            <h2>Actualizar Producto</h2>
            <h2>Agregar Administrador</h2>

        </div>
    );
};

export default Admin;
