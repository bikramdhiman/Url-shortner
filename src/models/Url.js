const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, unique: true, required: true },
  topic: { type: String },
  createdAt: { type: Date, default: Date.now },
  clicks: [
    {
      timestamp: { type: Date, default: Date.now },
      ip: String,
      userAgent: String,
      os: String,
      browser: String,
      country: String,
      city: String,
    },
  ],
});

module.exports = mongoose.model("Url", UrlSchema);
