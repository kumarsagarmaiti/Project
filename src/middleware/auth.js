const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId=mongoose.Types.ObjectId
// const blogModel = require("../model/blogModels");
const userModel = require("../models/userModel");

// --------------Authentication------------

const authenticate = async function (req, res, next) {
	try {
		let token = req.headers["x-api-key"];
		if (!token)
			return res
				.status(400)
				.send({ status: false, msg: "missing a mandatory token😒" });

        const secretMessage = "kashish,divyanshu,sagar";

		let decodedToken = jwt.verify(
			token,
			secretMessage,
			(err, decode) => {
				if (err) {
					return res
						.status(401)
						.send({ status: false, msg:err });
				}
				req.decodedtoken = decode;
				next();
			}
		);
	} catch (err) {
		return res.status(500).send({ status: false, msg: err.messge });
	}
};

//---------------------Authorization---------------------

const authorization = async function (req, res, next) {
	try {
		let userId = req.decodedtoken.userId;

		let userIdbody = req.body.userId;
		if (!ObjectId.isValid(userIdbody)) {
			return res
				.status(400)
				.send({ status: false, msg: "Please enter correct blogId Id" });
		}
		console.log("1")
		console.log("2")
		let userdata = userModel.findById(userIdbody);
		console.log(userdata["_id"].toString())
		
		console.log("3")
		console.log("4")
		if (userId !== userIdbody)
			return res
				.status(400)
				.send({ status: false, msg: "you are not authrized" });
		next();
	} catch (error) {
		res.status(500).send({ status: false, Error: error.message });
	}
};

// //---------------------Special Authorization---------------------//
// const specialAuthorization = async function (req, res, next) {
// 	try {
// 		let data = req.query;

// 		const token = req.headers["x-api-key"]; // we call headers with name x-api-key
// 		if (!token)
// 			res
// 				.status(400)
// 				.send({ status: false, msg: "missing a mandatory token😒" });
// 		let decodedToken = jwt.verify(token, "kashish,divyanshu,sagar");
// 		let authorId = decodedToken.userId;
// 		const { category, tags, subcategory } = data;
// 		let filter = { authorId, ...data };
// 		let getRecord = await blogModel.findOne(filter);
// 		let userId = getRecord.authorId.toString();
// 		if (userId.toString() != authorId) {
// 			return res
// 				.status(403)
// 				.send({ status: false, msg: "You are not authrized" });
// 		}
// 		next();
// 	} catch (error) {
// 		res.status(500).send({ status: false, Error: error.message });
// 	}
// };

module.exports={authenticate,authorization}