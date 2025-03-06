const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    profilePicture:{
        type: String,
        default: null,
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;