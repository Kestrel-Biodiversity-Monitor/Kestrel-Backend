const Alert = require("../models/Alert");
const asyncHandler = require("../utils/asyncHandler");

const getAlerts = asyncHandler(async (req, res) => {
    const { status, severity } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    const alerts = await Alert.find(filter).populate("createdBy", "name").sort({ createdAt: -1 });
    res.json(alerts);
});

const createAlert = asyncHandler(async (req, res) => {
    const alert = await Alert.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(alert);
});

const updateAlert = asyncHandler(async (req, res) => {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
});

const deleteAlert = asyncHandler(async (req, res) => {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json({ message: "Alert deleted" });
});

const addFeedback = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const alert = await Alert.findByIdAndUpdate(
        req.params.id,
        { $push: { feedbacks: { userId: req.user._id, comment } } },
        { new: true }
    );
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
});

module.exports = { getAlerts, createAlert, updateAlert, deleteAlert, addFeedback };
