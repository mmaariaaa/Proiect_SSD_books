import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, snapshot => {
      setNotifications(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsub();
  }, []);

  return (
    <div>
      <h3>Your Notifications</h3>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      {notifications.map((n, i) => (
        <div key={i} style={{ borderBottom: "1px solid #ccc", padding: 5 }}>
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default Notifications;
