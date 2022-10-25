const jwt = require("jsonwebtoken");
const User = require("../Models/usermodel");
const validate = require("../Utils/validator");

const authentication = (req, res, next) => {
	try {
		let bearerToken = req.headers.authorization;
		if (!bearerToken) {
			return res.status(400).send({
				status: false,
				msg: "Bearer token required!",
			});
		}
		let BearerToken = bearerToken.split(" ");
		let token = BearerToken[1];
		jwt.verify(token, "ForTheSakeOfProject", function (error, data) {
			if (error) {
				return res.status(401).send({ status: false, message: error.message });
			} else {
				req.decodedToken = data;
				next();
			}
		});
	} catch (error) {
		return res.status(500).send({ status: false, error: error.message });
	}
};

const authorization = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		let loggedInUser = req.decodedToken.userId;

		if (userId) {
			if (!validate.isValidObjectId(userId))
				return res
					.status(400)
					.send({ status: false, message: "Enter a valid user Id" });
			const findUser = await User.findById(userId).lean();

			if (!findUser)
				return res.status(404).send({
					status: false,
					message: `User with the userId: ${userId} not found`,
				});
			req.userDetails = findUser;
			if (loggedInUser !== userId)
				return res
					.status(403)
					.send({ status: false, message: "Error!! authorization failed" });
		} else {
			return res
				.status(400)
				.send({ status: false, message: "Please provide userId" });
		}
		next();
	} catch (error) {
		return res.status(500).send({ status: false, error: error.message });
	}
};

module.exports = {
	authentication,
	authorization,
};
