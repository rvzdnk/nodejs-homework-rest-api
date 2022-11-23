const service = require("../service/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const registerUser = async (req, res, next) => {
	const { email } = req.body;
	try {
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
			message: "Registration successful",
			user: {
				email: newUser.email,
				subscription: newUser.subscription,
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
		if (!user || !isPasswordCorrect) {
			return res.status(401).json({
				status: "Unauthorized",
				code: 401,
				message: "Email or password is wrong",
			});
		}
		const { id, subscription } = user;
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
				subscription,
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

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	getCurrentUser,
};