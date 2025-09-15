const express = require('express');
const router = express.Router();
const db = require('../db');

// NOTE: The 'protect' and 'authorize' middleware are now handled in index.js
// for all routes in this file. This keeps the code cleaner.

// @desc    Get application statistics
router.get('/stats', async (req, res) => {
  try {
    const userCountPromise = db.query('SELECT COUNT(*) FROM users');
    const storeCountPromise = db.query('SELECT COUNT(*) FROM stores');
    const ratingCountPromise = db.query('SELECT COUNT(*) FROM ratings');

    const [userCountRes, storeCountRes, ratingCountRes] = await Promise.all([
      userCountPromise,
      storeCountPromise,
      ratingCountPromise,
    ]);

    res.json({
      userCount: parseInt(userCountRes.rows[0].count, 10),
      storeCount: parseInt(storeCountRes.rows[0].count, 10),
      ratingCount: parseInt(ratingCountRes.rows[0].count, 10),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Get all users with sorting
router.get('/users', async (req, res) => {
  const { sortBy = 'id', order = 'asc' } = req.query;
  const validSortColumns = ['id', 'name', 'email', 'role', 'created_at'];
  const validOrders = ['asc', 'desc'];

  if (!validSortColumns.includes(sortBy) || !validOrders.includes(order)) {
    return res.status(400).json({ msg: 'Invalid sort parameters' });
  }

  const query = `SELECT id, name, email, role, created_at FROM users ORDER BY "${sortBy}" ${order.toUpperCase()}`;

  try {
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Other admin routes...
// We are keeping the logic for single user GET and PUT here as well.
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['USER', 'ADMIN', 'OWNER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role specified' });
    }

    const { rows } = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

