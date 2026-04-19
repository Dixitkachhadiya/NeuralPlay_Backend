const express = require('express');
const router = express.Router();
const { playGame, getAiMoveOnly, getHistory, getScore, getLeaderboard } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.post('/play', protect, playGame);
router.post('/ai-move', protect, getAiMoveOnly);
router.get('/history', protect, getHistory);
router.get('/score', protect, getScore);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
