const express = require("express");
const router = express.Router();
const { createReport, getReports, getReportById, getMapReports, updateReportStatus, bulkCsvUpload } = require("../controllers/reportController");
const { protect } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleGuard");
const upload = require("../middlewares/upload");

router.get("/map", protect, getMapReports);
router.get("/", protect, getReports);
router.get("/:id", protect, getReportById);
router.post("/", protect, upload.single("image"), createReport);
router.post("/bulk-csv", protect, upload.single("csv"), bulkCsvUpload);
router.patch("/:id/status", protect, requireRole("admin"), updateReportStatus);

module.exports = router;
