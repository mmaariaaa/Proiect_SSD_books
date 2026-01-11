import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./App.css";

function SearchPage() {
    const [title, setTitle] = useState("");
    const [allItems, setAllItems] = useState([]);
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const snapshot = await getDocs(collection(db, "item"));
                const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                setAllItems(data);
            } catch (err) {
                console.error("Error fetching items:", err);
            }
        };
        fetchItems();
    }, []);

    const handleSearch = () => {
        const q = title.trim().toLowerCase();
        setHasSearched(true);

        if (!q) {
            setResults([]);
            return;
        }

        const filtered = allItems.filter((item) =>
            (item.title || "").toLowerCase().includes(q)
        );

        setResults(filtered);
    };

    return (
        <div
            className="fadeSlide"
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f5dc",
                padding: 20,
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>
                Search Books / Movies
            </h2>

            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                    style={{
                        padding: 10,
                        width: 260,
                        borderRadius: 6,
                        border: "1px solid #ccc",
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#3498db",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </div>

            <div style={{ marginTop: 25, maxWidth: 700, marginInline: "auto" }}>
                {!hasSearched ? (
                    <p style={{ textAlign: "center" }}>
                        Type a title and press <b>Search</b>.
                    </p>
                ) : results.length === 0 ? (
                    <p style={{ textAlign: "center" }}>No results found</p>
                ) : (
                    results.map((item) => (
                        <Link
                            to={`/item/${item.id}`}
                            key={item.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                marginBottom: 14,
                                textDecoration: "none",
                                color: "inherit",
                                backgroundColor: "white",
                                border: "1px solid #ddd",
                                padding: 12,
                                borderRadius: 10,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            <img
                                src={item.coverUrl || "/placeholder.png"}
                                alt={item.title}
                                width={90}
                                height={130}
                                style={{ objectFit: "cover", borderRadius: 8 }}
                                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                            />

                            <div>
                                <h3 style={{ margin: 0 }}>{item.title}</h3>
                                {item.year && <p style={{ margin: "6px 0" }}>{item.year}</p>}
                                <p style={{ margin: 0, color: "#444" }}>
                                    {item.author || item.director}
                                </p>
                                {item.type && (
                                    <p style={{ margin: "6px 0 0", color: "#777" }}>
                                        Type: {item.type}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export default SearchPage;
