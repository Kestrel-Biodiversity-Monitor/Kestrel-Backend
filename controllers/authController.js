const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { jwtSecret, jwtExpiresIn } = require("../config/env");
const { sendPasswordResetEmail } = require("../services/emailService");
const asyncHandler = require("../utils/asyncHandler");

const generateToken = (id) => jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpiresIn });

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const { name, email, password, organization } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (await User.findOne({ email })) {
        return res.status(409).json({ message: "Email already registered" });
    }
    const user = await User.create({ name, email, password, organization });
    res.status(201).json({ user, token: generateToken(user._id) });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ user, token: generateToken(user._id) });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => res.json({ user: req.user }));

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("+resetToken +resetTokenExpiry");
    if (!user) return res.json({ message: "If this email exists, a reset link has been sent" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1hr
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    try {
        await sendPasswordResetEmail(user.email, user.name, resetUrl);
    } catch (e) {
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: "Email could not be sent" });
    }
    res.json({ message: "Password reset link sent to your email" });
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: "Token and new password required" });
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetToken: hashed,
        resetTokenExpiry: { $gt: Date.now() },
    }).select("+resetToken +resetTokenExpiry");
    if (!user) return res.status(400).json({ message: "Token invalid or expired" });
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: "Password reset successful. Please login." });
});

// PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
    const { name, bio, organization } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (organization !== undefined) user.organization = organization;
    if (req.file) user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ user });
});

// POST /api/auth/request-role-upgrade
const requestRoleUpgrade = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const user = await User.findById(req.user._id);
    if (user.role !== "user") return res.status(400).json({ message: "Only users can request role upgrade" });
    user.roleUpgradeRequest = true;
    user.roleUpgradeReason = reason || "";
    await user.save();
    res.json({ message: "Researcher role upgrade request submitted" });
});

module.exports = { register, login, getMe, forgotPassword, resetPassword, updateProfile, requestRoleUpgrade };
