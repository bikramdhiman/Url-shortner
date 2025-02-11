const Url = require("../models/Url");
const shortid = require("shortid");
const validUrl = require("valid-url");
const useragent = require("useragent");
const geoip = require("geoip-lite");

const rateLimit = require("express-rate-limit");

const urlLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per minute
  message: {
    message: "Too many URL creation attempts, please try again later",
  },
});

// Create Short URL
exports.createShortUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;

    // Validate long URL
    if (!longUrl || !validUrl.isUri(longUrl)) {
      return res
        .status(400)
        .json({ message: "Invalid URL. Please include http:// or https://." });
    }

    // Check if the long URL already exists in the database
    const existingUrl = await Url.findOne({ longUrl });
    if (existingUrl) {
      return res
        .status(400)
        .json({
          message:
            "This URL has already been shortened. Please use the existing short URL.",
        });
    }

    // Check if custom alias already exists
    if (customAlias) {
      const aliasExists = await Url.findOne({ shortUrl: customAlias });
      if (aliasExists) {
        return res
          .status(400)
          .json({
            message: "Custom alias already exists, please choose another one.",
          });
      }
    }

    // Generate short URL
    const shortUrl = customAlias || shortid.generate();

    // Save to database
    const newUrl = new Url({
      longUrl,
      shortUrl,
      customAlias,
      topic,
      createdAt: new Date(),
    });

    await newUrl.save();

    res.status(201).json({ shortUrl, createdAt: newUrl.createdAt });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Redirect Short URL
exports.redirectShortUrl = async (req, res) => {
  try {
    const { alias } = req.params;

    // Find the URL by alias
    const urlData = await Url.findOne({ shortUrl: alias });

    if (!urlData) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Extract request details for analytics
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      "Unknown";

    const agent = useragent.parse(req.headers["user-agent"]);
    console.log("-----" + agent);
    const geo = geoip.lookup(ip) || { country: "Unknown", city: "Unknown" };

    const clickData = {
      ip,
      userAgent: req.headers["user-agent"],
      os: agent.os.toString(),
      browser: agent.family,
      country: geo.country,
      city: geo.city,
      timestamp: new Date(),
    };

    // Store analytics in MongoDB
    urlData.clicks.push(clickData);
    await urlData.save();

    // Redirect the user to the original URL
    return res.redirect(urlData.longUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
