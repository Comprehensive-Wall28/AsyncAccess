require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
const cookieParser=require('cookie-parser')

if (!process.env.SECRET_KEY) {
  console.error("FATAL ERROR: SECRET_KEY environment variable is not set.");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("FATAL ERROR: DATABASE_URI environment variable is not set.");
  process.exit(1);
}
if(!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_SECURE || !process.env.EMAIL_FROM){
  console.error("WARNING : Missing env variables for 2FA function");
}
const port = process.env.PORT ||  3000
const app = express();

const bookingRouter = require("./routes/bookingRoutes.js")
const userRouter = require("./routes/userRoutes.js")
const eventRouter = require("./routes/eventRoutes.js")
const authRouter = require("./routes/authRoutes.js")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use(cors({
  origin:  ['https://asyncaccess.pages.dev', 'https://asyncaccess.pages.dev/', 'http://localhost:5174'], //I hate cors, this will be changed
  credentials: true,
}));

app.use("/api/v1", authRouter); 
app.use("/api/v1/users", userRouter); 
app.use("/api/v1/bookings", bookingRouter); 
app.use("/api/v1/events", eventRouter);

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
  res.status(500).send('Something broke! \n You probably had an invalid input not handled by the method. \n Check the terminal for the error code\n' + 'Error: ' + err.message);
});

startServer();