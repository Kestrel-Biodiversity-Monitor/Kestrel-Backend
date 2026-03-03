const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
        regionName: { type: String, trim: true, default: "" },
        surveyType: {
            type: String,
            enum: ["Biodiversity", "Camera Trap", "Aerial", "Water Quality", "Botanical", "Other"],
            default: "Biodiversity",
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        leadOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        assignedOfficers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        status: {
            type: String,
            enum: ["planned", "ongoing", "completed", "cancelled"],
            default: "planned",
        },
        description: { type: String, default: "", maxlength: 2000 },
        findings: { type: String, default: "", maxlength: 5000 },
        speciesObserved: { type: Number, default: 0 },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Survey", surveySchema);
