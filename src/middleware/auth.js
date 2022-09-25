const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// const blogModel = require("../model/blogModels");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const ObjectId = mongoose.Types.ObjectId;

// --------------Authentication------------

const authenticate = async function (req, res, next) {
	try {
		let token = req.headers["x-api-key"];
		if (!token)
			return res
				.status(400)
				.send({ status: false, msg: "missing a mandatory token" });

		const secretMessage = "kashish,divyanshu,sagar";

		let decodedToken = jwt.verify(token, secretMessage, (err, decode) => {
			if (err) {
				return res.status(401).send({ status: false, msg: err });
			}
			req.decodedtoken = decode;
			next();
		});
	} catch (err) {
		return res.status(500).send({ status: false, msg: err.messge });
	}
};

//---------------------Authorization---------------------

const authorizationFromBody = async function (req, res, next) {
	try {
		let userId = req.decodedtoken.userId;

		let userIdbody = req.body.userId;
		if (!userIdbody)
			return res.status(400).send({ status: false, message: "UserID missing" });
		if (!ObjectId.isValid(userIdbody)) {
			return res
				.status(400)
				.send({ status: false, msg: "Please enter correct userId" });
		}
		let userdata = await User.findById(userIdbody);
		if (!userdata)
			return res.status(404).send({ status: false, message: "User not found" });

		if (userId !== userIdbody)
			return res
				.status(403)
				.send({ status: false, msg: "You are not authorised" });
		next();
	} catch (err) {
		res.status(500).send({ status: false, Error: err.message });
	}
};

const authorizationFromParam = async function (req, res,next ) {
	try {
		let userId = req.decodedtoken.userId;
		let bookId = req.params.bookId;

		if (!bookId) {
			return res
				.status(400)
				.send({ status: false, message: "bookId is mandatory" });
		}

		if (!ObjectId.isValid(bookId)) {
			return res
				.status(400)
				.send({ status: false, msg: "Please enter correct bookId" });
		}

		let findBook = await Book.findOne({ _id: bookId, isDeleted: false });
		if (!findBook) {
			return res.status(404).send({ status: false, message: "Book not found" });
		}

		if (userId !== findBook.userId.toString())
			return res
				.status(403)
				.send({ status: false, message: "You are not authorised" });
		next();
	} catch (err) {
		res.status(500).send({ status: false, Error: err.message });
	}
};

module.exports = {
	authenticate,
	authorizationFromBody,
	authorizationFromParam,
};
