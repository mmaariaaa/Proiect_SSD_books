import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { addToPersonalList } from "./addToPersonalList";
import "./App.css";

function PersonalList() {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState([]);
  const [myList, setMyList] = useState([]);

  // 🔹 Load My List
  const loadMyList = async () => {
    try {
      const snapshot = await getDocs(collection(db, "personalList"));
      const items = [];

      for (const entry of snapshot.docs) {
        const personalId = entry.id;
        const itemId = entry.data().itemId;

        const itemRef = doc(db, "item", itemId);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          items.push({
            personalId, // 🔑 FOARTE IMPORTANT
            id: itemSnap.id,
            ...itemSnap.data(),
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

  // 🔍 Search
  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    try {
      const q = query(
        collection(db, "item"),
        where("title", ">=", searchInput),
        where("title", "<=", searchInput + "\uf8ff")
      );

      const snapshot = await getDocs(q);
      setResults(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // ➕ Add → apare IMEDIAT în You Saved
  const handleAdd = async (item) => {
    try {
      const personalId = await addToPersonalList(item.id);

      setMyList((prev) => [
        ...prev,
        {
          personalId,
          id: item.id,
          title: item.title,
          author: item.author || item.director,
          coverUrl: item.coverUrl,
        },
      ]);
    } catch (err) {
      alert("Failed to add item");
    }
  };

  // ❌ REMOVE → dispare din YOU SAVED INSTANT
  const handleRemove = async (personalId) => {
    try {
      await deleteDoc(doc(db, "personalList", personalId));

      // 🔥 scoatem imediat din UI
      setMyList((prev) =>
        prev.filter((item) => item.personalId !== personalId)
      );
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  return (
    <div
      className="fadeSlide"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5dc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20,
      }}
    >
      <h2 style={{ marginBottom: 20 }}>My Personal List</h2>

      {/* SEARCH */}
      <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search in database..."
          style={{
            padding: 10,
            width: 250,
            borderRadius: 6,
            border: "1px solid #ccc",
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

      {/* SEARCH RESULTS */}
      {results.length > 0 && (
        <div style={{ maxWidth: 600, width: "100%" }}>
          <h3>Search Results</h3>
          {results.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                padding: 15,
                marginBottom: 12,
                borderRadius: 8,
                display: "flex",
                gap: 15,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <img src={item.coverUrl} alt={item.title} width={80} />
              <div style={{ flexGrow: 1 }}>
                <h3>{item.title}</h3>
                <p>{item.author || item.director}</p>
              </div>
              <button
                onClick={() => handleAdd(item)}
                style={{
                  backgroundColor: "#ff4081",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 12px",
                }}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      {/* YOU SAVED */}
      <h3 style={{ marginTop: 30 }}>Your Saved Books / Movies</h3>

      <div style={{ maxWidth: 600, width: "100%" }}>
        {myList.length === 0 ? (
          <p>You haven't added anything yet.</p>
        ) : (
          myList.map((item) => (
            <div
              key={item.personalId}
              style={{
                background: "white",
                padding: 15,
                marginBottom: 12,
                borderRadius: 8,
                display: "flex",
                gap: 15,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <img src={item.coverUrl} alt={item.title} width={80} />
              <div style={{ flexGrow: 1 }}>
                <h3>{item.title}</h3>
                <p>{item.author || item.director}</p>
              </div>
              <button
                onClick={() => handleRemove(item.personalId)}
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 12px",
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PersonalList;
