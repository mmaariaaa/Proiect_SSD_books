import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { auth } from "./firebase";

export const shareProgress = async (itemTitle, progress) => {
  await addDoc(collection(db, "activityFeed"), {
    userId: auth.currentUser.uid,
    username: auth.currentUser.email,
    itemTitle,
    progress,
    timestamp: serverTimestamp(),
  });
};
<button
  onClick={() => shareProgress(item.title, item.progress)}
  style={{
    padding: "6px 12px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Share Progress
</button>
