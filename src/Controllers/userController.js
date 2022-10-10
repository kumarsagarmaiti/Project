const User = require("../Models/userModel");
const validators = require("../Utility/validator");
const bcrypt = require("bcrypt");

const createUser = async function (req, res) {
	try {
		const data = req.body;
		const imageFile = req.files;

		if (validators.isEmptyObject(data))
			return res
				.status(400)
				.send({ status: false, message: "Please provide user details" });

		if (!imageFile)
			return res
				.status(400)
				.send({ status: false, message: "Please provide profileImage" });

		const fileTypes = ["png", "jpg", "jpeg"];
		if (!validators.acceptFileType(imageFile, fileTypes))
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
			if (!validators.isValidString(data[field]))
				return res
					.status(400)
					.send({ status: false, message: `Please provide a valid ${field}` });
		}

		const stringAddressFields = ["street", "city"];
		for (field of stringAddressFields) {
			if (!validators.isValidString(data.shipping[field]))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid shipping ${field}`,
				});
		}

		for (field of stringAddressFields) {
			if (!validators.isValidString(data.billing[field]))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid billing ${field}`,
				});
		}

		if (
			typeof data.shipping.pincode.trim() !== "number" &&
			!validators.isPincodeValid(data.shipping.pincode.trim())
		)
			return res
				.status(400)
				.send({ status: false, message: "Invalid shipping pincode" });

		if (
			typeof data.billing.pincode.trim() !== "number" &&
			!validators.isPincodeValid(data.billing.pincode.trim())
		)
			return res
				.status(400)
				.send({ status: false, message: "Invalid billing pincode" });

		if (!validators.isValidPhone(data.phone))
			return res
				.status(400)
				.send({ status: false, message: "Invalid phone number" });

		if (!validators.isValidEmail(data.email))
			return res.status(400).send({ status: false, message: "Invalid email" });

		if (data.password.trim().length < 15 && data.password.trim().length > 8) {
			if (!validators.isValidPassword(data.password))
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

module.exports = { createUser };
