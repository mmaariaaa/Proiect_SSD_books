import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function SearchPage() {
    const [title, setTitle] = useState("");
    const [allItems, setAllItems] = useState([]);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const snapshot = await getDocs(collection(db, "item"));
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllItems(data);
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
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
            <button onClick={handleSearch}>Search</button>

            <div style={{ marginTop: 20 }}>
                {results.length === 0 && <p>No results found</p>}
                {results.map(item => (
                    <div key={item.id} style={{ marginBottom: 20 }}>
                        <img src={item.coverUrl} alt={item.title} width={100} />
                        <h3>{item.title}</h3>
                        <p>{item.year}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchPage;
