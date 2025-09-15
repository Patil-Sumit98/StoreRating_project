const express = require('express');
const db = require('../db');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Get a store owner's dashboard data
// @route   GET /api/owner/dashboard
// @access  Private/Owner
router.get('/dashboard', protect, authorize('OWNER'), async (req, res) => {
  try {
    const ownerId = req.user.id;

    // This complex query does everything in one go:
    // 1. Finds the store belonging to the owner.
    // 2. Calculates the average rating and rating count.
    // 3. Aggregates all the users who have rated the store into a single JSON array.
    const query = `
      SELECT
        s.id,
        s.name,
        s.address,
        COALESCE(AVG(r.rating_value), 0) AS "averageRating",
        COUNT(r.id) AS "ratingCount",
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email
          )
        ) FILTER (WHERE r.id IS NOT NULL) AS "raters"
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE s.owner_id = $1
      GROUP BY s.id;
    `;

    const { rows } = await db.query(query, [ownerId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'No store found for this owner.' });
    }

    // Convert average rating to a fixed 2-decimal string like in the public route
    const storeData = rows[0];
    storeData.averageRating = parseFloat(storeData.averageRating).toFixed(2);

    res.json(storeData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
