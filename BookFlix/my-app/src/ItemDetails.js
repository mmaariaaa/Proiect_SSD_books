import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { updateProgress } from "./updateProgress";
import { addToPersonalList } from "./addToPersonalList";


function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const docRef = doc(db, "item", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setItem(docSnap.data());
                    setProgress(docSnap.data().progress || 0);
                } else {
                    console.log("No such item!");
                }
            } catch (err) {
                console.error("Error fetching item:", err);
            }
        };

        fetchItem();
    }, [id]);

    const handleSaveProgress = async () => {
        await updateProgress(id, progress);
        alert("Progress updated!");
    };

    if (!item) return <p>Loading item details...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>{item.title}</h2>

            <img src={item.coverUrl} alt={item.title} width={200} />

            <p><strong>Author / Director:</strong> {item.author}</p>
            <p><strong>Year:</strong> {item.year}</p>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Description:</strong> {item.description}</p>

            <h3>Reading / Watching Progress</h3>

            <input
                type="number"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
            />

            <button onClick={handleSaveProgress} style={{ marginLeft: 10 }}>
                Save Progress
            </button>
            <button
                onClick={() => addToPersonalList(item)}
                style={{ marginTop: 10, marginRight: 15 }}
            >
                Add to My List
            </button>


            {item.reviews?.length > 0 && (
                <div>
                    <h3>User Reviews:</h3>
                    <ul>
                        {item.reviews.map((review, index) => (
                            <li key={index}>{review}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ItemDetails;
