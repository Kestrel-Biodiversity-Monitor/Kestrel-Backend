const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateProfile,
    deleteUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getUserById);
router.put("/profile", protect, updateProfile);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
