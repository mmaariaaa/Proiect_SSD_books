import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./App.css"; // pentru animatie

function HomePage() {
  const [title, setTitle] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, "item"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, []);

  const handleSearch = () => {
    const filtered = allItems.filter(item =>
      item.title.toLowerCase().includes(title.toLowerCase())
    );
    setResults(filtered);
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
      <h2 style={{ marginBottom: 20 }}>Search Books / Movies</h2>

      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          style={{
            padding: "10px 15px",
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginRight: 10,
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onBlur={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#3498db", // albastru
            color: "white",
            fontSize: 16,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Search
        </button>
      </div>

      {/* Rezultatele */}
      <div style={{ marginTop: 30, width: "100%", maxWidth: 600 }}>
        {results.length === 0 && <p>No results found</p>}
        {results.map((item) => (
          <Link
            to={`/item/${item.id}`}
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #ccc",
              padding: 10,
              borderRadius: 6,
              backgroundColor: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={item.coverUrl || "/placeholder.png"}
              alt={item.title}
              width={100}
              style={{ marginRight: 20, borderRadius: 4 }}
              onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />
            <div>
              <h3>{item.title}</h3>
              <p>{item.year}</p>
              <p>{item.author || item.director}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
