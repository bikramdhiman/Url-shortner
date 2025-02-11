const express = require("express");
const analyticsController = require("../controllers/analyticsController");
const { getTopicAnalytics } = require("../controllers/analyticsController");
const { getOverallAnalytics } = require("../controllers/analyticsController");
const { getrandom } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/overall", getOverallAnalytics);
router.get("/:alias", analyticsController.getUrlAnalytics);
router.get("/topic/:topic", getTopicAnalytics);

module.exports = router;
