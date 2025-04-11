const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas Connected...');

  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;