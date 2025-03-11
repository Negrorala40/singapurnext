'use client';

import React, { useState } from "react";
import styles from "./Admin.module.css";

const Admin = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [stock, setStock] = useState(0);
    const [gender, setGender] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState(0);
    const [fileName, setFileName] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([""]); // Múltiples URLs

    // Listas dinámicas
    const [colorOptions, setColorOptions] = useState<string[]>(["Negro", "Blanco", "Rojo"]);
    const [sizeOptions, setSizeOptions] = useState<string[]>(["S", "M", "L", "XL"]);

    // Manejar cambios en las URLs de imágenes
    const handleImageUrlChange = (index: number, value: string) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    // Agregar un campo para una nueva URL de imagen
    const handleAddImageUrl = () => {
        setImageUrls([...imageUrls, ""]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Crear el JSON según el formato que me compartiste
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
            images: imageUrls.map((url, index) => ({
                fileName: `${fileName}_${index + 1}.jpg`, // Nombre único para cada imagen
                url,
            })),
        };

        try {
            const response = await fetch("http://localhost:8082/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Producto guardado exitosamente:", data);
                // Limpiar los campos después de guardar
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

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Agregar Producto</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label}>Nombre:</label>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <label className={styles.label}>Descripción:</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label className={styles.label}>Color:</label>
                <select
                    className={styles.select}
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                >
                    <option value="">Seleccionar Color</option>
                    {colorOptions.map((c, idx) => (
                        <option key={idx} value={c}>{c}</option>
                    ))}
                </select>

                <label className={styles.label}>Talla:</label>
                <select
                    className={styles.select}
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                >
                    <option value="">Seleccionar Talla</option>
                    {sizeOptions.map((s, idx) => (
                        <option key={idx} value={s}>{s}</option>
                    ))}
                </select>

                <label className={styles.label}>Stock:</label>
                <input
                    className={styles.stockInput}
                    type="number"
                    placeholder="Stock"
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
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Tipo (ej: SUPERIOR)"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />

                <label className={styles.label}>Precio:</label>
                <input
                    className={styles.priceInput}
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                />

                <label className={styles.label}>Nombre de la Imagen:</label>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Nombre de la imagen (ej: camiseta_negra.jpg)"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                />

                <label className={styles.label}>URL de las Imágenes:</label>
                {imageUrls.map((url, index) => (
                    <div key={index} className={styles.urlContainer}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder={`URL de la imagen ${index + 1}`}
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

                <button className={styles.button} type="submit">Guardar Producto</button>
            </form>
        </div>
    );
};

export default Admin;
