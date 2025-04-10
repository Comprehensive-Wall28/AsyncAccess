const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

const userController = {
    registerUser: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "Email already in use" });
            }

            const hashedPassword = await bcrypt.hash(password, 10); //to hash the password using bcrypt

            // Create user
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'Standard User'
            });

            res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Server error during registration" });
        }
    },

    loginUser: async (req, res) => {
        try {
            console.log("Login attempt for:", req.body.email); // Log incoming request

            const { email, password } = req.body;
            if (!email || !password) {
                console.log("Missing credentials");
                return res.status(400).json({ message: "Email and password required" });
            }

            console.log("Searching for user...");
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                console.log("User not found in database");
                return res.status(404).json({ message: "Email not found" });
            }

            console.log("Comparing passwords...");
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log("Password mismatch");
                return res.status(401).json({ message: "Incorrect password" });
            }

            console.log("Creating token...");
            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_SECRET, // Changed from secretKey to process.env.JWT_SECRET
                { expiresIn: '3h' }
            );

            console.log("Setting cookie...");
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3 * 60 * 60 * 1000
            });

            console.log("Login successful");
            res.status(200).json({
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error("FULL LOGIN ERROR:", error); // Detailed error log
            res.status(500).json({
                message: "Server error during login",
                error: error.message // Include the actual error message
            });
        }
    }
};

module.exports = userController;
