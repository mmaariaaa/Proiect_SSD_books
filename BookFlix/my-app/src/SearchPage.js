import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function SearchPage() {
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
    <div style={{ padding: 20 }}>
      <h2>Search Books / Movies</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        style={{ marginRight: 10 }}
      />
      <button onClick={handleSearch}>Search</button>

      <div style={{ marginTop: 20 }}>
        {results.length === 0 && <p>No results found</p>}
        {results.map(item => (
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
              borderRadius: 6
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

export default SearchPage;
