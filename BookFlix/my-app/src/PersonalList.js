import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";
import { addToPersonalList } from "./addToPersonalList";

function PersonalList() {
    const [searchInput, setSearchInput] = useState("");
    const [results, setResults] = useState([]);
    const [myList, setMyList] = useState([]);

    // helper: normalizează o cheie unică pe baza datelor (dedup unificat)
    const makeKeyFromData = (data) => {
        const title = (data?.title || "").toLowerCase().trim();
        const author = (data?.author || "").toLowerCase().trim();
        const year = String(data?.year || "").trim();
        return `sig:${title}|${author}|${year}`;
    };

    // ✅ Încarcă lista personală din Firestore + deduplicare (inclusiv vechi+nou)
    const loadMyList = async () => {
        try {
            const snapshot = await getDocs(collection(db, "personalList"));

            const items = [];
            const seen = new Set(); // dedup unificat

            for (const entry of snapshot.docs) {
                const saved = entry.data().itemId;

                // ✅ CAZ 1: intrări vechi/stricate: itemId e OBIECT (title/author/etc.)
                if (saved && typeof saved === "object") {
                    const key = makeKeyFromData(saved);

                    if (seen.has(key)) continue;
                    seen.add(key);

                    items.push({
                        id: key, // id local (unic)
                        ...saved,
                    });

                    continue;
                }

                // ✅ CAZ 2: intrări corecte: itemId e STRING (id din colecția "item")
                if (typeof saved === "string" && saved.trim()) {
                    const itemDocId = saved.trim();

                    const itemRef = doc(db, "item", itemDocId);
                    const itemSnap = await getDoc(itemRef);

                    if (!itemSnap.exists()) continue;

                    const data = itemSnap.data();
                    const key = makeKeyFromData(data); // ✅ aceeași cheie ca la obiect

                    if (seen.has(key)) continue;
                    seen.add(key);

                    items.push({
                        id: itemSnap.id,
                        ...data,
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

    // ✅ Căutare în baza de date (colecția "item")
    const handleSearch = async () => {
        const qText = searchInput.trim();
        if (!qText) return;

        try {
            // prefix-search pe title
            const q = query(
                collection(db, "item"),
                where("title", ">=", qText),
                where("title", "<=", qText + "\uf8ff")
            );

            const snapshot = await getDocs(q);
            const found = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            setResults(found);
        } catch (err) {
            console.error("Error searching:", err);
        }
    };

    // ✅ Add din rezultate în personalList (salvează DOAR id-ul)
    const handleAddFromSearch = async (item) => {
        try {
            await addToPersonalList(item.id);
            await loadMyList(); // refresh listă
        } catch (err) {
            console.error(err);
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
                        borderRadius: "6px",
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "8px 14px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#1976d2",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </div>

            {results.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <h3>Search Results</h3>

                    {results.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: 10,
                                border: "1px solid #ddd",
                                borderRadius: 10,
                                marginBottom: 10,
                            }}
                        >
                            <img
                                src={item.coverUrl || "/placeholder.png"}
                                alt={item.title}
                                width={60}
                                height={90}
                                style={{ objectFit: "cover", borderRadius: 6 }}
                                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                            />

                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700 }}>{item.title}</div>
                                <div>{item.author}</div>
                                {item.year && <div>{item.year}</div>}
                            </div>

                            <button onClick={() => handleAddFromSearch(item)}>Add</button>
                        </div>
                    ))}
                </div>
            )}

            <h3>Your Saved Books / Movies</h3>

            {myList.length === 0 ? (
                <p>You haven't added anything yet.</p>
            ) : (
                myList.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: 10,
                            border: "1px solid #ddd",
                            borderRadius: 10,
                            marginBottom: 10,
                        }}
                    >
                        <img
                            src={item.coverUrl || "/placeholder.png"}
                            alt={item.title}
                            width={80}
                            height={120}
                            style={{ objectFit: "cover", borderRadius: 6 }}
                            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        />

                        <div>
                            <h3 style={{ margin: 0 }}>{item.title}</h3>
                            <p style={{ margin: 0 }}>{item.author}</p>
                            {item.year && <p style={{ margin: 0 }}>{item.year}</p>}
                            {item.type && <p style={{ margin: 0 }}>Type: {item.type}</p>}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default PersonalList;
