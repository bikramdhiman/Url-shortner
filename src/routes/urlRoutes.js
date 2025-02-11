const express = require("express");
const { createShortUrl } = require("../controllers/urlController");
const urlCreationLimiter = require("../middleware/rateLimit");
const { redirectShortUrl } = require("../controllers/urlController");
//const { urlLimiter } = require("../middleware/rateLimit");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const urlLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per minute
  message: {
    message: "Too many URL creation attempts, please try again later",
  },
});

router.post("/", urlLimiter, createShortUrl);
router.get("/:alias", redirectShortUrl);

module.exports = router;
