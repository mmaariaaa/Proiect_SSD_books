import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function AddItem() {
    const [form, setForm] = useState({
        title: "",
        author: "",
        year: "",
        description: "",
        type: "book",
        coverUrl: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.coverUrl.trim()) {
            return alert("Please enter an image URL.");
        }

        try {
            await addDoc(collection(db, "items"), {
                ...form,
                createdAt: new Date()
            });

            alert("Item added successfully!");

            setForm({
                title: "",
                author: "",
                year: "",
                description: "",
                type: "book",
                coverUrl: ""
            });

        } catch (err) {
            console.error("Error adding item:", err);
            alert("Failed to add item. Check console.");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Add New Book / Movie</h2>

            <input
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                style={{ display: "block", margin: "5px 0" }}
            />

            <input
                name="author"
                placeholder="Author / Director"
                value={form.author}
                onChange={handleChange}
                style={{ display: "block", margin: "5px 0" }}
            />

            <input
                name="year"
                placeholder="Year"
                value={form.year}
                onChange={handleChange}
                style={{ display: "block", margin: "5px 0" }}
            />

            <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                style={{ display: "block", margin: "5px 0", width: "300px", height: "80px" }}
            />

            <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={{ display: "block", margin: "5px 0" }}
            >
                <option value="book">Book</option>
                <option value="movie">Movie</option>
            </select>

            <input
                name="coverUrl"
                placeholder="Image URL"
                value={form.coverUrl}
                onChange={handleChange}
                style={{ display: "block", margin: "5px 0" }}
            />

            <button onClick={handleSubmit} style={{ marginTop: 10 }}>
                Add Item
            </button>
        </div>
    );
}

export default AddItem;
