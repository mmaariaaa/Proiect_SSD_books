

import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addToPersonalList(itemId) {
    try {
        await addDoc(collection(db, "personalList"), {
            itemId: itemId,
            addedAt: new Date()
        });

        alert("Item added to your list!");
    } catch (err) {
        console.error("Error adding to personal list:", err);
        alert("Failed to add item.");
    }
}
