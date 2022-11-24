const Joi = require("joi");

const userSchema = Joi.object({
	email: Joi.string()
	  .trim()
	  .email({
		minDomainSegments: 2,
	  })
	  .pattern(
		/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
	  )
	  .required(),
	password: Joi.string()
	  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
	  .required(),
  });


const validation = (schema, req, res, next) => {
	const { error } = schema.validate(req.body);
	if (error) {
	  const [{ message }] = error.details;
	  return res.json({
		status: "failure",
		code: 400,
		message: `Field ${message.replace(/"/g, "")}`,
	});
	}
	next();
  };

const userValidation = (req, res, next) =>
  	validation(userSchema, req, res, next);

module.exports = {
	userValidation
};
