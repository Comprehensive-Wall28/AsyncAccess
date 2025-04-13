const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/emailSender"); // Import email utility
const crypto = require("node:crypto"); //built-in Node.js crypto module
const userController = {
  register: async (req, res) => {
    try {
      const { email, password, name, role, age } = req.body;

      const roles = ['Admin', 'Organizer', 'User'];
      if (!roles.includes(role)) {
        return res.status(400).json({ message: "Invalid role provided" });
      }
      // Check if the user already exists
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

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

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "email not found" });
      }

      console.log("password: ", user.password);

      const isMatch = await user.comparePassword(password); // Use schema method if available

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
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
            //secure: true, // Re-add when not testing
            //SameSite: "none", //Re-add when not testing
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
            new: true,
            runValidators: true
          }
      ).select('-password'); // Exclude password from the user object

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user: updatedUser, msg: "Profile updated successfully" });

    } catch (error) {
      console.error("Error updating current user profile:", error);
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

      if (role === undefined) {
        return res.status(400).json({ message: "Role is required in the request body to update." });
      }

      if(role !== 'Admin' && role !== 'Organizer' && role !== 'User') {
        return res.status(400).json({ message: "Role sent is not valid! (User || Admin || Organizer)" });
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
  updatePassword: async (req, res) => {
    try {
      const {userId} = req.user.userId;
      const {  oldPassword, newPassword } = req.body;


      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Old password and new password are required." });
      }


      const user = await userModel.findById(userId).select('+password'); // Need password to compare
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect old password" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedNewPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },


  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email address is required" });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        console.log(`Password reset requested for non-existent email: ${email}`);
        // Don't notify a potential attacker of a valid email (:
        return res.status(200).json({ message: "If an account with that email exists, a password reset code has been sent." });
      }

      // Generate a 6-digit code
      const resetCode = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit number and convert to string

      // Hash the code before saving
      const hashedCode = crypto
          .createHash("sha256")
          .update(resetCode)
          .digest("hex");

      // Set hashed code and expiry (e.g., 10 minutes)
      user.resetPasswordToken = hashedCode;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      await user.save();

      const message = `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your account from AsyncAccess.</p>
        <p>Enter the following code to reset your password. This code is valid for 10 minutes:</p>
        <h2 style="text-align: center; letter-spacing: 5px; font-size: 2em;">${resetCode}</h2>
        <p>NOTE: Please, do not insert valid credentials like passwords. Testing purposes only! (Penta-Nodes team)</p>
      `;
      const plainTextMessage = `You requested a password reset. Your reset code is: ${resetCode}. It is valid for 10 minutes.`;

      try {
        await sendEmail(
            user.email,
            "Your Password Reset Code",
            plainTextMessage,
            message
        );
        console.log(`Password reset code sent to ${user.email}`);
        return res.status(200).json({ message: "If an account with that email exists, a password reset code has been sent." });
      } catch (emailError) {
        console.error("Failed to send password reset code email:", emailError);
        // Clear the fields if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(500).json({ message: "Error sending password reset email. Please try again later." });
      }

    } catch (error) {
      console.error("Error requesting password reset:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;

      if (!email || !code || !newPassword) {
        return res.status(400).json({ message: "Email, reset code, and new password are required." });
      }
      // Hash the code received from the body to match the stored one
      const hashedCode = crypto
          .createHash("sha256")
          .update(code)
          .digest("hex");

      const user = await userModel.findOne({
        email: email, // Find by email
        resetPasswordToken: hashedCode, // Compare hashed code
        resetPasswordExpires: { $gt: Date.now() }, // Check if code is still valid
      }).select('+password');

      if (!user) {
        const userExists = await userModel.findOne({ email });
        if (userExists) {
          console.log(`Invalid or expired code attempt for email: ${email}`);
        } else {
          console.log(`Password reset attempt for non-existent email: ${email}`);
        }
        return res.status(400).json({ message: "Password reset code is invalid or has expired." });
      }
      // Set the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;

      // Clear the reset token/code fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      return res.status(200).json({ message: "Password has been reset successfully." });

    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ message: "Server error while resetting password" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user, msg: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
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