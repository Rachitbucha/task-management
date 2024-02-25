const express = require("express");
const userController = require("../controllers/user.controller");
const { HTTP_STATUS_CODE, sendErrorResponse } = require("../utils/util");
const router = express.Router();
const { validateUser } = require("../validator/user.validator");
const { userTokenMiddleWare } = require("../middleware/auth");

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

// Existing User Logout
router.post("/logout", userTokenMiddleWare, async (req, res) => {
  try {
    await userController.logout(req);
    res.sendStatus(HTTP_STATUS_CODE.OK);
  } catch (error) {
    return sendErrorResponse(res, error.status_code, error.message);
  }
});

module.exports = router;
