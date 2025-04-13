const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

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
    age: {
        type: Number,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['User', 'Organizer', 'Admin'],
        default: 'User',
    },
    resetPasswordToken: {
        type: String,
        select: false, 
      },
      resetPasswordExpires: {
        type: Date,
        select: false, 
      }
    }, { timestamps: true }); // Adds createdAt and updatedAt automatically


// Method to compare passwords
userSchema.methods.comparePassword = async function(incomingPassword) {
    return bcrypt.compare(incomingPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;