const express = require("express");
const router = express.Router();
const userController = require("../../controller/controllerUser");
const validation = require("../../middlewares/validationUser");
const authMiddleware = require("../../middlewares/jwt");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: "tmp/",
	filename: (req, file, cb) => cb(null, file.originalname),
	limits: { fileSize: 1048576 },
});

const mimeTypeAllowedList = [
	"image/png",
	"image/jpg",
	"image/jpeg",
	"image/gif",
];

const multerInstance = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const mimetype = file.mimetype;
		if (!mimeTypeAllowedList.includes(mimetype)) {
			return cb(null, false);
		}
		return cb(null, true);
	},
});



router.post("/signup", validation.userValidation, userController.registerUser);
router.post("/login", validation.userValidation, userController.loginUser);
router.get("/logout", authMiddleware, userController.logoutUser);
router.get("/current", authMiddleware, userController.getCurrentUser);
router.patch("/avatars", authMiddleware, multerInstance.single("avatar"), userController.patchAvatar);
router.get("/verify/:verificationToken", userController.verifyEmail);
router.post("/verify", validation.emailValidation, userController.resendVerificationEmail);

module.exports = router;