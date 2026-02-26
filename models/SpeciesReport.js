const mongoose = require("mongoose");

const speciesReportSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        speciesId: { type: mongoose.Schema.Types.ObjectId, ref: "Species" },
        speciesName: { type: String, trim: true }, // for free-text reports
        imageUrl: { type: String, default: null },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: { type: [Number], required: true }, // [lng, lat]
            regionName: { type: String, default: "" },
        },
        habitatType: {
            type: String,
            enum: ["Forest", "Grassland", "Wetland", "Desert", "Marine", "Freshwater", "Urban", "Agricultural", "Tundra", "Other"],
            default: "Other",
        },
        observationType: {
            type: String,
            enum: ["Visual", "Auditory", "Track/Sign", "Camera Trap", "Net/Trap", "Other"],
            default: "Visual",
        },
        numberOfIndividuals: { type: Number, default: 1, min: 0 },
        weatherCondition: {
            type: String,
            enum: ["Clear", "Cloudy", "Rainy", "Windy", "Foggy", "Snowy", "Hot", "Cold"],
            default: "Clear",
        },
        riskLevel: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Low",
        },
        description: { type: String, maxlength: 2000, default: "" },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        adminNote: { type: String, default: "" },
        isBulkUpload: { type: Boolean, default: false },
        surveyName: { type: String, default: "" },
    },
    { timestamps: true }
);

speciesReportSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("SpeciesReport", speciesReportSchema);
