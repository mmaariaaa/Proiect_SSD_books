import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Schimbă în "./firebase" dacă e în același folder
import { shareProgress } from "../services/shareProgress"; // adaptează calea dacă ai alt folder

const ShareProgressButton = ({ item }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    const handleShare = async () => {
        if (!user) {
            alert("Trebuie să fii logat ca să poți da Share Progress.");
            return;
        }
        if (!item?.id) {
            alert("Nu există item selectat.");
            return;
        }

        await shareProgress({
            userId: user.uid,
            userName: user.displayName || user.email || "Anonymous",
            itemId: item.id,
            itemTitle: item.title || "Unknown title",
            progress: item.progress || "Progress update",
        });

        alert("Progress shared!");
    };

    if (!user) return null;

    return <button onClick={handleShare}>Share Progress</button>;
};

export default ShareProgressButton;
