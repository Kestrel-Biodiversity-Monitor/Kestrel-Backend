const SpeciesReport = require("../models/SpeciesReport");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const csv = require("csv-parse/sync");
const fs = require("fs");

// POST /api/reports
const createReport = asyncHandler(async (req, res) => {
    const { speciesId, speciesName, lng, lat, regionName, habitatType, observationType,
        numberOfIndividuals, weatherCondition, riskLevel, description, surveyName } = req.body;

    if (!lng || !lat) return res.status(400).json({ message: "Location coordinates required" });

    const report = await SpeciesReport.create({
        userId: req.user._id,
        speciesId: speciesId || undefined,
        speciesName,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        location: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)], regionName },
        habitatType, observationType, numberOfIndividuals: Number(numberOfIndividuals) || 1,
        weatherCondition, riskLevel, description, surveyName,
    });

    // Increment contribution score
    await User.findByIdAndUpdate(req.user._id, { $inc: { contributionScore: 10 } });

    const populated = await report.populate("userId", "name email");
    res.status(201).json(populated);
});

// GET /api/reports
const getReports = asyncHandler(async (req, res) => {
    const { status, riskLevel, page = 1, limit = 20, userId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (riskLevel) filter.riskLevel = riskLevel;
    if (userId) filter.userId = userId;

    // Non-admin users only see their own + approved
    if (req.user.role === "user") {
        filter.$or = [{ userId: req.user._id }, { status: "approved" }];
    }

    const total = await SpeciesReport.countDocuments(filter);
    const reports = await SpeciesReport.find(filter)
        .populate("userId", "name email")
        .populate("speciesId", "name category")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({ reports, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/reports/:id
const getReportById = asyncHandler(async (req, res) => {
    const report = await SpeciesReport.findById(req.params.id)
        .populate("userId", "name email")
        .populate("speciesId", "name category conservationStatus");
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
});

// GET /api/reports/map – all approved with coords
const getMapReports = asyncHandler(async (req, res) => {
    const reports = await SpeciesReport.find({ status: "approved" })
        .select("location speciesName riskLevel createdAt userId")
        .populate("userId", "name")
        .limit(500);
    res.json(reports);
});

// PATCH /api/reports/:id/status (admin)
const updateReportStatus = asyncHandler(async (req, res) => {
    const { status, adminNote } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    const report = await SpeciesReport.findByIdAndUpdate(
        req.params.id,
        { status, adminNote },
        { new: true }
    ).populate("userId", "name email");
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
});

// POST /api/reports/bulk-csv
const bulkCsvUpload = asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "CSV file required" });
    const content = fs.readFileSync(req.file.path, "utf-8");
    let rows;
    try {
        rows = csv.parse(content, { columns: true, skip_empty_lines: true });
    } catch {
        return res.status(400).json({ message: "Invalid CSV format" });
    }
    fs.unlinkSync(req.file.path);

    const reports = rows.map((r) => ({
        userId: req.user._id,
        speciesName: r.speciesName || r.species_name,
        location: {
            type: "Point",
            coordinates: [parseFloat(r.lng || r.longitude), parseFloat(r.lat || r.latitude)],
            regionName: r.region || "",
        },
        habitatType: r.habitatType || "Other",
        observationType: r.observationType || "Visual",
        numberOfIndividuals: parseInt(r.numberOfIndividuals || "1"),
        riskLevel: r.riskLevel || "Low",
        description: r.description || "",
        isBulkUpload: true,
        surveyName: r.surveyName || "",
    }));

    const inserted = await SpeciesReport.insertMany(reports);
    await User.findByIdAndUpdate(req.user._id, { $inc: { contributionScore: inserted.length * 5 } });
    res.status(201).json({ inserted: inserted.length, message: "Bulk upload successful" });
});

module.exports = { createReport, getReports, getReportById, getMapReports, updateReportStatus, bulkCsvUpload };
