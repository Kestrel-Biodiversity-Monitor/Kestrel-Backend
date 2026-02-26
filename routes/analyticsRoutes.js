const express = require("express");
const router = express.Router();
const { speciesCount, monthlyTrends, regionSummary, comparison } = require("../controllers/analyticsController");

router.get("/species-count", speciesCount);
router.get("/monthly-trends", monthlyTrends);
router.get("/region-summary", regionSummary);
router.get("/comparison", comparison);

module.exports = router;
