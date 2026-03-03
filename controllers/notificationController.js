const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/notifications — current user's notifications
const getMyNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    res.json({ notifications, unreadCount });
});

// PATCH /api/notifications/:id/read
const markRead = asyncHandler(async (req, res) => {
    const n = await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { isRead: true },
        { new: true }
    );
    if (!n) return res.status(404).json({ message: "Notification not found" });
    res.json(n);
});

// PATCH /api/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
});

// DELETE /api/notifications/:id
const deleteNotification = asyncHandler(async (req, res) => {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Notification deleted" });
});

// POST /api/notifications — admin can push notifications
const createNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
});

module.exports = { getMyNotifications, markRead, markAllRead, deleteNotification, createNotification };
