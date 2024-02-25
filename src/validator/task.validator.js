const { check, validationResult } = require("express-validator");
const { HTTP_STATUS_CODE, sendErrorResponse } = require("../utils/util");

// Validation rules for task creation
const validateTask = [
  check("title").notEmpty().withMessage("Title is required."),
  check("description").notEmpty().withMessage("Description is required."),
  check("due_date")
    .isISO8601()
    .toDate()
    .withMessage("Due date must be a valid ISO 8601 date."),
  check("status")
    .isIn(["pending", "completed"])
    .withMessage('Status must be either "pending" or "completed".'),
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
  validateTask,
};
