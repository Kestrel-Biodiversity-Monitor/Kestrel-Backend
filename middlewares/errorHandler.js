// Generic 404 handler
const notFound = (req, res, next) => {
    const error = new Error(`Route not found – ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid resource ID" });
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field";
        return res.status(409).json({ message: `Duplicate value for: ${field}` });
    }
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages.join(", ") });
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large. Max 5MB." });
    }

    res.status(statusCode).json({
        message: err.message || "Server error",
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};

module.exports = { notFound, errorHandler };
