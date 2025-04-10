require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');

const port = process.env.PORT || 4001;

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:4001'
];

app.use(cors({ origin: allowedOrigins }))
app.use(express.json());

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

// Routes
app.get('/', (req, res) => {
  res.send('Backend started successfully!')
})

startServer();