const mongoose = require('mongoose');

const LoggedSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    token: {
        type: String,
        required: false,
        default: ()=>'lato-' + Math.round(Math.random() * 9999)
    }

});

module.exports = mongoose.model('loggedUser', LoggedSchema);