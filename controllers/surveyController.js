const Survey = require("../models/Survey");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/surveys
const getAllSurveys = asyncHandler(async (req, res) => {
    const { status, surveyType, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (surveyType) filter.surveyType = surveyType;
    if (search) filter.title = { $regex: search, $options: "i" };

    const total = await Survey.countDocuments(filter);
    const surveys = await Survey.find(filter)
        .populate("createdBy", "name")
        .populate("leadOfficer", "name")
        .sort({ startDate: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    res.json({ surveys, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/surveys/:id
const getSurveyById = asyncHandler(async (req, res) => {
    const survey = await Survey.findById(req.params.id)
        .populate("createdBy", "name")
        .populate("leadOfficer", "name email")
        .populate("assignedOfficers", "name email");
    if (!survey) return res.status(404).json({ message: "Survey not found" });
    res.json(survey);
});

// POST /api/surveys
const createSurvey = asyncHandler(async (req, res) => {
    const survey = await Survey.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(survey);
});

// PUT /api/surveys/:id
const updateSurvey = asyncHandler(async (req, res) => {
    const survey = await Survey.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!survey) return res.status(404).json({ message: "Survey not found" });
    res.json(survey);
});

// DELETE /api/surveys/:id
const deleteSurvey = asyncHandler(async (req, res) => {
    const survey = await Survey.findByIdAndDelete(req.params.id);
    if (!survey) return res.status(404).json({ message: "Survey not found" });
    res.json({ message: "Survey deleted" });
});

module.exports = { getAllSurveys, getSurveyById, createSurvey, updateSurvey, deleteSurvey };
