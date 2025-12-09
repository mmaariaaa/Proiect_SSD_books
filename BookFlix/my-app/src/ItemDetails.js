import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { updateProgress } from './updateProgress';
import { addToPersonalList } from './addToPersonalList';

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      alert('Progress updated!');
    } catch (err) {
      alert('Failed to update progress.');
    }
  };

  const handleAddToList = () => {
    addToPersonalList(item);
    alert('Added to your list!');
  };

  if (loading) return React.createElement('p', null, 'Loading item...');
  if (error) return React.createElement('p', { style: { color: 'red' } }, error);

  return React.createElement(
    'div',
    { style: { padding: 20 } },
    React.createElement(
      'button',
      { onClick: () => navigate(-1), style: { marginBottom: 12 } },
      '← Back'
    ),
    React.createElement('h2', null, item.title),
    React.createElement('img', {
      src: item.coverUrl || '/placeholder.png',
      alt: item.title,
      style: { width: 200, height: 300, objectFit: 'cover', borderRadius: 6, marginBottom: 10 },
      onError: e => (e.currentTarget.src = '/placeholder.png')
    }),
    React.createElement('p', null, React.createElement('b', null, 'Author / Director: '), item.author),
    React.createElement('p', null, React.createElement('b', null, 'Year: '), item.year),
    React.createElement('p', null, React.createElement('b', null, 'Type: '), item.type),
    React.createElement('p', null, React.createElement('b', null, 'Description: '), item.description),

    React.createElement('h3', null, 'Reading / Watching Progress'),
    React.createElement('input', {
      type: 'number',
      value: progress,
      onChange: e => setProgress(Number(e.target.value)),
      style: { width: 60, marginRight: 10 }
    }),
    React.createElement(
      'button',
      { onClick: handleSaveProgress },
      'Save Progress'
    ),
    React.createElement(
      'button',
      { onClick: handleAddToList, style: { marginLeft: 10 } },
      'Add to My List'
    ),

    item.reviews?.length > 0 &&
      React.createElement(
        'div',
        { style: { marginTop: 20 } },
        React.createElement('h3', null, 'User Reviews:'),
        React.createElement(
          'ul',
          null,
          item.reviews.map((review, index) =>
            React.createElement('li', { key: index }, review)
          )
        )
      )
  );
}

export default ItemDetails;

