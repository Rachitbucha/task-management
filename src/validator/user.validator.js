const { check, validationResult } = require("express-validator");
const { HTTP_STATUS_CODE, sendErrorResponse } = require("../utils/util");

// Middleware function to validate user input
const validateUser = [
  check("email").isEmail().withMessage("Kindly provide a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Minimum 6 characters required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(
        res,
        HTTP_STATUS_CODE.BAD_REQUEST,
        errors.array()
      );
    }
    next();
  },
];

module.exports = {
  validateUser,
};
