const jwt = require("jsonwebtoken");

function getJwtToken(userId, email) {
  // Generating JWT
  return jwt.sign(
    {
      user_id: userId,
      email: email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

const MONGO_COLLECTION_NAME = {
  USER: "user",
  TASK: "task",
};

const HTTP_STATUS_CODE = {
  // 1xx Informational Responses
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,

  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

function sendErrorResponse(
  res,
  statusCode,
  message = "Service not available, please try after sometime..."
) {
  return res
    .status(statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
    .json({ message });
}

module.exports = {
  getJwtToken,
  MONGO_COLLECTION_NAME,
  HTTP_STATUS_CODE,
  sendErrorResponse,
};
