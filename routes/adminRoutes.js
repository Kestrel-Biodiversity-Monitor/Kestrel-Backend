const express = require("express");
const router = express.Router();
const { getUsers, updateUserRole, getRoleRequests, toggleUserActive, getActivity } = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleGuard");

router.use(protect, requireRole("admin"));

router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.get("/role-requests", getRoleRequests);
router.patch("/users/:id/toggle-active", toggleUserActive);
router.get("/activity", getActivity);

module.exports = router;
