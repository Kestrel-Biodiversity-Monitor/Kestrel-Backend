const express = require("express");
const router = express.Router();
const { getAllZones, getZoneById, createZone, updateZone, deleteZone } = require("../controllers/conservationController");
const { protect } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleGuard");

router.get("/", protect, getAllZones);
router.get("/:id", protect, getZoneById);
router.post("/", protect, requireRole("officer", "admin"), createZone);
router.put("/:id", protect, requireRole("officer", "admin"), updateZone);
router.delete("/:id", protect, requireRole("admin"), deleteZone);

module.exports = router;
