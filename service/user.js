const User = require("./schemas/user");

const findUserByEmail = async (email) => await User.findOne({ email });

const createNewUser = async (body) => {
	const { email, password } = body;
	const newUser = new User({ email });
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

module.exports = {
	findUserByEmail,
	createNewUser,
	passwordValidation,
	addToken,
	userLogout
};