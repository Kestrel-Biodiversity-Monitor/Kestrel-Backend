module.exports = {
    jwtSecret: process.env.JWT_SECRET || "fallback_secret_change_in_prod",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3001,
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/kestrel",
};
