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
                            color: filled ? "#f4b400" : "#cfcfcf",
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


    const [liked, setLiked] = useState(false);


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
            alert(" Progress updated!");
        } catch (err) {
            console.error(err);
            alert(" Failed to update progress.");
        }
    };

    const handleAddToList = async () => {
        try {

            await addToPersonalList(id,item);
            alert(" Added to your list!");
        } catch (err) {
            console.error(err);
            alert(" Failed to add to your list.");
        }
    };

    const toggleLike = () => setLiked((x) => !x);

    const handleSubmitReview = async () => {
        try {
            setSavingReview(true);

            await addReview(id, rating, reviewText);

            setRating(5);
            setReviewText("");

            await fetchReviews(id);

            alert(" Review added!");
        } catch (err) {
            console.error(err);
            alert(err.message || " Failed to add review.");
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
        <div
            style={{
                minHeight: "100vh",
                padding: 20,
                backgroundImage: 'url("/background.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                color: "white",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: 20,
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    background: "#6c63ff",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                ← Back
            </button>

            <div
                style={{
                    display: "flex",
                    gap: 30,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    padding: 20,
                    borderRadius: 12,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                }}
            >
                <img
                    src={item.coverUrl || "/placeholder.png"}
                    alt={item.title}
                    style={{ width: 200, height: 300, objectFit: "cover", borderRadius: 12 }}
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />

                <div style={{ flex: 1, minWidth: 280 }}>
                    <h2 style={{ color: "#ffd700", marginBottom: 10 }}>{item.title}</h2>
                    <p>
                        <b>Author / Director:</b> {item.author}
                    </p>
                    <p>
                        <b>Year:</b> {item.year}
                    </p>
                    <p>
                        <b>Type:</b> {item.type}
                    </p>
                    <p>
                        <b>Description:</b> {item.description}
                    </p>


                    <div style={{ marginTop: 20 }}>
                        <h3>Reading / Watching Progress</h3>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            style={{ width: "80%" }}
                        />
                        <span style={{ marginLeft: 10 }}>{progress}%</span>

                        <div style={{ marginTop: 10 }}>
                            <button
                                onClick={handleSaveProgress}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: 6,
                                    border: "none",
                                    background: "#4caf50",
                                    color: "white",
                                    cursor: "pointer",
                                    marginRight: 10,
                                }}
                            >
                                Save Progress
                            </button>

                            <button
                                onClick={handleAddToList}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: 6,
                                    border: "none",
                                    background: "#ff9800",
                                    color: "white",
                                    cursor: "pointer",
                                    marginRight: 10,
                                }}
                            >
                                Add to My List
                            </button>

                            <button
                                onClick={toggleLike}
                                style={{
                                    padding: "6px 12px",
                                    borderRadius: 6,
                                    border: "none",
                                    background: liked ? "#e91e63" : "#9e9e9e",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                            >
                                {liked ? " Liked" : " Like"}
                            </button>
                        </div>
                    </div>


                    <div style={{ marginTop: 20 }}>
                        <h3>Reviews</h3>

                        {avgRating !== null ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <StarRating value={avgRounded} readOnly={true} />
                                <span style={{ color: "#eee" }}>
                  <b>{avgRating.toFixed(2)}</b> / 5 ({reviews.length} review
                                    {reviews.length === 1 ? "" : "s"})
                </span>
                            </div>
                        ) : (
                            <p style={{ marginTop: 0 }}>No reviews yet.</p>
                        )}


                        <div
                            style={{
                                backgroundColor: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: 10,
                                padding: 12,
                                maxWidth: 520,
                            }}
                        >
                            <h4 style={{ marginTop: 0, marginBottom: 8 }}>Write a review</h4>

                            <div style={{ marginBottom: 8 }}>
                                <div style={{ marginBottom: 6, fontWeight: 600 }}>Rating:</div>
                                <StarRating value={rating} onChange={setRating} readOnly={false} />
                            </div>

                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your review..."
                                style={{
                                    width: "100%",
                                    height: 90,
                                    marginTop: 8,
                                    padding: 8,
                                    borderRadius: 8,
                                    border: "1px solid rgba(255,255,255,0.25)",
                                    background: "rgba(0,0,0,0.25)",
                                    color: "white",
                                    resize: "none",
                                }}
                            />

                            <button
                                onClick={handleSubmitReview}
                                disabled={savingReview}
                                style={{
                                    marginTop: 10,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: "none",
                                    background: "#3498db",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                            >
                                {savingReview ? "Saving..." : "Submit Review"}
                            </button>
                        </div>


                        <div style={{ marginTop: 12, maxWidth: 520 }}>
                            {reviews.length === 0 ? null : (
                                reviews.map((r) => (
                                    <div
                                        key={r.id}
                                        style={{
                                            backgroundColor: "rgba(0,0,0,0.35)",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                            borderRadius: 10,
                                            padding: 10,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <StarRating value={r.rating} readOnly={true} />
                                            <span style={{ fontSize: 12, color: "#ddd" }}>{r.rating}/5</span>
                                        </div>

                                        <div style={{ marginTop: 8, color: "#fff" }}>{r.text}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>


                    {item.reviews?.length > 0 && (
                        <div style={{ marginTop: 20 }}>
                            <h3>Legacy Reviews:</h3>
                            <ul>
                                {item.reviews.map((rev, idx) => (
                                    <li key={idx} style={{ marginBottom: 6 }}>
                                        {rev}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ItemDetails;