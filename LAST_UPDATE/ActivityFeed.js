import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { shareProgress } from "./shareProgress";

function ActivityFeed({ user }) {
    const [progress, setProgress] = useState("");
    const [feed, setFeed] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState("");

    const loadFeed = async () => {
        const snapshot = await getDocs(collection(db, "activityFeed"));
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        list.sort((a, b) => {
            const ta = a.createdAt?.seconds ?? 0;
            const tb = b.createdAt?.seconds ?? 0;
            return tb - ta;
        });

        console.log("FEED LOADED:", list);
        setFeed(list);
    };

    const loadItems = async () => {
        const snapshot = await getDocs(collection(db, "item"));
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        loadItems();
        loadFeed();
    }, []);

    const handleShare = async () => {
        if (!user) {
            alert("Login required");
            return;
        }
        if (!selectedItemId || !progress.trim()) return;

        const item = items.find(i => i.id === selectedItemId);

        await shareProgress({
            userId: user.uid,
            userName: user.displayName || user.email,
            itemId: item.id,
            itemTitle: item.title,
            progress: progress.trim()
        });

        setProgress("");
        loadFeed();
    };

    return (
        <div style={{ marginTop: 30 }}>
            <div style={{ display: "flex", gap: 10 }}>
                <select value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)}>
                    <option value="">Select book</option>
                    {items.map(it => (
                        <option key={it.id} value={it.id}>{it.title}</option>
                    ))}
                </select>

                <input
                    value={progress}
                    onChange={e => setProgress(e.target.value)}
                    placeholder="Share your progress..."
                />

                <button onClick={handleShare}>Share Progress</button>
            </div>

            <h3>Activity Feed</h3>

            {feed.length === 0 ? (
                <p>No activity yet.</p>
            ) : (
                feed.map(f => (
                    <div key={f.id} style={{ borderBottom: "1px solid #ccc", padding: 5 }}>
                        <strong>{f.userName}</strong>:
                        <div>{f.progress}</div>
                        <em>{f.itemTitle}</em>
                    </div>
                ))
            )}
        </div>
    );
}

export default ActivityFeed;
