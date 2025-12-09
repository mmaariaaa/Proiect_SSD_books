import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { addToPersonalList } from "./addToPersonalList";

function PersonalList() {
    const [searchInput, setSearchInput] = useState("");
    const [results, setResults] = useState([]);
    const [myList, setMyList] = useState([]);

    const loadMyList = async () => {
        try {
            const snapshot = await getDocs(collection(db, "personalList"));
            const items = [];

            for (const entry of snapshot.docs) {
                const itemId = entry.data().itemId;

                const itemRef = doc(db, "item", itemId);
                const itemSnap = await getDoc(itemRef);

                if (itemSnap.exists()) {
                    items.push({
                        id: itemSnap.id,
                        ...itemSnap.data()
                    });
                }
            }

            setMyList(items);
        } catch (err) {
            console.error("Error loading personal list:", err);
        }
    };

    useEffect(() => {
        loadMyList();
    }, []);
    const handleSearch = async () => {
        if (!searchInput.trim()) return;

        try {
            const q = query(
                collection(db, "item"),
                where("title", ">=", searchInput),
                where("title", "<=", searchInput + "\uf8ff")
            );

            const snapshot = await getDocs(q);
            const found = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setResults(found);
        } catch (err) {
            console.error("Error searching:", err);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>My Personal List</h2>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search in database..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{
                        padding: "8px",
                        width: "250px",
                        border: "1px solid #ccc",
                        borderRadius: "6px"
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "8px 15px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    Search
                </button>
            </div>
            {results.length > 0 && (
                <div>
                    <h3>Search Results:</h3>

                    {results.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                border: "1px solid #ddd",
                                padding: "15px",
                                marginBottom: "12px",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "15px"
                            }}
                        >
                            <img src={item.coverUrl} alt={item.title} width={80} />

                            <div style={{ flexGrow: 1 }}>
                                <h3>{item.title}</h3>
                                <p>{item.author}</p>
                            </div>

                            <button
                                onClick={async () => {
                                    await addToPersonalList(item.id);
                                    loadMyList(); // reload list
                                }}
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#ff4081",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                Add to My List
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <h3 style={{ marginTop: "30px" }}>Your Saved Books / Movies</h3>

            {myList.length === 0 ? (
                <p>You haven't added anything yet.</p>
            ) : (
                myList.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "12px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "15px"
                        }}
                    >
                        <img src={item.coverUrl} alt={item.title} width={80} />

                        <div>
                            <h3>{item.title}</h3>
                            <p>{item.author}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default PersonalList;
