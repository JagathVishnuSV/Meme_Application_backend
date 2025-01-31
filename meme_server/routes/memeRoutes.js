const express = require('express');
const { upload } = require("../config/cloudinary");  // Ensure this import is correct
const verifyToken = require('../middlewares/authMiddleware');
const { createMeme, getAllMemes, getMemeById, updateMeme, deleteMeme } = require('../controllers/memeController');

const router = express.Router();

router.get('/memes', getAllMemes);
router.get('/memes/:id', getMemeById);

router.post('/memes/upload', verifyToken, upload.single('image'), createMeme);
router.put('/memes/upload/:id',verifyToken, upload.single('image'), updateMeme);
router.delete('/memes/delete/:id', verifyToken,deleteMeme)

router.post('/memes', verifyToken, createMeme);
router.patch('/memes/:id', verifyToken, updateMeme);
router.delete('/memes/:id', verifyToken, deleteMeme);

module.exports = router;
