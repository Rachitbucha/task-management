const jwt = require("jsonwebtoken");
const { HTTP_STATUS_CODE, sendErrorResponse } = require("../utils/util");

function userTokenMiddleWare(req, res, next) {
  // Get token from request headers
  const token = req.headers.token;

  if (!token) {
    return sendErrorResponse(
      res,
      HTTP_STATUS_CODE.UNAUTHORIZED,
      "Unauthorized: Missing token"
    );
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is expired
    if (decoded.exp <= Date.now() / 1000) {
      return sendErrorResponse(
        res,
        HTTP_STATUS_CODE.UNAUTHORIZED,
        "Unauthorized: Token expired"
      );
    }

    // Extract user profile data from token and attach it to req.user_profile
    req.user_profile = decoded;

    // Call the next middleware
    next();
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP_STATUS_CODE.UNAUTHORIZED,
      "Unauthorized: Invalid token"
    );
  }
}

module.exports = {
  userTokenMiddleWare,
};
