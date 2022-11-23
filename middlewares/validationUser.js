const Joi = require("joi");

const schemaFindUserByEmail = Joi.object({
	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ["com", "net", "pl"] },
		})
		.required(),
	password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const validate = (schema, obj, next, res) => {
	const { error } = schema.validate(obj);
	if (error) {
		const [{ message }] = error.details;
		console.log(error);
		return res.json({
			status: "failure",
			code: 400,
			message: `Field ${message.replace(/"/g, "")}`,
		});
	}
	next();
};

module.exports.findUserByEmail = (req, res, next) => {
	return validate(schemaFindUserByEmail, req.body, next, res);
};
