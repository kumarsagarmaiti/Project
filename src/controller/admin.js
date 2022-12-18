const Admin = require("../models/admin");
const validate = require("../validator/validators");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

const createAdmin = async function (req, res) {
	try {
		let { name, email, password } = req.body;
		if (!Object.keys(req.body).length)
			return res
				.status(400)
				.send({ status: false, message: "Body cannot be empty" });

		const mandatoryFields = ["name", "email", "password"];
		for (let field of mandatoryFields) {
			if (!validate.isValid(req.body[field]) || !req.body[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		}

		if (!validate.isValidEmail(email))
			return res
				.status(400)
				.send({ status: false, message: "Invalid emailId" });
		if (!validate.isValidPassword(password))
			return res.status(400).send({
				status: false,
				message:
					"Password must contain special characters, numbers, uppercase and lowercase and length should be between 8 to 15 characters",
			});

		const isEmailPresent = await Admin.findOne({ email });
		if (isEmailPresent)
			return res
				.status(400)
				.send({ status: false, message: "Email has already been used" });

		req.body.password = await bcrypt.hash(password, 10);
		const createAdmin = await Admin.create(req.body);
		res.status(201).send({
			status: true,
			message: "Admin created successfully",
			data: createAdmin,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const loginAdmin = async function (req, res) {
	try {
		const { email, password } = req.body;
		if (Object.keys(req.body).length === 0)
			return res.status(400).send({
				status: false,
				message: "Please provide emailId and password",
			});

		if (email) {
			if (!validate.isValidEmail(email))
				return res
					.status(400)
					.send({ status: false, message: "Invalid emailId" });
		} else {
			return res
				.status(400)
				.send({ status: false, message: "emailId is mandatory" });
		}

		const findAdmin = await Admin.findOne({ email });
		if (!findAdmin)
			return res.status(404).send({
				status: false,
				message: "User not found with the given emailId",
			});

		const decryptedPass = await bcrypt.compare(password, findAdmin.password);
		if (!decryptedPass)
			return res
				.status(401)
				.send({ status: false, message: "Incorrect password" });

		const token = jwt.sign({ userId: findAdmin._id }, "secretKey", {
			expiresIn: "30mins",
		});

		return res.status(200).send({
			status: true,
			message: "User login successfull",
			data: { userId: findAdmin._id, token: token },
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = { createAdmin, loginAdmin };
