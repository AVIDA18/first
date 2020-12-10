const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    name: String
});

module.exports = mongoose.model('users', usersSchema);

