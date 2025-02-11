const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const session = require("express-session");
require("./src/config/passport");
const app = express();

// Connect to MongoDB
connectDB();
app.set("trust proxy", 1);  

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

console.log(process.env.SESSION_SECRET);
console.log(process.env.PORT);

// Routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/auth", authRoutes);

const urlRoutes = require("./src/routes/urlRoutes");
app.use("/api/shorten", urlRoutes);

const analyticsRoutes = require("./src/routes/analyticsRoutes");
app.use("/api/analytics", analyticsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
