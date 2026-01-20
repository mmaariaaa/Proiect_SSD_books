import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { shareProgress } from "../services/shareProgress";

const ShareProgressButton = ({ item }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    const handleShare = async () => {
        if (!user) {
            alert("You have to be logged in so you can share the progress !!!.");
            return;
        }

        await shareProgress({
            userId: user.uid,
            userName: user.displayName || user.email || "Anonymous",
            itemId: item?.id || "unknown",
            itemTitle: item?.title || "Unknown title",
            progress: item?.progress || "Progress update"
        });

        alert("Shared!");
    };

    if (!user) return null;

    return <button onClick={handleShare}>Share Progress</button>;
};

export default ShareProgressButton;
