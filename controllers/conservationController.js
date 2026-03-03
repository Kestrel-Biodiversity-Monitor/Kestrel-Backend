const ConservationZone = require("../models/ConservationZone");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/conservation
const getAllZones = asyncHandler(async (req, res) => {
    const { zoneType, threatLevel, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (zoneType) filter.zoneType = zoneType;
    if (threatLevel) filter.threatLevel = threatLevel;
    if (search) filter.name = { $regex: search, $options: "i" };

    const total = await ConservationZone.countDocuments(filter);
    const zones = await ConservationZone.find(filter)
        .populate("createdBy", "name")
        .populate("region", "name state")
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({ zones, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/conservation/:id
const getZoneById = asyncHandler(async (req, res) => {
    const zone = await ConservationZone.findById(req.params.id)
        .populate("createdBy", "name")
        .populate("region", "name state")
        .populate("protectedSpecies", "name scientificName conservationStatus");
    if (!zone) return res.status(404).json({ message: "Conservation zone not found" });
    res.json(zone);
});

// POST /api/conservation
const createZone = asyncHandler(async (req, res) => {
    const zone = await ConservationZone.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(zone);
});

// PUT /api/conservation/:id
const updateZone = asyncHandler(async (req, res) => {
    const zone = await ConservationZone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!zone) return res.status(404).json({ message: "Zone not found" });
    res.json(zone);
});

// DELETE /api/conservation/:id
const deleteZone = asyncHandler(async (req, res) => {
    const zone = await ConservationZone.findByIdAndDelete(req.params.id);
    if (!zone) return res.status(404).json({ message: "Zone not found" });
    res.json({ message: "Conservation zone deleted" });
});

module.exports = { getAllZones, getZoneById, createZone, updateZone, deleteZone };
