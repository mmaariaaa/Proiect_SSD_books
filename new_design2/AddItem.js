import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css"; // pentru animatie (fadeSlide)

function AddItem() {
    const [form, setForm] = useState({
        title: "",
        author: "",
        year: "",
        description: "",
        type: "book",
        coverUrl: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.coverUrl.trim()) {
            return alert("Please enter an image URL.");
        }

        try {
            // ✅ IMPORTANT: colecția e "item" (nu "items")
            await addDoc(collection(db, "item"), {
                ...form,
                createdAt: new Date(),
                progress: 0, // ✅ adăugăm progress default
            });

            alert("Item added successfully!");

            setForm({
                title: "",
                author: "",
                year: "",
                description: "",
                type: "book",
                coverUrl: "",
            });
        } catch (err) {
            console.error("Error adding item:", err);
            alert("Failed to add item. Check console.");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5dc", // fundal bej
                fontFamily: "Arial, sans-serif",
                padding: 20,
            }}
            className="fadeSlide" // animatie
        >
            <h2 style={{ marginBottom: 20 }}>Add New Book / Movie</h2>

            <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                style={{
                    display: "block",
                    margin: "5px 0",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    width: 300,
                }}
            />

            <input
                name="author"
                placeholder="Author / Director"
                value={form.author}
                onChange={handleChange}
                style={{
                    display: "block",
                    margin: "5px 0",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    width: 300,
                }}
            />

            <input
                name="year"
                placeholder="Year"
                value={form.year}
                onChange={handleChange}
                style={{
                    display: "block",
                    margin: "5px 0",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    width: 300,
                }}
            />

            <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                style={{
                    display: "block",
                    margin: "5px 0",
                    width: 300,
                    height: 80,
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    resize: "none",
                }}
            />

            <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={{
                    display: "block",
                    margin: "5px 0",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    width: 320,
                }}
            >
                <option value="book">Book</option>
                <option value="movie">Movie</option>
            </select>

            <input
                name="coverUrl"
                placeholder="Image URL"
                value={form.coverUrl}
                onChange={handleChange}
                style={{
                    display: "block",
                    margin: "5px 0",
                    padding: "10px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    width: 300,
                }}
            />

            <button
                onClick={handleSubmit}
                style={{
                    marginTop: 10,
                    padding: "10px 20px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#3498db",
                    color: "white",
                    fontSize: 16,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                Add Item
            </button>
        </div>
    );
}

export default AddItem;
