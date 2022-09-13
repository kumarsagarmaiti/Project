const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const validation = require("../validators/validator");

// Function for creating author
const createAuthor = async function (req, res) {
	try {
		if (!validation.isValidRequestBody(req.body)) {
			return res
				.status(400)
				.send({ status: false, msg: "Please provide author's detail" });
		}
		// Destructuring from req.body
		let { fname, lname, title, email, password } = req.body;

		let requiredFields = ["fname", "lname", "title", "email", "password"];
		for (field of requiredFields) {
			if (!req["body"].hasOwnProperty(field))
				return res
					.status(400)
					.send({ status: false, msg: `Please provide ${field}` });
		}

		// Validating if the first name is present and type is string or not
		if (!validation.isValidString(fname))
			return res
				.status(400)
				.send({ status: false, msg: "fname must contain letters" });

		// Validating if the last name is present and type is string or not
		if (!validation.isValidString(lname))
			return res
				.status(400)
				.send({ status: false, msg: "lname must contain letters only" });

		// Validating if the title is present and type is string or not. Also if the title is among the enumerated values or not
		if (!validation.isValidTitle(title))
			return res.status(400).send({
				status: false,
				msg: "Title must contain only one of these-'Mr','Mrs','Miss'",
			});

		// Validating if the email is present or not and is a valid email or not
		email = email.trim();
		if (!validation.isValidEmail(email))
			return res.status(400).send({ status: false, msg: "Invalid emailID" });
		const repeatEmail = await authorModel.find({ email: email });
		if (repeatEmail.length !== 0)
			return res
				.status(400)
				.send({ status: false, msg: "email ID already exist" });

		// Validating if the password is present or not and is a strong password
		password = password.trim();
		if (password.length < 8 || password.length > 19)
			return res.status(400).send({
				status: false,
				mesg: "password must be in between 8 to 19 characters",
			});
		if (!validation.isValidPassword(password))
			return res.status(400).send({
				status: false,
				msg: "Password must contain uppercases,lowercase,special characters and numerics.",
			});

		// After validating we are creating a new author
		const newAuthor = await authorModel.create(req.body);
		res.status(201).send({
			status: true,
			mag: "Data created successfully",
			data: newAuthor,
		});
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

// Function for author login and token generation
const authorLogin = async function (req, res) {
	try {
		if (!validation.isValidRequestBody(req.body)) {
			return res
				.status(400)
				.send({ status: false, msg: "Please provide author's detail" });
		}
		let { email, password } = req.body;
		const secretkey = "plutoniumFunctionup$%(())()*)+/";

		// Validating if the email is present or not and is a valid email or not
		if (!email)
			return res
				.status(400)
				.send({ status: false, msg: "email must be present" });
		if (!validation.isValidString(email))
			return res
				.status(400)
				.send({ status: false, msg: "email must contain letters only" });
		email = email.trim();
		if (!validation.isValidEmail(email))
			return res.status(400).send({ status: false, msg: "Invalid emailID" });

		// Validating if the password is present or not
		if (!password)
			return res
				.status(400)
				.send({ status: false, msg: "Password must be present" });

		// Creating a dynamic object containing keys email and password with values from the body
		obj = { email: email, password: password };

		// Checking if the user is present or not or else will throw "Invalid credentials"
		const author = await authorModel.findOne(obj);
		if (!author)
			return res
				.status(400)
				.send({ status: false, msg: "Invalid Credentials" });

		// Generating token with authorId in the payload and sending in response body
		const token = jwt.sign({ authorId: author._id.toString() }, secretkey);
		res.status(200).send({ status: true, data: token });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

module.exports = { createAuthor, authorLogin };
