const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        category: {
            type: String,
            enum: ["General", "Research", "Field Notes", "Conservation", "Help", "Announcements"],
            default: "General",
        },
        description: { type: String, required: true, maxlength: 5000 },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        isPinned: { type: Boolean, default: false },
        isLocked: { type: Boolean, default: false },
        viewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ForumPost", forumPostSchema);
