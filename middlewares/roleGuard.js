/**
 * requireRole("admin") or requireRole("admin", "researcher")
 * Must be used AFTER `protect` middleware.
 */
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            message: `Access denied. Required role(s): ${roles.join(", ")}`,
        });
    }
    next();
};

module.exports = { requireRole };
