const express = require('express');
const router = express.Router();
const { addLike, getLikeCount } = require('../models/like');
const { authenticateToken, isCreator, isConsumer } = require('../middleware/auth');

// POST /api/media/:id/like → Like a media item
router.post('/media/:id/like', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const mediaId = req.params.id;
  console.log("I got to like.js");

  try {
    const result = await addLike(userId, mediaId);
    const totalLikes = await getLikeCount(mediaId);
    res.json({ ...result, totalLikes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/media/:id/likes → Get like count
router.get('/media/:id/likes', authenticateToken, async (req, res) => {
  const mediaId = req.params.id;

  try {
    const count = await getLikeCount(mediaId);
    res.json({ totalLikes: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
