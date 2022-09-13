const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const Validation = require("../validators/validator");

// User authentication
const userAuthentication = async function (req, res, next) {
	try {
		const secretkey = "plutoniumFunctionup$%(())()*)+/";
		let token = req.headers["x-api-token"];
		if (!token) {
			return res
				.status(401)
				.send({ status: false, msg: "Please provide a token" });
		}
		let decodedToken = jwt.verify(token, secretkey, (err, result) => {
			if (err) return res.status(401).send({ status: false, msg: err.message });
			req["x-api-key"] = result;
			next();
		});
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

// User authoristion from body and query
const userAuthorisation = async function (req, res, next) {
	try {
		let authorId = req["x-api-key"].authorId;

		// If blogId is present in pathParam
		let blogId = req.params.blogId;
		if (blogId) {
			// Validation for blogId
			if (!Validation.isValidObjectId(blogId)) {
				res.status(400).send({ status: false, msg: "Invalid blogID" });
				return;
			}
			// Finding blog from the id and authorising the authorId present in the blog with the authorId from the token
			let blog = await blogModel.findById(blogId);
			if (blog) {
				if (blog.authorId.toString() !== authorId)
					return res.status(403).send({
						status: false,
						msg: "Unauthorised",
					});
			}
			// If user is authorised but no blogs are found
			else
				return res.status(404).send({ status: false, msg: "Blog Not Found" });
		}

		// If authorId is present in requestBody
		let authorIdFromBody = req.body.authorId;
		if (authorIdFromBody) {
			// Validation for authorId we are getting from the body
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
		res.status(500).send({ status: false, msg: error });
	}
};

module.exports = { userAuthentication, userAuthorisation };
