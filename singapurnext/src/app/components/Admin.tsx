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
    const [image, setImage] = useState<File | null>(null);

    // Estados para listas dinámicas
    const [colorOptions, setColorOptions] = useState<string[]>(["Negro", "Blanco", "Rojo"]);
    const [sizeOptions, setSizeOptions] = useState<string[]>(["S", "M", "L", "XL"]);

    // Nuevas opciones a agregar
    const [newColor, setNewColor] = useState("");
    const [newSize, setNewSize] = useState("");

    // Funciones para agregar nuevas opciones
    const addColorOption = () => {
        if (newColor.trim() && !colorOptions.includes(newColor.trim())) {
            setColorOptions([...colorOptions, newColor.trim()]);
            setNewColor("");
        }
    };

    const addSizeOption = () => {
        if (newSize.trim() && !sizeOptions.includes(newSize.trim())) {
            setSizeOptions([...sizeOptions, newSize.trim()]);
            setNewSize("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Producto guardado:", { name, description, color, size, stock, gender, type, price, image });
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
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
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

                <label className={styles.label}>Precio:</label>
                <input
                    className={styles.priceInput}
                    type="number"
                    placeholder="Precio"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                />

                <label className={styles.label}>Imagen:</label>
                <input
                    className={styles.input}
                    type="file"
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                />

                <button className={styles.button} type="submit">Guardar Producto</button>
            </form>

            {/* Sección para agregar nuevas opciones de color */}
            <div className={styles.optionContainer}>
                <h4 className={styles.subtitle}>Agregar Nuevo Color</h4>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Nuevo Color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                />
                <button className={styles.addButton} onClick={addColorOption}>Agregar Color</button>
            </div>

            {/* Sección para agregar nuevas opciones de talla */}
            <div className={styles.optionContainer}>
                <h4 className={styles.subtitle}>Agregar Nueva Talla</h4>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Nueva Talla"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                />
                <button className={styles.addButton} onClick={addSizeOption}>Agregar Talla</button>
            </div>
        </div>
    );
};

export default Admin;
