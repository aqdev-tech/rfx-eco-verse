const express = require('express');
const router = express.Router();
const { getNfts, getNftById, buyNft } = require('../controllers/nftController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getNfts);
router.get('/:id', getNftById);
router.post('/:id/buy', protect, buyNft);

module.exports = router;
