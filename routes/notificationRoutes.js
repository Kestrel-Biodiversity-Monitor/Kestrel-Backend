const express = require("express");
const router = express.Router();
const { getMyNotifications, markRead, markAllRead, deleteNotification, createNotification } = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleGuard");

router.get("/", protect, getMyNotifications);
router.patch("/read-all", protect, markAllRead);
router.patch("/:id/read", protect, markRead);
router.delete("/:id", protect, deleteNotification);
router.post("/", protect, requireRole("admin"), createNotification);

module.exports = router;
