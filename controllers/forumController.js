const ForumPost = require("../models/ForumPost");
const Comment = require("../models/Comment");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/forum
const getPosts = asyncHandler(async (req, res) => {
    const { category, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const total = await ForumPost.countDocuments(filter);
    const posts = await ForumPost.find(filter)
        .populate("userId", "name profileImage role")
        .sort({ isPinned: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    res.json({ posts, total, page: Number(page), pages: Math.ceil(total / limit) });
});

// GET /api/forum/:id
const getPostById = asyncHandler(async (req, res) => {
    const post = await ForumPost.findByIdAndUpdate(
        req.params.id,
        { $inc: { viewCount: 1 } },
        { new: true }
    ).populate("userId", "name profileImage role");
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comments = await Comment.find({ postId: post._id })
        .populate("userId", "name profileImage")
        .sort({ createdAt: 1 });
    res.json({ post, comments });
});

// POST /api/forum
const createPost = asyncHandler(async (req, res) => {
    const post = await ForumPost.create({ ...req.body, userId: req.user._id });
    res.status(201).json(post);
});

// POST /api/forum/:id/comments
const addComment = asyncHandler(async (req, res) => {
    const { comment } = req.body;
    const c = await Comment.create({ postId: req.params.id, userId: req.user._id, comment });
    const populated = await c.populate("userId", "name profileImage");
    res.status(201).json(populated);
});

// PATCH /api/forum/:id/upvote
const upvotePost = asyncHandler(async (req, res) => {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const idx = post.upvotes.indexOf(req.user._id);
    if (idx > -1) post.upvotes.splice(idx, 1);
    else post.upvotes.push(req.user._id);
    await post.save();
    res.json({ upvotes: post.upvotes.length });
});

// DELETE /api/forum/:id
const deletePost = asyncHandler(async (req, res) => {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
    }
    await post.deleteOne();
    await Comment.deleteMany({ postId: post._id });
    res.json({ message: "Post deleted" });
});

module.exports = { getPosts, getPostById, createPost, addComment, upvotePost, deletePost };
