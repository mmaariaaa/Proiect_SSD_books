import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function addReview(itemId, rating, text) {
    if (!itemId || typeof itemId !== "string") {
        throw new Error("Invalid itemId");
    }

    const r = Number(rating);
    if (!Number.isFinite(r) || r < 1 || r > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

    const t = (text || "").trim();
    if (!t) {
        throw new Error("Review text is required");
    }

    const reviewsRef = collection(db, "item", itemId, "reviews");

    await addDoc(reviewsRef, {
        rating: r,
        text: t,
        createdAt: serverTimestamp(),
    });
}
