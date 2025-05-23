const mongoose = require('mongoose');
require('dotenv').config();
uri = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB Atlas Connected...');

  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;