const jwt = require("jsonwebtoken");
const {
  HTTP_STATUS_CODE,
  sendErrorResponse,
  MONGO_COLLECTION_NAME,
} = require("../utils/util");
const { getDatabase } = require("../database/mongo");

async function userTokenMiddleWare(req, res, next) {
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

    // Check if user token is blacklisted
    const db = getDatabase();

    // Todo: Use Redis to reduce load from database.
    const blacklisted = await db
      .collection(MONGO_COLLECTION_NAME.INVALIDATED_TOKEN)
      .findOne({ token });

    if (blacklisted) {
      const err = new Error("User Session Expired, Please Login Again.");
      err.status_code = HTTP_STATUS_CODE.UNAUTHORIZED;
      throw err;
    }

    // Extract user profile data from token and attach it to req.user_profile
    req.user_profile = decoded;

    // Call the next middleware
    next();
  } catch (error) {
    return sendErrorResponse(
      res,
      error.status_code || HTTP_STATUS_CODE.UNAUTHORIZED,
      error.message || "Unauthorized: Invalid token"
    );
  }
}

module.exports = {
  userTokenMiddleWare,
};
