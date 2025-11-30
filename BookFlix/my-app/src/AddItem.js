import React, { useState } from "react";
import { db, storage } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AddItem() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    year: "",
    description: "",
    type: "book" // or "movie"
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload a cover image.");

    try {
      // 1️⃣ Upload image to Firebase Storage
      const imageRef = ref(storage, `covers/${file.name}`);
      await uploadBytes(imageRef, file);
      const coverUrl = await getDownloadURL(imageRef);

      // 2️⃣ Save item in Firestore
     await addDoc(collection(db, "item"),  {
        ...form,
        coverUrl,
        createdAt: new Date()
      });

      alert("Item added successfully!");
      setForm({
        title: "",
        author: "",
        year: "",
        description: "",
        type: "book"
      });
      setFile(null);
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
      ></textarea>
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
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: "block", margin: "5px 0" }}
      />

      <button onClick={handleSubmit} style={{ marginTop: 10 }}>
        Add Item
      </button>
    </div>
  );
}

export default AddItem;
