const express = require("express");
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword, updateProfile, requestRoleUpgrade } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { authLimiter } = require("../middlewares/rateLimiter");
const upload = require("../middlewares/upload");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/profile", protect, upload.single("profileImage"), updateProfile);
router.post("/request-role-upgrade", protect, requestRoleUpgrade);

module.exports = router;
