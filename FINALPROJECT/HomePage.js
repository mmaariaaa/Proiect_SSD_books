import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";  
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import ActivityFeed from "./ActivityFeed";
import "./App.css";


function HomePage() {
  const [title, setTitle] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [results, setResults] = useState([]);

const user = auth.currentUser;
if (user) {
  console.log("User logged in:", user.email);
} else {
  console.log("No user logged in");
}

  // Load all items from Firestore
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
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src="/videoloop.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* OVERLAY BLUR */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(6px)",
          zIndex: 0,
        }}
      />

      {/* CONTENT */}
      <div
        className="fadeSlide"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 20,
        }}
      >
        {/* HEADER */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: 30,
            fontSize: "4rem",
            fontFamily: "'Pacifico', cursive",
            color: "#2c3e50",
            textShadow: "2px 2px 6px rgba(0,0,0,0.3)"
          }}
        >
          Welcome to BOOKFLIX
        </h1>

        {/* SEARCH BAR */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book or movie title..."
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
              backgroundColor: "#3498db",
              color: "white",
              fontSize: 16,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            Search
          </button>
        </div>

        {/* SEARCH RESULTS */}
        <div style={{ width: "100%", maxWidth: 700, marginTop: 30 }}>
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

        {/* ACTIVITY FEED */}
        <div style={{ width: "100%", maxWidth: 700, marginTop: 40 }}>
          <ActivityFeed user={auth.currentUser} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
