const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

const authenticationOwner = async (req, res, next) => {
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
		jwt.verify(token, "secretKey", function (error, data) {
			if (error) {
				return res.status(401).send({ status: false, message: error.message });
			} else {
				req.ownerDetails = data;
				next();
			}
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const authorizationOwner = async (req, res, next) => {
	try {
		const ownerId = req.params.ownerId;
		let loggedInUser = req.ownerDetails.ownerId;

		if (!ownerId)
			return res
				.status(400)
				.send({ status: false, message: "Please provide ownerId" });

		if (!ObjectId.isValid(ownerId))
			return res
				.status(400)
				.send({ status: false, message: "Enter a valid owner Id" });

		if (loggedInUser !== ownerId)
			return res
				.status(403)
				.send({ status: false, message: "Error!! authorization failed" });
		next();
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { authenticationOwner, authorizationOwner };
