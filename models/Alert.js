const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        message: { type: String, required: true, trim: true },
        region: { type: String, required: true, trim: true },
        severity: { type: String, enum: ["Info", "Warning", "Critical"], default: "Warning" },
        status: { type: String, enum: ["active", "resolved"], default: "active" },
        expiryDate: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        feedbacks: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                comment: { type: String },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
