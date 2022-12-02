const User = require("./schemas/user");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../helpers/sendgrid");

const findUserByEmail = async (email) => await User.findOne({ email });

const createNewUser = async (body) => {
	const { email, password } = body;
	const avatarURL = gravatar.url(email);
	const verificationToken = uuidv4();
	const newUser = new User({ email, avatarURL, verificationToken });
	await newUser.setPassword(password);
	await newUser.save();
	await sendEmail(email, verificationToken);
	return newUser;
};

const passwordValidation = async (email, password) => {
	const user = await findUserByEmail(email);
	return user ? await user.validatePassword(password) : false;
};

const addToken = async (id, token) =>
	await User.findByIdAndUpdate(id, { token });

const userLogout = async (id) =>
	await User.findByIdAndUpdate(id, { token: null });

const updateAvatar = (id, avatarURL) =>
	User.findByIdAndUpdate(id, { avatarURL });

const updateVerificationToken = (verificationToken) =>
	User.findOneAndUpdate(
		{ verificationToken },
		{ verify: true, verificationToken: null }
	);

const emailVerification = async (email) => {
	const user = await findUserByEmail(email);
	return user ? user.verify : false;
};

const resendVerification = async (email) => {
	const user = await findUserByEmail(email);
	await sendEmail(email, user.verificationToken);
};

module.exports = {
	findUserByEmail,
	createNewUser,
	passwordValidation,
	addToken,
	userLogout,
	updateAvatar,
	updateVerificationToken,
	emailVerification,
	resendVerification,
};