const express = require("express");
const router = express.Router();
const { getPosts, getPostById, createPost, addComment, upvotePost, deletePost } = require("../controllers/forumController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getPosts);
router.get("/:id", protect, getPostById);
router.post("/", protect, createPost);
router.post("/:id/comments", protect, addComment);
router.patch("/:id/upvote", protect, upvotePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
