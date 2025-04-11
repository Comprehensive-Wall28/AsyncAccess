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
const eventRouter = require("./routes/eventRoutes.js")
const authRouter = require("./routes/authRoutes.js").default
const authenticationMiddleware=require('./middleware/authenticationMiddleware')

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4001'
];

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);
//app.use("/api/v1/event", eventRouter);
//app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/auth", authRouter);
app.use(authenticationMiddleware);


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