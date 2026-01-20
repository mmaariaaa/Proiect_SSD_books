import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const shareProgress = async ({ userId, userName, itemId, itemTitle, progress }) => {
    try {
        await addDoc(collection(db, "activityFeed"), {
            userId,
            userName,
            itemId,
            itemTitle,
            progress,
            createdAt: serverTimestamp()
        });
    } catch (err) {
        console.error("Error sharing progress:", err);
    }
};
