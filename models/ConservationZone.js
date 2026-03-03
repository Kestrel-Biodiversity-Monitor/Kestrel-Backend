const mongoose = require("mongoose");

const conservationZoneSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
        regionName: { type: String, trim: true, default: "" },
        zoneType: {
            type: String,
            enum: ["National Park", "Wildlife Sanctuary", "Biosphere Reserve", "Ramsar Site", "Community Reserve", "Tiger Reserve", "Marine Park", "Other"],
            default: "Wildlife Sanctuary",
        },
        area: { type: Number, default: 0 }, // sq km
        establishedYear: { type: Number },
        protectedSpecies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Species" }],
        threatLevel: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Low",
        },
        description: { type: String, default: "", maxlength: 2000 },
        managingAuthority: { type: String, trim: true, default: "" },
        websiteUrl: { type: String, default: "" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ConservationZone", conservationZoneSchema);
