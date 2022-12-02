const service = require("../service/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const Jimp = require("jimp");
const fs = require("fs");

const registerUser = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user = await service.findUserByEmail(email);
		if (user) {
			return res.status(409).json({
				status: "conflict",
				code: 409,
				message: "Email in use",
			});
		}
		const newUser = await service.createNewUser(req.body);
		res.status(201).json({
			status: "created",
			code: 201,
			message: "Registration successful. We have sent a verification email. Please verify your email address before logging in.",
			user: {
				email: newUser.email,
			},
		});
	} catch (error) {
		next(error);
	}
};

const loginUser = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await service.findUserByEmail(email);
		const isPasswordCorrect = await service.passwordValidation(email, password);
		const isEmailVerified = await service.emailVerification(email);
		if (!user || !isPasswordCorrect) {
			return res.status(401).json({
				status: "Unauthorized",
				code: 401,
				message: "Email or password is wrong",
			});
		}
		else if (!isEmailVerified) {
			return res.status(401).json({
				status: "Unauthorized",
				code: 401,
				message: "Please verify Your account first",
			});
		}
		const { id } = user;
		const payload = {
			id,
			email,
		};

		const token = jwt.sign(payload, secret, { expiresIn: "12h" });
		await service.addToken(id, token);
		res.status(200).json({
			status: "ok",
			code: 200,
			token,
			user: {
				email,
			},
		});
	} catch (error) {
		next(error);
	}
};

const logoutUser = async (req, res, next) => {
	const { id } = req.user;
	try {
		await service.userLogout(id);
		res.status(204).json();
	} catch (error) {
		next(error);
	}
};

const getCurrentUser = async (req, res, next) => {
	const { email, subscription } = req.user;
	try {
		res.json({
			status: "success",
			code: 200,
			user: {
				email,
				subscription,
			},
		});
	} catch (error) {
		next(error);
	}
};

const patchAvatar = async (req, res, next) => {
	const { id } = req.user;
	const avatarURL = `/avatars/av_${id}.png`;
	if (!req.file) {
		return res.status(400).json({ message: "This is not the photo" });
	}
	Jimp.read(`tmp/${req.file.filename}`)
		.then((avatar) => {
			return avatar.resize(250, 250).write(`public/avatars/avatar_${id}.png`);
		})
		.catch((error) => {
			console.error(error);
		});
	await service.updateAvatar(id, avatarURL);
	try {
		fs.unlink(req.file.path, () => {
			console.log("removed from tmp");
		});
		res.status(200).json({
			status: "success",
			code: 200,
			message: "OK",
			data: {
				avatarURL,
			},
		});
	} catch (error) {
		next(error);
	}
};

const verifyEmail = async (req, res, next) => {
	const { verificationToken } = req.params;
	try {
		const user = await service.updateVerificationToken(verificationToken);
		if (user) {
			res.status(200).json({
				status: "success",
				code: 200,
				message: "Verification succesful",
			});
		} else {
			res.status(404).json({
				status: "error",
				code: 404,
				message: `User not found`,
			});
		}
	} catch (error) {
		next(error);
	}
};

const resendVerificationEmail = async (req, res, next) => {
	const { email } = req.body;
	try {
		const user = await service.findUserByEmail(email);
		const isEmailVerified = await service.emailVerification(email);
		if (!user) {
			res.status(404).json({
				status: "error",
				code: 404,
				message: `User not found`,
				data: "Not Found",
			});
		} else if (!isEmailVerified) {
			service.resendVerification(email);
			res.status(200).json({
				status: "success",
				code: 200,
				message: "Verification email sent",
				data: "OK",
			});
		} else {
			res.status(400).json({
				status: "error",
				code: 400,
				message: "Verification has already been passed",
				data: "Bad request",
			});
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
	patchAvatar,
	verifyEmail,
	resendVerificationEmail,
};