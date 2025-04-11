const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const userController = {
  register: async (req, res) => {
    try {
      const { email, password, name, role, age } = req.body;

      // Check if the user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new userModel({
        email,
        password: hashedPassword,
        name,
        role,
        age,
      });

      // Save the user to the database
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "email not found" });
      }

      console.log("password: ", user.password);
      // Check if the password is correct

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(405).json({ message: "incorect password" });
      }

      const currentDateTime = new Date();
      const expiresAt = new Date(+currentDateTime + 18000000);
      // Generate a JWT token
      const token = jwt.sign(
          { user: { userId: user._id, role: user.role } },
          secretKey,
          {
            expiresIn: 3 * 60 * 60,
          }
      );

      return res
        .cookie("token", token, {
          expires: expiresAt,
          httpOnly: true,
          //secure: true, // if not working on thunder client , remove it
          //SameSite: "none",
        })
        .status(200)
        .json({ message: "login successfully", user });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.find().select('-password');
      if (!users) {
        return res.status(404).json({ message: "No users exist!" });
      }
      return res.status(200).json(users);

    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id).select('-password');
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);

    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return res.status(500).json({ message: "Server error while fetching user" });
    }
  },
  updateCurrentUserProfile: async (req, res) => {
    try {
      const userId = req.user.userId; 
      const updateData = {};
      const allowedFields = ['name', 'age']; 

      // Build the updateData object only with allowed fields present in the body
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      // Check if there's anything valid to update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update." });
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true, // Return the updated document
          runValidators: true // Ensure schema validation runs on update
        }
      ).select('-password'); // Exclude password from the returned user object

      if (!updatedUser) {
        // This case should be rare if the token is valid, but good practice
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user: updatedUser, msg: "Profile updated successfully" });

    } catch (error) {
      console.error("Error updating current user profile:", error);
       // Handle potential validation errors from Mongoose
       if (error.name === 'ValidationError') {
           return res.status(400).json({ message: "Validation failed", errors: error.errors });
       }
      return res.status(500).json({ message: "Server error while updating profile" });
    }
  },
  updateUserById: async (req, res) => {
    try {
      const userIdToUpdate = req.params.id; 
      const { role } = req.body; 

      if (role === undefined) { // Use 'undefined' check as an empty string might be invalid but present
        return res.status(400).json({ message: "Role is required in the request body to update." });
      }
      
      const validRoles = ['Admin', 'Organizer', 'User']; // Make sure these match your schema/system roles
      if (!validRoles.includes(role)) {
          return res.status(400).json({ message: `Invalid role provided. Must be one of: ${validRoles.join(', ')}` });
      }
      const updateData = { role: role };

      const updatedUser = await userModel.findByIdAndUpdate(
        userIdToUpdate,
        updateData, 
        {
          new: true, 
          runValidators: true 
        }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user: updatedUser, msg: "User role updated successfully by admin" });

    } catch (error) {
      console.error("Error updating user role by ID:", error);
       if (error.name === 'ValidationError') {
           return res.status(400).json({ message: "Validation failed", errors: error.errors });
       }
      return res.status(500).json({ message: "Server error while updating user role" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      return res.status(200).json({ user, msg: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getCurrentUser: async (req, res) => { 
    try {
      const userId = req.user.userId;

      const user = await userModel.findById(userId).select('_id name email role age'); 

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);

    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Server error while fetching user profile" });
    }
  },
};

module.exports = userController;