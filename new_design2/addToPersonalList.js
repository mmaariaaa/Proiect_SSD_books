import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const makeSig = (data) => {
    const title = (data?.title || "").toLowerCase().trim();
    const author = (data?.author || data?.director || "").toLowerCase().trim();
    const year = String(data?.year || "").trim();
    return `sig:${title}|${author}|${year}`;
};


export async function addToPersonalList(itemId, itemData = null) {
    const sig = itemData ? makeSig(itemData) : null;

    const docRef = await addDoc(collection(db, "personalList"), {
        itemId,
        sig,
        addedAt: serverTimestamp(),
    });

    return docRef.id;
}
