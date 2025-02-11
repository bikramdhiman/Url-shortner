const rateLimit = require("express-rate-limit");

const urlCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 requests per 15 minutes per IP
  message: { message: "Too many URLs created, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = urlCreationLimiter;
