const User = require("../Models/usermodel");
const Business = require("../Models/businessmodel");
const validate = require("../Utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment=require("moment")

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

const getMovies = async function (req, res) {
	try {
		const userLocation = req.userDetails.address.city;
		if (!validate.isValidInputBody(req.body))
			return res
				.status(400)
				.send({ status: false, message: "Please provide movieId and date" });

		const { movieId, date } = req.body;
		const findBusiness = await Business.find({
			"address.city	": userLocation,
			isDeleted: false,
		})
			.select({ address: 1, _id: 1, shows: 1, businessName: 1 })
			.lean();
		if (findBusiness.length === 0)
			return res
				.status(404)
				.send({ status: false, message: "No theater near you." });

		const holdBusiness = {};
		for (business of findBusiness) {
			for (key in business.shows) {
				if (key == date) {
					for (show of business.shows[key]) {
						if (show.movieId.toString() == movieId) {
							delete show.availableSeats;
							holdBusiness[business["_id"]] = show;
							holdBusiness[business["_id"]]["address"] = business.address;
							holdBusiness[business["_id"]]["businessName"] =
								business.businessName;
						}
					}
				}
			}
		}

		if (Object.keys(holdBusiness).length < 1)
			return res.status(404).send({
				status: false,
				message: "No theater showing the movie with the movieId: " + movieId,
			});
		if (holdBusiness)
			return res.status(200).send({ status: true, data: holdBusiness });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const getAvailableSeats = async function (req, res) {
	try {
		if (!validate.isValidInputBody(req.body))
			return res.status(400).send({
				status: false,
				message: "Please provide  date, time, movieId and businessId",
			});

		const { date, time, movieId, businessId } = req.body;

		const mandatoryFields = ["date", "time", "movieId", "businessId"];
		for (field of mandatoryFields) {
			if (!req.body[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
		}

		if (
			!moment(req.body.date, "DD/MM/YYYY", true).isValid() ||
			!validate.isValid(req.body.date)
		)
			return res.status(400).send({
				status: false,
				message: `Invalid date format. Try DD/MM/YYYY`,
			});
		if (
			!moment(req.body.time, "LT", true).isValid() ||
			!validate.isValid(req.body.time)
		)
			return res.status(400).send({
				status: false,
				message: `Invalid time format. Try 00:00 PM/AM`,
			});

		if (!validate.isValidObjectId(movieId))
			return res.status(400).send({
				status: false,
				message: `Invalid movieId: ${movieId}`,
			});

		if (!validate.isValidObjectId(businessId))
			return res.status(400).send({
				status: false,
				message: `Invalid businessId: ${businessId}  `,
			});

		const findBusiness = await Business.findOne({
			_id: businessId,
			isDeleted: false,
		});
		if (!findBusiness)
			return res.status(404).send({
				status: false,
				message: "No business found with the given businessId",
			});

		const availableSeats = [];
		if (findBusiness.shows[date]) {
			for (show of findBusiness.shows[date]) {
				if (show.movieId.toString() == movieId && show.timings == time) {
					for (key in show.availableSeats) {
						if (show.availableSeats[key] == "Available")
							availableSeats.push(key);
					}
				}
			}
		} else {
			return res.status(404).send({
				status: false,
				message: "No movie showing for the given date",
			});
		}
		if (availableSeats.length > 0)
			return res.status(200).send({ status: true, data: availableSeats });
		else
			return res.status(404).send({
				status: false,
				message: "No available seats",
			});
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = {
	createUser,
	userLogin,
	getUser,
	updateUser,
	deleteUser,
	getMovies,
	getAvailableSeats,
};
