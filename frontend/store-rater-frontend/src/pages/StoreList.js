import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/stores?sortBy=${sortBy}&order=${order}`);
        setStores(res.data);
      } catch (err) {
        setError('Could not fetch stores. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [sortBy, order]);

  if (loading) return <p style={styles.message}>Loading stores...</p>;
  if (error) return <p style={{ ...styles.message, color: '#e74c3c' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>All Stores</h1>
      
      <div style={styles.sortContainer}>
        <label style={styles.sortLabel}>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
          <option value="created_at">Newest</option>
          <option value="name">Name</option>
          <option value="averageRating">Rating</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)} style={styles.sortSelect}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* 👇 The className="responsive-grid" is added here */}
      <div style={styles.grid} className="responsive-grid">
        {stores.map((store) => (
          <Link to={`/stores/${store.id}`} key={store.id} style={styles.link}>
            <div style={styles.card}>
              <h2 style={styles.storeName}>{store.name}</h2>
              <p style={styles.storeAddress}>{store.address}</p>
              <div style={styles.ratingInfo}>
                <span style={styles.ratingValue}>
                  ⭐ {parseFloat(store.averageRating).toFixed(1)}
                </span>
                <span style={styles.ratingCount}>
                  ({store.ratingCount} ratings)
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Poppins', sans-serif",
  },
  mainTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    padding: '25px',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  storeName: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    margin: '0 0 10px 0',
  },
  storeAddress: {
    fontSize: '1rem',
    color: '#7f8c8d',
    margin: '0 0 20px 0',
    flexGrow: 1,
  },
  ratingInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderTop: '1px solid #eee',
    paddingTop: '15px',
  },
  ratingValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#3498db',
  },
  ratingCount: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
  },
  message: {
    textAlign: 'center',
    fontSize: '1.2rem',
    padding: '50px',
  },
  sortContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '30px',
  },
  sortLabel: {
    fontSize: '1rem',
    color: '#2c3e50',
  },
  sortSelect: {
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#ffffff',
  }
};

export default StoreList;

