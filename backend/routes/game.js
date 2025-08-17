const express = require('express');
const router = express.Router();
const { getGames, recordGamePlay } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getGames);
router.post('/:id/play', protect, recordGamePlay);

module.exports = router;
