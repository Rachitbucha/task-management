const express = require("express");
const { check, validationResult } = require("express-validator");
const userController = require("../controllers/user.controller");
const { HTTP_STATUS_CODE, sendErrorResponse } = require("../utils/util");
const router = express.Router();

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

// For new user Registration
router.post("/register", validateUser, async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userController.register(email, password);
    res.status(HTTP_STATUS_CODE.CREATED).json({ token });
  } catch (error) {
    return sendErrorResponse(res, error.status_code, error.message);
  }
});

// Existing User Login
router.post("/login", validateUser, async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userController.login(email, password);
    res.json({ token });
  } catch (error) {
    return sendErrorResponse(res, error.status_code, error.message);
  }
});

module.exports = router;
