const Meme = require('../models/Meme')
const verifyToken = require('../middlewares/authMiddleware');
const {cloudinary,upload} = require('../config/cloudinary')
const createMeme = async (req, res) => {
    try {
        const { title, tags } = req.body;  // No need to include imageUrl here anymore
        const userId = req.user.userId;

        console.log("Request file:", req.file);  // Check if the file is being sent correctly

        if (!title || !req.file) {  // Ensure file is uploaded as part of the request
            return res.status(400).json({ message: "Title and Image are required." });
        }

        // Ensure the userId is valid
        if (!userId) {
            return res.status(400).json({ message: "User is not authenticated." });
        }

        // Upload to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
        console.log("Cloudinary upload response:", uploadResponse);  // Log the Cloudinary response

        // Create a new meme with the returned Cloudinary URL
        const newMeme = await Meme.create({
            title,
            imageUrl: uploadResponse.secure_url,  // Save the Cloudinary URL to the meme's imageUrl field
            author: userId,
            tags,
            likes: [],  // Default empty array for likes
        });

        res.status(201).json({
            message: 'Meme created successfully',
            meme: newMeme,
        });

    } catch (error) {
        console.error("Error creating meme:", error);  // Log error for debugging
        res.status(500).json({
            message: 'Error creating meme.',
            error: error.message,
        });
    }
};


const getAllMemes = async (req,res)=>{
    try{
        const memes = await Meme.find().populate('author','username email')
        res.status(200).json(memes)
    }
    catch(error){
        res.status(500).json({message: 'Error fetching memes.', error: error.message})
    }
}

const getMemeById = async(req,res)=>{
    try{
        const {id}=req.params;
        const meme = await Meme.findById(id).populate('author','username email')
        if(!meme){
            return res.status(404).json({ message: 'Meme not found.'})
        }
        res.status(200).json(meme);
    }
    catch(error){
        res.status(500).json({message: 'Error fetching meme.', error: error.message})
    }
}
const updateMeme = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        const memeId = req.params.id;
        const meme = await Meme.findById(memeId);

        if (!meme) {
            return res.status(404).json({ message: 'Meme not found.' });
        }

        console.log("Meme Author ID:", meme.author.toString());
        console.log("User ID from Token:", req.user.userId);

        // Check if the logged-in user is the author of the meme
        if (meme.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to update this meme.' });
        }

        // Proceed with the update
        const updatedMeme = await Meme.findByIdAndUpdate(memeId, req.body, { new: true });
        res.status(200).json({
            message: 'Meme updated successfully.',
            meme: updatedMeme,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating meme.',
            error: error.message,
        });
    }
};

const deleteMeme = async (req, res) => {
    try {
        const { id } = req.params;  // Get meme ID from the request params
        const userId = req.user ? req.user.userId : null;

        const meme = await Meme.findById(id);
        if (!meme) {
            return res.status(404).json({ message: 'Meme not found.' });
        }

        // Ensure the user is the author
        if (meme.author.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this meme.' });
        }

        // Delete image from Cloudinary
        const publicId = meme.imageUrl.split('/').pop().split('.')[0];  // Extract public ID from URL
        await cloudinary.uploader.destroy(publicId);  // Delete image from Cloudinary

        // Delete meme from database
        await meme.deleteOne({_id:id})

        res.status(200).json({
            message: 'Meme deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting meme.',
            error: error.message,
        });
    }
};


module.exports = {createMeme,getAllMemes,getMemeById,updateMeme,deleteMeme}
