const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bCrypt = require("bcryptjs");

const user = new Schema(
	{
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		token: {
			type: String,
			default: null,
		},
	},
	{ versionKey: false, timestamps: true, strict: "throw" }
);

user.methods.setPassword = function (password) {
	this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

user.methods.validatePassword = function (password) {
	return bCrypt.compareSync(password, this.password);
};

const User = model("user", user);

module.exports = User;