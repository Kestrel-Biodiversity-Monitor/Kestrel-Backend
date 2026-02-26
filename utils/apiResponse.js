/**
 * Create a standardized API response object.
 */
const createResponse = (success, message, data = null) => ({
    success,
    message,
    ...(data !== null && { data }),
});

const successResponse = (res, data, message = "Success", statusCode = 200) =>
    res.status(statusCode).json(createResponse(true, message, data));

const errorResponse = (res, message = "An error occurred", statusCode = 500) =>
    res.status(statusCode).json(createResponse(false, message));

module.exports = { successResponse, errorResponse };
