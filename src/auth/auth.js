const User = require("../model/user");
const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
	try {
		let token = req.headers.authorization;
		if (!token) return res.status(401).send("Please provide bearer token");
		token = token.split(" ")[1];
		jwt.verify(token, "cointab", (err, data) => {
			if (err) return res.status(401).send(err);
		});
		const findUser = await User.findOne({ token });
		if (!findUser)
			return res.status(401).send("Authentication error. Please login again");
		next();
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { authentication };
