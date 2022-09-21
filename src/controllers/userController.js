const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const isValidString = function (data) {
	if (typeof data !== "string" || data.trim().length === 0) return false;
	return true;
};

const createUser = async function (req, res) {
	try {
		const data = req.body;

		if (Object.keys(data).length === 0)
			return res
				.status(400)
				.send({ status: false, message: "Please Provide Data" });

		const requiredFields = ["title", "name", "phone", "email", "password"];

		for (field of requiredFields) {
			if (!data[field])
				return res
					.status(400)
					.send({ status: false, message: `${field} is missing.` });
		}

		for (field of requiredFields) {
			if (!isValidString(data[field]))
				return res.status(400).send({
					status: false,
					message: `${field} must contain characters.`,
				});
		}

		if (!["Mr", "Mrs", "Miss"].includes(data.title))
			return res.status(400).send({
				status: false,
				message: "Title must be among these: Mr, Mrs, Miss",
			});

		const phoneRegex = /^((\+91)?|91)?[789]{1}[0-9]{9}$/;
		if (!phoneRegex.test(data.phone))
			return res.status(400).send({
				status: false,
				message: "Invalid Phone Number",
			});

		const emailRegex = /^([a-z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/;
		if (!emailRegex.test(data.email))
			return res.status(400).send({
				status: false,
				message: "Invalid Email",
			});

		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,15})/;
		if (data.password.trim().length > 15 || data.password.trim().length < 8)
			return res.status(400).send({
				status: false,
				message: "Password length should be between 8 to 15 characters",
			});
		if (!passwordRegex.test(data.password))
			return res.status(400).send({
				status: false,
				message:
					"Password should contain uppercase, lowercase, special characters and a number",
			});

		const addressContains = ["street", "city", "pincode"];
		if (data.address) {
			for (field of addressContains) {
				if (!isValidString(data.address[field]))
					return res.status(400).send({
						status: false,
						message: `${field} must contain characters.`,
					});
			}
		}

		const uniqueFields = ["phone", "email"];
		for (field of uniqueFields) {
			const empObj = {};
			empObj[field] = data[field];
			const userData = await User.findOne(empObj);
			if (userData)
				return res
					.status(400)
					.send({ status: false, message: `${field} already taken!` });
		}

		const newUserData = await User.create(data);
		res
			.status(201)
			.send({ status: true, message: "Success", data: newUserData });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const userLogin = async function (req, res) {
	try {
		if (Object.keys(req.body).length === 0)
			return res
				.status(400)
				.send({ status: false, message: "Please Provide Email and Password" });

		const { email, password } = req.body;

		const requiredFields = ["email", "password"];

		for (field of requiredFields) {
			if (!req.body[field])
				return res
					.status(400)
					.send({ status: false, message: `${field} is missing.` });
		}

		const emailRegex = /^([a-z0-9_.]+@[a-z]+\.[a-z]{2,3})?$/;
		if (!emailRegex.test(email))
			return res.status(400).send({
				status: false,
				message: "Invalid Email",
			});

		const existingUser = await User.findOne({ email, password });
		if (!existingUser)
			return res
				.status(401)
				.send({ status: false, message: "Invalid Credentials" });

		const secretMessage = "kashish,divyanshu,sagar";

		const token = jwt.sign(
			{ userId: existingUser._id.toString() },
			secretMessage,
			{ expiresIn: "20m" }
		);

		let decodedToken = jwt.verify(token, secretMessage);
		decodedToken.token = token;
		res.status(200).send({ status: true, message: decodedToken });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createUser, userLogin };
