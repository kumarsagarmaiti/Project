const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacherModel");
const ObjectId=require("mongoose").Types.ObjectId

const authentication = async (req, res, next) => {
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
		jwt.verify(token, "tailwind_assignment", function (error, data) {
			if (error) {
				return res.status(401).send({ status: false, message: error.message });
			} else {
				req.userId = data.userId;
				next();
			}
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const authorization = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		let loggedInUser = req.userId;

		if (!userId)
			return res
				.status(400)
				.send({ status: false, message: "Please provide userId" });

		if (!ObjectId.isValid(userId))
			return res
				.status(400)
				.send({ status: false, message: "Enter a valid user Id" });

		const findUser = await Teacher.findById(userId);
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
		next();
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { authentication,authorization };
