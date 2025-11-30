import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

function PersonalList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const ref = collection(db, "users", uid, "personalList");

    return onSnapshot(ref, snapshot => {
      setList(snapshot.docs.map(doc => doc.data()));
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Personal List</h2>
      {list.map((item, i) => (
        <div key={i}>
          <h3>{item.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default PersonalList;
