const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/auth');
const Rating = require('../models/rating');

// POST /api/media/:id/rate — Submit or update rating
router.post('/:id/rate', authenticateToken, async (req, res) => {
  const mediaId = req.params.id;
  const userId = req.user.id;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const result = await Rating.submitOrUpdate(userId, mediaId, rating);
    res.json({ message: `Rating ${result}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ✅ NEW: GET /api/media/:id/ratings — Get average rating
router.get('/:id/ratings', authenticateToken, async (req, res) => {
  const mediaId = req.params.id;

  try {
    const average = await Rating.getAverage(mediaId);
    res.json({ averageRating: average });
  } catch (err) {
    console.error('Rating fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

module.exports = router;
