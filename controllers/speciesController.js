const Species = require("../models/Species");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/species
const getSpecies = asyncHandler(async (req, res) => {
    const { category, status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.conservationStatus = status;
    if (search) filter.name = { $regex: search, $options: "i" };

    const total = await Species.countDocuments(filter);
    const species = await Species.find(filter)
        .populate("createdBy", "name")
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({ species, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/species/:id
const getSpeciesById = asyncHandler(async (req, res) => {
    const species = await Species.findById(req.params.id).populate("createdBy", "name");
    if (!species) return res.status(404).json({ message: "Species not found" });
    res.json(species);
});

// POST /api/species (admin/researcher)
const createSpecies = asyncHandler(async (req, res) => {
    const data = { ...req.body, createdBy: req.user._id };
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
    const species = await Species.create(data);
    res.status(201).json(species);
});

// PUT /api/species/:id (admin)
const updateSpecies = asyncHandler(async (req, res) => {
    const species = await Species.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!species) return res.status(404).json({ message: "Species not found" });
    res.json(species);
});

// DELETE /api/species/:id (admin)
const deleteSpecies = asyncHandler(async (req, res) => {
    const species = await Species.findByIdAndDelete(req.params.id);
    if (!species) return res.status(404).json({ message: "Species not found" });
    res.json({ message: "Species deleted" });
});

module.exports = { getSpecies, getSpeciesById, createSpecies, updateSpecies, deleteSpecies };
