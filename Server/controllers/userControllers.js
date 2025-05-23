const userModel = require("../models/user");
const bookingModel = require("../models/booking");
const eventModel = require("../models/event");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/emailSender");
const crypto = require("node:crypto");
const userController = {
  register: async (req, res) => {
    try {
      const { email, password, name, role, age } = req.body;

      const roles = ['Admin', 'Organizer', 'User'];
      if (!roles.includes(role)) {
        return res.status(400).json({ message: "Invalid role provided. Inserts: Admin , User , Organizer" });
      }

      if(!email || !password || !name || !role){
        return res.status(400).json({ message: "Missing fields. Please provide Name, Email, Password and Role" });

      }
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        email,
        password: hashedPassword,
        name,
        role,
        age,
      });

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

      if(!email || !password){
        return res.status(400).json({ message: "Missing fields. Please provide Email and Password" });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const currentDateTime = new Date();
      const expiresAt = new Date(+currentDateTime + 1800000);

      // Generate a JWT token
      const token = jwt.sign(
          { user: { userId: user._id, role: user.role } },
          secretKey,
          {
            expiresIn: 3 * 60 * 60,
          }
      );

      const currentUser = {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age
     };
     const isProduction = process.env.NODE_ENV === 'production';

      return res
        .cookie("token", token, { // Set the token cookie
          expires: expiresAt,
          httpOnly: true,
          secure: isProduction, // Set to true in production (HTTPS)
          sameSite: isProduction ? "none" : "lax", // "none" for cross-site requests in production
        })
        .status(200)
        .json({ message: "Logged in successfully", currentUser });

    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error. Check console for more details." });
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
      console.error("Error fetching users:", e);
      return res.status(500).json({ message: "Server error while fetching users" });
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
      const updateData = {}; // Initialize empty update object
      const allowedFields = ['name', 'age']; // Fields from req.body that are allowed

      // Handle file validation error from multer's fileFilter
      if (req.fileValidationError) {
        return res.status(400).json({ message: req.fileValidationError });
      }

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      // Handle profile picture update from uploaded file
      if (req.file) {
        // Path to be stored, e.g., '/uploads/profile-pictures/your-file-name.jpg'
        // This path assumes your server is set up to serve static files from a 'public' directory
        // and multer saves files into 'public/uploads/profile-pictures/'
        updateData.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
      } else if (req.body.profilePicture !== undefined && (req.body.profilePicture === "" || req.body.profilePicture === null)) {
        // Allow clearing the profile picture by sending an empty string or null in the body
        // This is useful if you want to allow users to remove their picture without uploading a new one.
        updateData.profilePicture = null;
      }

      // Check if there's anything to update
      if (Object.keys(updateData).length === 0 && !req.file) { // also check req.file if it's the only update
        return res.status(400).json({ message: "No valid fields provided for update." });
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $set: updateData }, // Use $set to only update provided fields
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
       if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer error: ${error.message}` });
       }
       if (error.name === 'ValidationError') { // Mongoose validation error
           return res.status(400).json({ message: "Validation failed", errors: error.errors });
       }
      return res.status(500).json({ message: "Server error while updating profile." });
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
  updatePasswordLoggedIn: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { oldPassword, newPassword } = req.body;


      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Old password and new password are required." });
      }

      const user = await userModel.findById(userId).select('+password');
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
      console.error("Error updating password:", error);
      return res.status(500).json({ message: "Server error while updating password" });
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
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const cascadeMessage = await userController.deleteUserData(user._id, user.role);

      await userModel.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        msg: `User deleted successfully. Cascade actions:\n${cascadeMessage}`,
        user: { _id: user._id, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: error.message || "Server error during user deletion process." });
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const userId = req.user.userId;

      // Include profilePicture in the select statement
      const user = await userModel.findById(userId).select('_id name email role age profilePicture');

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);

    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Server error while fetching user profile" });
    }
  },
  deleteUserData: async (userId, userRole) => {
    let messages = [];
    try {
      if (userRole === 'Organizer') {
        const eventsToDelete = await eventModel.find({ organizer: userId }).select('_id');

        if (eventsToDelete.length > 0) {
          const eventIdsToDelete = eventsToDelete.map(event => event._id);

          const bookingDeletionResult = await bookingModel.deleteMany({ event: { $in: eventIdsToDelete } });
          const bookingMsg = `Deleted ${bookingDeletionResult.deletedCount} bookings associated with the organizer's events.`;
          console.log(bookingMsg);
          messages.push(bookingMsg);

          const eventDeletionResult = await eventModel.deleteMany({ _id: { $in: eventIdsToDelete } });
          const eventMsg = `Deleted ${eventDeletionResult.deletedCount} events organized by the user.`;
          console.log(eventMsg);
          messages.push(eventMsg);

        } else {
          const noEventMsg = "No events found for this organizer to delete.";
          console.log(noEventMsg);
          messages.push(noEventMsg);
        }

      } else if (userRole === 'User') {
        const confirmedBookings = await bookingModel.find({
          user: userId,
          bookingStatus: 'Confirmed'
        }).select('event numberOfTickets');

        if (confirmedBookings.length > 0) {
          let updatedEventCount = 0;
          for (const booking of confirmedBookings) {
            try {
              const updateResult = await eventModel.findOneAndUpdate(
                  { _id: booking.event, status: 'approved' },
                  { $inc: { bookedTickets: -booking.numberOfTickets } }, // Action: Decrement bookedTickets
                  { new: true, runValidators: true }
              );
              if (updateResult) {
                updatedEventCount++;
                console.log(`Returned ${booking.numberOfTickets} tickets to event ${booking.event}`);
              } else {
                console.warn(`Could not find event ${booking.event} to return tickets for booking ${booking._id}`);
              }
            } catch (eventUpdateError) {
              console.error(`Error returning tickets for event ${booking.event} from booking ${booking._id}:`, eventUpdateError);
              messages.push(`Error updating event ${booking.event}: ${eventUpdateError.message}`);
            }
          }
          if (updatedEventCount > 0) {
            messages.push(`Returned tickets to ${updatedEventCount} events due to user deletion.`);
          }
        } else {
          messages.push("No confirmed bookings found for this user to return tickets from.");
        }

        const bookingDeletionResult = await bookingModel.deleteMany({ user: userId });
        const userBookingMsg = `Deleted ${bookingDeletionResult.deletedCount} total bookings made by the user.`;
        console.log(userBookingMsg);
        messages.push(userBookingMsg);

      } else {
        const otherRoleMsg = `No specific data cascade defined for role: ${userRole}.`;
        console.log(otherRoleMsg);
        messages.push(otherRoleMsg);
      }

      return messages.join('\n');

    } catch (error) {
      console.error(`Error deleting associated data for user ID ${userId} with role ${userRole}:`, error);
      throw new Error(`Failed to delete associated data: ${error.message}`);
    }
  },
  logout: async (req, res) => {
    try {
      // Clear the token cookie
      res.clearCookie('token', { httpOnly: true, sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', secure: process.env.NODE_ENV === 'production' });
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ message: "Server error during logout." });
    }
  }
};

module.exports = userController;