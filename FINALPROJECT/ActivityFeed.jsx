import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "activityFeed"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feed = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(feed);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "30px auto",
        padding: 20,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.9)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Activity Feed</h2>
      {activities.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        activities.map((act) => (
          <div
            key={act.id}
            style={{
              padding: 10,
              marginBottom: 12,
              borderBottom: "1px solid #ddd",
            }}
          >
            <strong>{act.user}</strong>: {act.message} <br />
            <small style={{ color: "#555" }}>
              {act.createdAt?.toDate().toLocaleString() || ""}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default ActivityFeed;
