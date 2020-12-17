const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    username: {
        type: String,
        unique: false,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    likes: [{
        type: String,
        required: true,
        unique: true
    }],
    comments: [{
        by: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            required: true
        }
    }]
});

postSchema.pre('save', (next) => {
    next();
})
module.exports = mongoose.model('posts', postSchema);

