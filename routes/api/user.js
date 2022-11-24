const express = require("express");
const router = express.Router();
const userController = require("../../controller/controllerUser");
const validation = require("../../middlewares/validationUser");
const authMiddleware = require("../../middlewares/jwt");

router.post("/signup", validation.userValidation, userController.registerUser);
router.post("/login", validation.userValidation, userController.loginUser);
router.get("/logout", authMiddleware, userController.logoutUser);
router.get("/current", authMiddleware, userController.getCurrentUser);

module.exports = router;