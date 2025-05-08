const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middleware/auth');
const Comment = require('../models/comment');

// POST /api/media/:id/comments — Add comment
router.post('/media/:id/comments', authenticateToken, async (req, res) => {
  const mediaId = req.params.id;
  const userId = req.user.id;
  const { comment } = req.body;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }

  try {
    await Comment.addComment(userId, mediaId, comment);
    res.json({ message: 'Comment added' });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/media/:id/comments — Get comments for a media item
router.get('/media/:id/comments', authenticateToken, async (req, res) => {
  const mediaId = req.params.id;

  try {
    const comments = await Comment.getCommentsByMedia(mediaId);
    res.json(comments);
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
