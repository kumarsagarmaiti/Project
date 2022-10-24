const User = require("../Models/usermodel");
const validate = require("../Utils/validator");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const createUser = async function (req, res) {
	try {
		const data = req.body;
		if (!validate.isValidInputBody(data))
			return res
				.status(400)
				.send({ status: false, message: "Please provide data" });

		const mandatoryFields = ["fname", "lname", "email", "password", "phone"];
		for (field of mandatoryFields) {
			if (!data[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });

			if (!validate.isValid(data[field]))
				return res
					.status(400)
					.send({ status: false, message: `Invalid ${field}` });
		}

		if (!data.address)
			return res
				.status(400)
				.send({ status: false, message: `Please provide address` });

		if (!validate.isValidPhone(data.phone))
			return res
				.status(400)
				.send({ status: false, message: "Invalid phone number" });

		if (!validate.isValidEmail(data.email))
			return res.status(400).send({ status: false, message: "Invalid email" });

		if (!validate.isValidPassword(data.password))
			return res.status(400).send({
				status: false,
				message:
					"Password must contain special characters, numbers, uppercase and lowercase and length should be between 8 to 15 characters",
			});

		const addressFields = ["state", "city", "pincode"];
		for (field of addressFields) {
			if (!data.address[field])
				return res.status(400).send({
					status: false,
					message: `Please provide ${field} in address`,
				});
		}

		const pincode = addressFields.pop();
		for (field of addressFields) {
			if (!validate.isValid(data.address[field]))
				return res
					.status(400)
					.send({ status: false, message: `Invalid ${field}` });
		}

		if (validate.isPincodeValid(pincode))
			return res
				.status(400)
				.send({ status: false, message: "Invalid pincode" });

		data.password = await bcrypt.hash(data.password, 10);

		const uniqueFields = ["email", "phone"];
		for (field of uniqueFields) {
			let empObj = {};
			empObj[field] = data[field];
			const isPresent = await User.findOne(empObj);
			if (isPresent)
				return res
					.status(400)
					.send({ status: false, message: `${field} already present` });
		}

		const businessOwnerData = await User.create(data);
		res.status(201).send({
			status: true,
			message: "User created successfully",
			data: businessOwnerData,
		});
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const userLogin = async function (req, res) {
	try {
		const { email, password } = req.body;

		if (email) {
			if (!validate.isValidEmail(email)) {
				return res
					.status(400)
					.send({ status: false, message: "Email must be valid" });
			}
		} else {
			return res
				.status(400)
				.send({ status: false, message: "EmailId is mandatory" });
		}

		if (!password)
			return res
				.status(400)
				.send({ status: false, message: "Password is mandatory" });

		let user = await User.findOne({ email: email });
		if (!user) {
			return res
				.status(400)
				.send({ status: false, msg: "User not found with the given email" });
		}

		let bcryptpassword = await bcrypt.compare(password, user.password);
		if (!bcryptpassword)
			return res
				.status(401)
				.send({ status: false, message: "Incorrect password" });

		const token = jwt.sign(
			{
				userId: user._id,
			},
			"ForTheSakeOfProject",
			{ expiresIn: "1h" }
		);

		return res.status(200).send({
			status: true,
			message: "User login successfull",
			data: { userId: user._id, token: token },
		});
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const getUser = async function (req, res) {
	try {
		const userId = req.params.userId;
		const findUser = await User.findOne({
			_id: userId,
			isDeleted: false,
		});
		if (!findUser)
			return res.status(404).send({ status: false, message: "User not found" });
		else return res.status(200).send({ status: true, data: findUser });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const updateUser = async function (req, res) {
	try {
		let userId = req.params.userId;
		let data = req.body;

		if (!validate.isValidInputBody(data))
			return res.status(400).send({
				status: false,
				message: "Enter details to update your account data",
			});

		let { email, password, phone, address } = data;

		const incomingFields = Object.keys(data);
		for (field of incomingFields) {
			if (!validate.isValid(data[field]))
				return res.status(400).send({
					status: false,
					message: `Please provide a valid ${field}`,
				});
		}

		if (email && !validate.isValidEmail(email))
			return res
				.status(400)
				.send({ status: false, message: "Please Enter a valid Email-id" });

		let duplicateEmail = await User.findOne({ email });
		if (duplicateEmail)
			return res
				.status(400)
				.send({ status: false, message: "Email already exist" });

		if (data.phone && !validate.isValidPhone(phone))
			return res
				.status(400)
				.send({ status: false, message: "Please Enter a valid Phone number" });

		let duplicatePhone = await User.findOne({ phone: phone });
		if (duplicatePhone)
			return res
				.status(400)
				.send({ status: false, message: "Phone already exist" });

		if (password) {
			if (!validate.isValidPassword(password))
				return res.status(400).send({
					status: false,
					message:
						"Password should be between 8 and 15 character and must contain uppercase,lowercase, special characters and numerics",
				});

			//hashing password with bcrypt
			data.password = await bcrypt.hash(password, 10);
		}

		if (address) {
			const addressFields = ["state", "city", "pincode"];
			for (field of addressFields) {
				if (!data.address[field])
					return res.status(400).send({
						status: false,
						message: `Please provide ${field} in address`,
					});
			}

			const pincode = addressFields.pop();
			for (field of addressFields) {
				if (!validate.isValid(data.address[field]))
					return res
						.status(400)
						.send({ status: false, message: `Invalid ${field}` });
			}

			if (!validate.isPincodeValid(pincode))
				return res
					.status(400)
					.send({ status: false, message: "Invalid pincode" });
		}

		let updatedUser = await User.findOneAndUpdate(
			{ _id: userId, isDeleted: false },
			data,
			{
				new: true,
			}
		);
		return res.status(200).send({
			status: true,
			message: "User profile updated",
			data: updatedUser,
		});
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const deleteUser = async function (req, res) {
	try {
		const userId = req.params.userId;
		const updateUser = await User.findOneAndUpdate(
			{
				_id: userId,
				isDeleted: false,
			},
			{ isDeleted: true, deletedAt: new Date() },
			{ new: true }
		);
		if (!updateUser)
			return res.status(404).send({ status: false, message: "User not found" });
		else
			return res
				.status(200)
				.send({ status: true, message: "User deleted successfully" });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = { createUser, userLogin, getUser, updateUser, deleteUser };
