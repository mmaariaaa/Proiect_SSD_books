import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';  
import { updateProgress } from './updateProgress';
import { addToPersonalList } from './addToPersonalList';


function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('No item ID provided.');
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        const docRef = doc(db, 'item', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setItem(data);
          setProgress(data.progress || 0);
        } else {
          setError('Item not found.');
        }
      } catch (err) {
        setError('Failed to fetch item.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSaveProgress = async () => {
    try {
      await updateProgress(id, progress);
      alert('🎉 Progress updated!');
    } catch (err) {
      alert('❌ Failed to update progress.');
    }
  };

  const handleAddToList = () => {
    addToPersonalList(item);
    alert('✅ Added to your list!');
  };

  const toggleLike = () => setLiked(!liked);

  if (loading) return <p>Loading item...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 20,
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 20,
          padding: '8px 16px',
          borderRadius: 6,
          border: 'none',
          background: '#6c63ff',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <div
        style={{
          display: 'flex',
          gap: 30,
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: 20,
          borderRadius: 12
        }}
      >
        <img
          src={item.coverUrl || '/placeholder.png'}
          alt={item.title}
          style={{ width: 200, height: 300, objectFit: 'cover', borderRadius: 12 }}
          onError={e => (e.currentTarget.src = '/placeholder.png')}
        />

        <div style={{ flex: 1 }}>
          <h2 style={{ color: '#ffd700', marginBottom: 10 }}>{item.title}</h2>
          <p><b>Author / Director:</b> {item.author}</p>
          <p><b>Year:</b> {item.year}</p>
          <p><b>Type:</b> {item.type}</p>
          <p><b>Description:</b> {item.description}</p>

          <div style={{ marginTop: 20 }}>
            <h3>Reading / Watching Progress</h3>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              style={{ width: '80%' }}
            />
            <span style={{ marginLeft: 10 }}>{progress}%</span>

            <div style={{ marginTop: 10 }}>
              <button
                onClick={handleSaveProgress}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#4caf50',
                  color: 'white',
                  cursor: 'pointer',
                  marginRight: 10
                }}
              >
                Save Progress
              </button>

              <button
                onClick={handleAddToList}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#ff9800',
                  color: 'white',
                  cursor: 'pointer',
                  marginRight: 10
                }}
              >
                Add to My List
              </button>

              <button
                onClick={toggleLike}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: liked ? '#e91e63' : '#9e9e9e',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {liked ? '❤️ Liked' : '🤍 Like'}
              </button>
            </div>
          </div>

          {item.reviews?.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h3>User Reviews:</h3>
              <ul>
                {item.reviews.map((review, index) => (
                  <li key={index} style={{ marginBottom: 6 }}>{review}</li>
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
