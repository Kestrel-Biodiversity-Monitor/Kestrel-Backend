const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        type: {
            type: String,
            enum: ["alert", "report", "anomaly", "document", "survey", "system", "role"],
            default: "system",
        },
        title: { type: String, required: true, trim: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        link: { type: String, default: "" },
        relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
