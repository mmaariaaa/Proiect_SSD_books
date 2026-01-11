import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function updateProgress(itemId, progress) {
    const ref = doc(db, "item", itemId);
    await updateDoc(ref, { progress });
}