const Url = require("../models/Url");
const moment = require("moment");

// Get URL Analytics
exports.getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;

    // Find the URL by alias
    const urlData = await Url.findOne({ shortUrl: alias });

    if (!urlData) {
      return res.status(404).json({ message: "Short URL not found 1" });
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
