const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../service/schemas/user");
require("dotenv").config();
const secret = process.env.SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
	secretOrKey: secret,
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
	new Strategy(params, async (payload, done) => {
	  try {
		const user = await User.findOne({ _id: payload.id });

		return user ? done(null, user) : done(new Error("User not found"));
	  } catch (err) {
		done(err);
	  }
	})
  );