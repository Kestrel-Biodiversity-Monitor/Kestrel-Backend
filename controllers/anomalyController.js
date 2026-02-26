const Anomaly = require("../models/Anomaly");
const asyncHandler = require("../utils/asyncHandler");

const getAnomalies = asyncHandler(async (req, res) => {
    const anomalies = await Anomaly.find().populate("reportedBy", "name").sort({ detectedAt: -1 });
    res.json(anomalies);
});

const createAnomaly = asyncHandler(async (req, res) => {
    const anomaly = await Anomaly.create({ ...req.body, reportedBy: req.user._id });
    res.status(201).json(anomaly);
});

const reviewAnomaly = asyncHandler(async (req, res) => {
    const { status, reviewNotes } = req.body;
    const anomaly = await Anomaly.findByIdAndUpdate(
        req.params.id,
        { status, reviewNotes },
        { new: true }
    );
    if (!anomaly) return res.status(404).json({ message: "Anomaly not found" });
    res.json(anomaly);
});

const deleteAnomaly = asyncHandler(async (req, res) => {
    const a = await Anomaly.findByIdAndDelete(req.params.id);
    if (!a) return res.status(404).json({ message: "Anomaly not found" });
    res.json({ message: "Anomaly deleted" });
});

module.exports = { getAnomalies, createAnomaly, reviewAnomaly, deleteAnomaly };
