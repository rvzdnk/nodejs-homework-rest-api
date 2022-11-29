const User = require("./schemas/user");
const gravatar = require("gravatar");

const findUserByEmail = async (email) => await User.findOne({ email });

const createNewUser = async (body) => {
	const { email, password } = body;
	const avatarURL = gravatar.url(email);
	const newUser = new User({ email, avatarURL });
	await newUser.setPassword(password);
	await newUser.save();
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

module.exports = {
	findUserByEmail,
	createNewUser,
	passwordValidation,
	addToken,
	userLogout,
	updateAvatar,
};