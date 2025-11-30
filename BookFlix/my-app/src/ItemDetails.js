import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function ItemDetails() {
  const { id } = useParams(); // get document ID from URL
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem(docSnap.data());
        } else {
          console.log("No such item!");
        }
      } catch (err) {
        console.error("Error fetching item:", err);
      }
    };

    fetchItem();
  }, [id]);

  if (!item) return <p>Loading item details...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{item.title}</h2>
      <img src={item.coverUrl} alt={item.title} width={200} />
      <p><strong>Author / Director:</strong> {item.author}</p>
      <p><strong>Year:</strong> {item.year}</p>
      <p><strong>Type:</strong> {item.type}</p>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Rating:</strong> {item.rating || "Not rated yet"}</p>
      
      {/* Optional: Display reviews */}
      {item.reviews && item.reviews.length > 0 && (
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
