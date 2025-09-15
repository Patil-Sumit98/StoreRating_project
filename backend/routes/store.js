const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, authorize } = require('../middleware/authMiddleware');
const ratingRoutes = require('./rating');

router.use('/:storeId/ratings', ratingRoutes);

// ... GET routes remain the same ...
router.get('/', async (req, res) => {
  const { sortBy = 'created_at', order = 'desc' } = req.query;
  const validSortColumns = ['name', 'created_at', 'averageRating', 'ratingCount'];
  const validOrders = ['asc', 'desc'];
  if (!validSortColumns.includes(sortBy) || !validOrders.includes(order)) {
    return res.status(400).json({ msg: 'Invalid sort parameters' });
  }
  try {
    const query = `
      SELECT 
        s.*, 
        COALESCE(AVG(r.rating_value), 0) as "averageRating",
        COUNT(r.id) as "ratingCount"
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY "${sortBy}" ${order.toUpperCase()};
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        s.*, 
        COALESCE(AVG(r.rating_value), 0) as "averageRating",
        COUNT(r.id) as "ratingCount"
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id;
    `;
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Store not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @desc    Add a new store
// @route   POST /api/stores
// @access  Private/Admin
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  // 👇 The ownerId is now accepted from the request body
  const { name, email, address, ownerId } = req.body;
  try {
    const { rows } = await db.query(
      // 👇 The owner_id column is now included in the INSERT statement
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      // Use null if ownerId is not provided or is an empty string
      [name, email, address, ownerId || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

