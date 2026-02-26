/**
 * Wrap async route handlers to avoid repetitive try/catch.
 * @param {Function} fn - async express handler
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
