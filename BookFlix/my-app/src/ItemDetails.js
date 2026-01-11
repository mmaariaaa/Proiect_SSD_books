import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { updateProgress } from "./updateProgress";
import { addToPersonalList } from "./addToPersonalList";
import { addReview } from "./addReview";

// ⭐ Componentă pentru stele colorate
function StarRating({ value = 0, onChange, readOnly = false, size = 22 }) {
    const v = Number(value) || 0;

    return (
        <div style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= v;
                return (
                    <span
                        key={star}
                        onClick={() => {
                            if (!readOnly && onChange) onChange(star);
                        }}
                        style={{
                            cursor: readOnly ? "default" : "pointer",
                            fontSize: size,
                            lineHeight: 1,
                            color: filled ? "#f4b400" : "#cfcfcf", // galben / gri
                            userSelect: "none",
                        }}
                        title={`${star} star${star === 1 ? "" : "s"}`}
                    >
            ★
          </span>
                );
            })}
        </div>
    );
}

function ItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Reviews
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [savingReview, setSavingReview] = useState(false);

    const fetchReviews = async (itemId) => {
        const reviewsRef = collection(db, "item", itemId, "reviews");
        const q = query(reviewsRef, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        const data = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));

        setReviews(data);
    };

    useEffect(() => {
        if (!id) {
            setError("No item ID provided.");
            setLoading(false);
            return;
        }

        const fetchItem = async () => {
            try {
                const docRef = doc(db, "item", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setItem(data);
                    setProgress(data.progress || 0);

                    // load reviews
                    await fetchReviews(id);
                } else {
                    setError("Item not found.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch item.");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    const handleSaveProgress = async () => {
        try {
            await updateProgress(id, progress);
            alert("Progress updated!");
        } catch (err) {
            console.error(err);
            alert("Failed to update progress.");
        }
    };

    const handleAddToList = async () => {
        try {
            // IMPORTANT: trimitem ID-ul (string)
            await addToPersonalList(id);
        } catch (err) {
            console.error(err);
            alert("Failed to add to your list.");
        }
    };

    const handleSubmitReview = async () => {
        try {
            setSavingReview(true);
            await addReview(id, rating, reviewText);

            // reset form
            setRating(5);
            setReviewText("");

            // reload reviews
            await fetchReviews(id);

            alert("Review added!");
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to add review.");
        } finally {
            setSavingReview(false);
        }
    };

    const avgRating =
        reviews.length > 0
            ? reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length
            : null;

    const avgRounded = avgRating ? Math.round(avgRating) : 0;

    if (loading) return <p>Loading item...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!item) return <p style={{ color: "red" }}>No item data.</p>;

    return (
        <div style={{ padding: 20 }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
                ← Back
            </button>

            <h2>{item.title}</h2>

            <img
                src={item.coverUrl || "/placeholder.png"}
                alt={item.title}
                style={{
                    width: 200,
                    height: 300,
                    objectFit: "cover",
                    borderRadius: 6,
                    marginBottom: 10,
                }}
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            />

            <p>
                <b>Author / Director: </b>
                {item.author}
            </p>
            <p>
                <b>Year: </b>
                {item.year}
            </p>
            <p>
                <b>Type: </b>
                {item.type}
            </p>
            <p>
                <b>Description: </b>
                {item.description}
            </p>

            {/* Progress */}
            <h3>Reading / Watching Progress</h3>
            <input
                type="number"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                style={{ width: 60, marginRight: 10 }}
            />
            <button onClick={handleSaveProgress}>Save Progress</button>

            <button onClick={handleAddToList} style={{ marginLeft: 10 }}>
                Add to My List
            </button>

            {/* Reviews */}
            <hr style={{ margin: "20px 0" }} />
            <h3>Reviews</h3>

            {avgRating !== null ? (
                <div style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <StarRating value={avgRounded} readOnly={true} />
                        <span style={{ color: "#444" }}>
              <b>{avgRating.toFixed(2)}</b> / 5 ({reviews.length} review
                            {reviews.length === 1 ? "" : "s"})
            </span>
                    </div>
                </div>
            ) : (
                <p>No reviews yet.</p>
            )}

            {/* Form review */}
            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    padding: 12,
                    maxWidth: 520,
                }}
            >
                <h4 style={{ marginTop: 0 }}>Write a review</h4>

                <div style={{ marginBottom: 8 }}>
                    <div style={{ marginBottom: 6, fontWeight: 600 }}>Rating:</div>
                    <StarRating value={rating} onChange={setRating} readOnly={false} />
                </div>

                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review..."
                    style={{ width: "100%", height: 90, marginTop: 8, padding: 8 }}
                />

                <button
                    onClick={handleSubmitReview}
                    disabled={savingReview}
                    style={{ marginTop: 10 }}
                >
                    {savingReview ? "Saving..." : "Submit Review"}
                </button>
            </div>

            {/* List reviews */}
            <div style={{ marginTop: 16 }}>
                {reviews.length === 0 ? null : (
                    reviews.map((r) => (
                        <div
                            key={r.id}
                            style={{
                                border: "1px solid #eee",
                                borderRadius: 10,
                                padding: 10,
                                marginBottom: 10,
                                maxWidth: 520,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <StarRating value={r.rating} readOnly={true} />
                                <span style={{ fontSize: 12, color: "#666" }}>
                  {r.rating}/5
                </span>
                            </div>

                            <div style={{ marginTop: 8 }}>{r.text}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ItemDetails;
