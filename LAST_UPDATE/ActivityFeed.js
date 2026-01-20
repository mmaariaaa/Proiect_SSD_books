import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { shareProgress } from "./shareProgress";

function ActivityFeed({ user }) {
    const [progress, setProgress] = useState("");
    const [feed, setFeed] = useState([]);

    const loadFeed = async () => {
        const q = query(collection(db, "activityFeed"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        setFeed(snapshot.docs.map(doc => doc.data()));
    };

    useEffect(() => {
        loadFeed();
    }, []);

    const handleShare = async () => {
        if (!progress) return;
        await shareProgress({
            userId: user.uid,
            userName: user.displayName || user.email,
            itemId: "exampleId",
            itemTitle: "Example Book",
            progress
        });
        setProgress("");
        loadFeed();
    };

    return (
        <div style={{ marginTop: 30 }}>
            <input
                value={progress}
                onChange={e => setProgress(e.target.value)}
                placeholder="Share your progress..."
            />
            <button onClick={handleShare}>Share Progress</button>

            <h3>Activity Feed</h3>
            {feed.map((f, i) => (
                <div key={i} style={{ borderBottom: "1px solid #ccc", padding: 5 }}>
                    <strong>{f.userName}</strong> read <em>{f.progress}</em> of <em>{f.itemTitle}</em>
                </div>
            ))}
        </div>
    );
}

export default ActivityFeed;