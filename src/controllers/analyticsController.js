const Url = require("../models/Url");
const moment = require("moment");
const useragent = require("useragent");

// Get URL Analytics
exports.getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;

    // Find the URL by alias
    const urlData = await Url.findOne({ shortUrl: alias });

    if (!urlData) {
      return res.status(404).json({ message: "Short URL not found 2" });
    }

    const clicks = urlData.clicks;

    // Total Clicks
    const totalClicks = clicks.length;

    // Unique Users (by unique IP)
    const uniqueUsers = new Set(clicks.map((click) => click.ip)).size;

    // Clicks By Date (Last 7 Days)
    const last7Days = moment().subtract(7, "days").startOf("day");
    const clicksByDate = {};

    clicks.forEach((click) => {
      const date = moment(click.timestamp).format("YYYY-MM-DD");
      if (moment(click.timestamp).isAfter(last7Days)) {
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      }
    });

    const clicksByDateArray = Object.keys(clicksByDate).map((date) => ({
      date,
      count: clicksByDate[date],
    }));

    // OS Type Analytics
    const osStats = {};
    clicks.forEach((click) => {
      const osName = click.os || "Unknown";
      osStats[osName] = osStats[osName] || {
        uniqueClicks: 0,
        uniqueUsers: new Set(),
      };
      osStats[osName].uniqueClicks += 1;
      osStats[osName].uniqueUsers.add(click.ip);
    });

    const osTypeArray = Object.keys(osStats).map((osName) => ({
      osName,
      uniqueClicks: osStats[osName].uniqueClicks,
      uniqueUsers: osStats[osName].uniqueUsers.size,
    }));

    // Device Type Analytics
    const deviceStats = {};
    clicks.forEach((click) => {
      const deviceName = click.device || "Unknown";
      deviceStats[deviceName] = deviceStats[deviceName] || {
        uniqueClicks: 0,
        uniqueUsers: new Set(),
      };
      deviceStats[deviceName].uniqueClicks += 1;
      deviceStats[deviceName].uniqueUsers.add(click.ip);
    });

    const deviceTypeArray = Object.keys(deviceStats).map((deviceName) => ({
      deviceName,
      uniqueClicks: deviceStats[deviceName].uniqueClicks,
      uniqueUsers: deviceStats[deviceName].uniqueUsers.size,
    }));

    // Return Analytics Response
    res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate: clicksByDateArray,
      osType: osTypeArray,
      deviceType: deviceTypeArray,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Topic-Based Analytics
exports.getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;

    // Find all URLs under the specified topic
    const urls = await Url.find({ topic });

    if (!urls.length) {
      return res.status(404).json({ message: "No URLs found for this topic" });
    }

    let totalClicks = 0;
    let uniqueUsers = new Set();
    let clicksByDate = {};

    // Process each URL to aggregate analytics
    const urlAnalytics = urls.map((url) => {
      const clicks = url.clicks;
      totalClicks += clicks.length;

      // Track unique users across all URLs in this topic
      clicks.forEach((click) => {
        uniqueUsers.add(click.ip);
        const date = moment(click.timestamp).format("YYYY-MM-DD");
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      });

      return {
        shortUrl: url.shortUrl,
        totalClicks: clicks.length,
        uniqueUsers: new Set(clicks.map((click) => click.ip)).size,
      };
    });

    // Convert clicksByDate object to an array
    const clicksByDateArray = Object.keys(clicksByDate).map((date) => ({
      date,
      count: clicksByDate[date],
    }));

    res.json({
      totalClicks,
      uniqueUsers: uniqueUsers.size,
      clicksByDate: clicksByDateArray,
      urls: urlAnalytics,
    });
  } catch (error) {
    console.error("Topic Analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOverallAnalytics = async (req, res) => {
  console.log("printting");
  try {
    // Fetch all short URLs
    const urls = await Url.find({});

    console.log(urls);

    if (!urls.length) {
      return res
        .status(404)
        .json({ message: "No short URLs found in the database" });
    }

    let totalClicks = 0;
    let uniqueUsers = new Set();
    let clicksByDate = {};
    let osStats = {};
    let deviceStats = {};

    urls.forEach((url) => {
      console.log("Processing URL:", url.shortUrl); // Debugging Log

      const clicks = url.clicks;
      totalClicks += clicks.length;

      clicks.forEach((click) => {
        uniqueUsers.add(click.ip);

        // Clicks by Date
        const date = moment(click.timestamp).format("YYYY-MM-DD");
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;

        // OS Type Analytics
        const osName = click.os || "Unknown";
        osStats[osName] = osStats[osName] || {
          uniqueClicks: 0,
          uniqueUsers: new Set(),
        };
        osStats[osName].uniqueClicks += 1;
        osStats[osName].uniqueUsers.add(click.ip);

        // Device Type Analytics
        const deviceName = click.device || "Unknown";
        deviceStats[deviceName] = deviceStats[deviceName] || {
          uniqueClicks: 0,
          uniqueUsers: new Set(),
        };
        deviceStats[deviceName].uniqueClicks += 1;
        deviceStats[deviceName].uniqueUsers.add(click.ip);
      });
    });

    console.log("Total URLs Processed:", urls.length);
    console.log("Total Clicks:", totalClicks);

    res.json({
      totalUrls: urls.length,
      totalClicks,
      uniqueUsers: uniqueUsers.size,
      clicksByDate: Object.keys(clicksByDate).map((date) => ({
        date,
        count: clicksByDate[date],
      })),
      osType: Object.keys(osStats).map((osName) => ({
        osName,
        uniqueClicks: osStats[osName].uniqueClicks,
        uniqueUsers: osStats[osName].uniqueUsers.size,
      })),
      deviceType: Object.keys(deviceStats).map((deviceName) => ({
        deviceName,
        uniqueClicks: deviceStats[deviceName].uniqueClicks,
        uniqueUsers: deviceStats[deviceName].uniqueUsers.size,
      })),
    });
  } catch (error) {
    console.error("Error fetching overall analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getrandom = async (req, res) => {
  try {
    res.status(200).json({ message: "Get todos" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
