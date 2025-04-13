require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
const cookieParser=require('cookie-parser')

const port = process.env.PORT || 4001;

const app = express();

const bookingRouter = require("./routes/bookingRoutes.js")
const userRouter = require("./routes/userRoutes.js")
//const eventRouter = require("./routes/eventRoutes.js")
const authRouter = require("./routes/authRoutes.js").default

app.use(cors({
  origin: process.env.ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/api/v1", authRouter); //MAKE IT NOT /auth

app.use("/api/v1/users", userRouter); 
//app.use("/api/v1/events", eventRouter); 
app.use("/api/v1/bookings", bookingRouter); 



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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

startServer();