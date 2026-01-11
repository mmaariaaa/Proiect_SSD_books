import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css"; // pentru animatie

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
  <div
    style={{
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      
      backgroundImage: "url('/cats.jpeg')", 
      backgroundSize: "cover",             
      backgroundPosition: "center",       
      backgroundRepeat: "no-repeat",       
      
      fontFamily: "'Poppins', sans-serif",
      padding: 20,
    }}
    className="fadeSlide"


    >
      {/* CARD CENTRAL */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: 40,
          borderRadius: 20,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 30,
            fontSize: "2.5rem",
            fontFamily: "'Pacifico', cursive",
            color: "#2c3e50",
            textShadow: "1px 1px 4px rgba(0,0,0,0.2)"
          }}
        >
          Add New Item
        </h2>

        {/* INPUT FIELDS */}
        {["title","author","year","coverUrl"].map(field => (
          <input
            key={field}
            name={field}
            placeholder={field === "coverUrl" ? "Image URL" : field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            style={{
              display: "block",
              margin: "10px 0",
              padding: "12px 15px",
              borderRadius: 8,
              border: "1px solid #ccc",
              width: "100%",
              fontSize: 16,
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => e.currentTarget.style.boxShadow = "0 0 8px #3498db"}
            onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
          />
        ))}

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{
            display: "block",
            margin: "10px 0",
            width: "100%",
            height: 80,
            padding: "12px 15px",
            borderRadius: 8,
            border: "1px solid #ccc",
            resize: "none",
            fontSize: 16,
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => e.currentTarget.style.boxShadow = "0 0 8px #3498db"}
          onBlur={(e) => e.currentTarget.style.boxShadow = "none"}
        />

        {/* TYPE */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{
            display: "block",
            margin: "10px 0",
            padding: "12px 15px",
            borderRadius: 8,
            border: "1px solid #ccc",
            width: "100%",
            fontSize: 16,
          }}
        >
          <option value="book">Book</option>
          <option value="movie">Movie</option>
        </select>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          style={{
            marginTop: 20,
            padding: "12px 20px",
            borderRadius: 10,
            border: "none",
            backgroundColor: "#3498db",
            color: "white",
            fontSize: 18,
            width: "100%",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Add Item
        </button>
      </div>
    </div>
  );
}

export default AddItem;
