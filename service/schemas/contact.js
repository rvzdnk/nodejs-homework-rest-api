const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contact = new Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
			minlength: 3,
			maxlength: 30,
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{ versionKey: false, timestamps: true }
);

const Contact = model("contact", contact);

module.exports = Contact;