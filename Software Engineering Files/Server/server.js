const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4001;

//temp Models
const User = require('../Models/user.js');
const Event = require('../Models/event.js');
const Booking = require('../Models/booking.js');


const app = express();
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