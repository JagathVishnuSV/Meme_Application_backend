const mongoose = require('mongoose')
const memeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true,'Title is required'],
            trim: true,
            maxlength :[100,'Title cannot exceed 100 characters'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Image url is required'],
        },
        author: {
            type : mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: [true, 'Author is required'],
        },
        likes: {
            type:[String],
            default:[],
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {timestamps:true}
)

module.exports = mongoose.model('Meme',memeSchema)
