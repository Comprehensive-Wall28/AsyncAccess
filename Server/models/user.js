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
    isEmailVerified: { // New field
        type: Boolean,
        default: false,
    },
    emailVerificationToken: { // New field
        type: String,
        select: false, // Typically, tokens should not be selected by default
    },
    emailVerificationTokenExpires: { // New field
        type: Date,
        select: false, // Typically, expiry dates for tokens should not be selected by default
    },
    resetPasswordToken: {
        type: String,
        select: false, 
      },
      resetPasswordExpires: {
        type: Date,
        select: false, 
      }
    }, { timestamps: true }); 


// Method to compare passwords
userSchema.methods.comparePassword = async function(incomingPassword) {
    return bcrypt.compare(incomingPassword, this.password);
};

userSchema.index({ email: 1, resetPasswordToken: 1, resetPasswordExpires: 1 });
userSchema.index({ email: 1, emailVerificationToken: 1, emailVerificationTokenExpires: 1 }); // Optional: index for email verification fields

const User = mongoose.model('User', userSchema);
module.exports = User;