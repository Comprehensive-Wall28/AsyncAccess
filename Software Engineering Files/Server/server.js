require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.env.PORT || 4001;

//temp Models
const User = require('./Models/user.js');
const Event = require('./Models/event.js');
const Booking = require('./Models/booking.js');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:4001'
];

app.use(cors())
app.use(express.json());

//MongoDB Atlas connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Backend started successfully!')
})