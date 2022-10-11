const User = require("../Models/userModel");
const validate = require("../Utility/validator");
const bcrypt = require("bcrypt");
const { uploadFiles } = require("../MIddleware/aws");

const createUser = async function (req, res) {
	try {
		const data = req.body;
		const imageFile = req.files;

		if (validate.isEmptyObject(data))
			return res
				.status(400)
				.send({ status: false, message: "Please provide user details" });

		if (!imageFile)
			return res
				.status(400)
				.send({ status: false, message: "Please provide profileImage" });

		const fileTypes = ["png", "jpg", "jpeg"];
		if (!validate.acceptFileType(imageFile, fileTypes))
			return res.status(400).send({
				status: false,
				message: `Invalid profileImage type. Please upload ${fileTypes.join(
					"or"
				)} types`,
			});

		const imageUrl = await uploadFiles(imageFile[0]);
		data.profileImage = imageUrl;

		const mandatoryFields = ["fname", "lname", "email", "phone", "password"];

		for (field of mandatoryFields) {
			if (!data.hasOwnProperty(field))
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
		}

		const mandatoryAddressFields = ["street", "city", "pincode"];

		for (field of mandatoryAddressFields) {
			if (!address.shipping.hasOwnProperty(field))
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
		}

		for (field of mandatoryAddressFields) {
			if (!address.billing.hasOwnProperty(field))
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
		}

		for (field of mandatoryFields) {
			if (!validate.isValidString(data[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		}

		const stringAddressFields = ["street", "city"];
		for (field of stringAddressFields) {
			if (!validate.isValidString(data.shipping[field]))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid shipping ${field}`,
				});
		}

		for (field of stringAddressFields) {
			if (!validate.isValidString(data.billing[field]))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid billing ${field}`,
				});
		}

		if (
			typeof data.shipping.pincode.trim() !== "number" &&
			!validate.isPincodeValid(data.shipping.pincode.trim())
		)
			return res
				.status(400)
				.send({ status: false, message: "Invalid shipping pincode" });

		if (
			typeof data.billing.pincode.trim() !== "number" &&
			!validate.isPincodeValid(data.billing.pincode.trim())
		)
			return res
				.status(400)
				.send({ status: false, message: "Invalid billing pincode" });

		if (!validate.isValidPhone(data.phone))
			return res
				.status(400)
				.send({ status: false, message: "Invalid phone number" });

		if (!validate.isValidEmail(data.email))
			return res.status(400).send({ status: false, message: "Invalid email" });

		if (data.password.trim().length < 15 && data.password.trim().length > 8) {
			if (!validate.isValidPassword(data.password))
				return res
					.status(400)
					.send({ status: false, message: "Invalid password" });
		} else {
			return res.status(400).send({
				status: false,
				message: "Password length should be between 8 to 15 characters",
			});
		}

		bcrypt.hash(data.password, salt, function (err, hash) {
			if (err) return res.status(500).send(err.message);
			data.password = hash;
		});

		const userData = await User.create(data);
		res.status(201).send({
			status: true,
			message: "User created successfully",
			data: userData,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const userLogin = async function (req, res) {
	try {
		let body = req.body;
		const { email, password } = body;

		if (validate.isEmptyObject(body)) {
			return res
				.status(400)
				.send({ status: false, message: "Data is required to login" });
		}

		if (!validate.isEmptyVar(email))
			return res
				.status(400)
				.send({ status: false, message: "EmailId is mandatory" });

		if (!validate.isValidEmail(email)) {
			return res
				.status(400)
				.send({ status: false, message: "Email must be valid" });
		}

		if (validate.isEmptyVar(password))
			return res
				.status(400)
				.send({ status: false, message: "Password is mandatory" });

		if (!validate.isValidPassword) {
			return res
				.status(400)
				.send({
					status: false,
					message: `Password length should be A Valid Password And Length Should Be in between 8 to 15 `,
				});
		}

		let bcryptpassword = await bcrypt.compare(password, user.password);
		if (!bcryptpassword)
			return res
				.status(401)
				.send({ status: false, message: "Incorrect password" });

		let user = await User.findOne({ email: email });
		if (!user) {
			return res
				.status(400)
				.send({ status: false, msg: "Invalid credentials or user not exist" });
		}

		const token = jwt.sign(
			{
				userId: user._id,
				iat: new Date().getTime(),
				exp: 10,
			},
			"Group-10 secret key"
		);
		return res
			.status(200)
			.send({
				status: true,
				message: "User login successfull",
				data: { userId: user._id, token: token },
			});
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createUser, userLogin };
