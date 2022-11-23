const express = require("express");
const router = express.Router();
const userController = require("../../controller/controllerUser");
const validate = require("../../middlewares/validationUser");
const authMiddleware = require("../../middlewares/jwt");

router.post("/signup", validate.findUserByEmail, userController.registerUser);
router.post("/login", validate.findUserByEmail, userController.loginUser);
router.get("/logout", authMiddleware, userController.logoutUser);
router.get("/current", authMiddleware, userController.getCurrentUser);

module.exports = router;