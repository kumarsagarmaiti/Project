const jwt = require("jsonwebtoken");
const blogModel=require("../models/blogModel")
const Validation = require("../validators/validator");

const userAuthentication = async function (req, res, next) {
	try {
		const secretkey = "plutoniumFunctionup$%(())()*)+/";
		let token = req.headers["x-api-token"];
		if (!token) {
			return res
				.status(401)
				.send({ status: false, msg: "Please provide a token" });
		}
		let decodedToken = await jwt.verify(token, secretkey, (err, result) => {
			if (err) return res.status(401).send(err.message);
			req["x-api-key"] = result;
			next();
		});
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

const userAuthorisation = async function (req, res, next) {
	try {
		let authorId = req["x-api-key"].authorId;
		let blogId = req.params.blogId;
		let authorIdFromBody = req.body.authorId;
		
		let blog = await blogModel.findById(blogId);

		if (blogId) {
			//Validation for blogId
			if (!Validation.isValidObjectId(blogId)) {
				res.status(400).send({ status: false, msg: "Invalid blogID" });
				return;
			}

			if (blog.authorId.toString() !== authorId)
				return res.status(403).send({
					status: false,
					msg: "Unauthorised",
				});
		}
		if (authorIdFromBody) {
			if (!Validation.isValidObjectId(authorIdFromBody)) {
				res.status(400).send({ status: false, msg: "Invalid authorID" });
				return;
			}
			if (authorId != authorIdFromBody) {
				return res.status(403).send({
					status: false,
					msg: "Unauthorised",
				});
			}
		}

		next();
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

module.exports = { userAuthentication, userAuthorisation };
