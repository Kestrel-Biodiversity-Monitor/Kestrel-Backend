const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        scientificName: { type: String, trim: true, default: "" },
        category: {
            type: String,
            enum: ["Mammal", "Bird", "Reptile", "Amphibian", "Fish", "Invertebrate", "Plant", "Fungi", "Other"],
            required: true,
        },
        conservationStatus: {
            type: String,
            enum: ["Least Concern", "Near Threatened", "Vulnerable", "Endangered", "Critically Endangered", "Extinct in Wild", "Extinct", "Data Deficient"],
            default: "Data Deficient",
        },
        habitat: { type: String, trim: true, default: "" },
        description: { type: String, default: "" },
        imageUrl: { type: String, default: null },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Species", speciesSchema);
