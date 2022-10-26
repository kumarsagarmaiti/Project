const Business = require("../Models/businessmodel");
const Movies = require("../Models/moviesmodel");
const validate = require("../Utils/validator");
const moment = require("moment");
const objectId = require("mongoose").Types.ObjectId;

const createBusiness = async function (req, res) {
	try {
		const userId = req.params.userId;
		const data = req.body;

		const findBusiness = await Business.findOne({ userId, isDeleted: false });
		if (findBusiness)
			return res.status(400).send({
				status: false,
				message: "Business already present with the userId",
			});

		data.userId = userId;

		if (!validate.isValidInputBody(data))
			return res
				.status(400)
				.send({ status: false, message: "Please provide business data" });

		const mandatoryFields = ["businessName", "GST"];
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

		const GSTRegex =
			/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
		if (!GSTRegex.test(data.GST))
			return res
				.status(400)
				.send({ status: false, message: "Invalid GST Number" });

		const uniqueFields = ["GST", "businessName"];
		for (field of uniqueFields) {
			let empObj = {};
			empObj[field] = data[field];
			const isPresent = await Business.findOne(empObj);
			if (isPresent)
				return res
					.status(400)
					.send({ status: false, message: `${field} already present` });
		}

		if (!data.shows || data.shows.length < 1)
			return res
				.status(400)
				.send({ status: false, message: "Please provide shows details" });

		const showFields = [
			"movieId",
			"timings",
			"screen",
			"availableSeats",
			"ticketPrice",
		];
		for (field of showFields) {
			for (key in data.shows) {
				if (!moment(key, "DD/MM/YYYY", true).isValid())
					return res.status(400).send({
						status: false,
						message: `Invalid date format:${key}. Try DD/MM/YYYY`,
					});
				for (show of data.shows[key]) {
					if (!show[field])
						return res.status(400).send({
							status: false,
							message: `Please provide show's ${field}`,
						});
				}
			}
		}

		for (key in data.shows) {
			for (show of data.shows[key]) {
				if (!validate.isValidObjectId(show.movieId))
					return res.status(400).send({
						status: false,
						message: `Invalid movieId: ${show.movieId}  `,
					});
				show.movieId = new objectId(show.movieId);

				const findMovie = await Movies.findById(show.movieId);
				if (!findMovie)
					return res.status(404).send({
						status: false,
						message: `No movie found with the movieId: ${show.movieId}`,
					});

				if (!moment(show.timings, "LT", true).isValid())
					return res.status(400).send({
						status: false,
						message: `Invalid time format:${show.timings} for movieId: ${show.movieId}. Try 00:00 PM/AM`,
					});

				let obj1 = {};
				for (key in show.availableSeats) {
					for (i = 1; i <= show.availableSeats[key]; i++) {
						if (typeof show.availableSeats[key] !== "number")
							return res.status(400).send({
								status: false,
								message: `${key} in availableSeats should only contain number`,
							});
						obj1[`${key}${i}`] = "Available";
					}
				}
				show.availableSeats = obj1;
				for (key in show.ticketPrice) {
					if (typeof show.ticketPrice[key] !== "number")
						return res.status(400).send({
							status: false,
							message: `${key} in ticketPrice should only contain number`,
						});
				}
			}
		}
		const createBusiness = await Business.create(data);
		res.status(201).send({ status: true, data: createBusiness });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const getBusiness = async function (req, res) {
	try {
		const { userId, businessId } = req.params;

		if (!validate.isValidObjectId(businessId))
			return res.status(400).send({
				status: false,
				message: `Invalid businessId: ${businessId}  `,
			});
		const isBusinessPresent = await Business.findOne({
			_id: businessId,
			isDeleted: false,
		});
		if (!isBusinessPresent)
			return res.status(404).send({
				status: false,
				message: "No business found with the given businessId",
			});
		if (isBusinessPresent.userId.toString() !== userId)
			return res.status(403).send({
				status: false,
				message: "UserId doesnt match with the business's userId",
			});
		else return res.status(200).send({ status: true, data: isBusinessPresent });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const updateBusiness = async function (req, res) {
	try {
		const { userId, businessId } = req.params;

		if (!validate.isValidObjectId(businessId))
			return res.status(400).send({
				status: false,
				message: `Invalid businessId: ${businessId}  `,
			});
		const isBusinessPresent = await Business.findOne({
			_id: businessId,
			isDeleted: false,
		});
		if (!isBusinessPresent)
			return res.status(404).send({
				status: false,
				message: "No business found with the given businessId",
			});
		if (isBusinessPresent.userId.toString() !== userId)
			return res.status(403).send({
				status: false,
				message: "UserId doesnt match with the business's userId",
			});

		const data = req.body;
		if (!validate.isValidInputBody(data))
			return res
				.status(400)
				.send({ status: false, message: "Please provide updation data" });

		const { businessName, GST, address } = data;
		if (businessName) {
			if (!validate.isValid(businessName))
				return res
					.status(400)
					.send({ status: false, message: "Invalid businessName" });

			const businessNamepresent = await Business.findOne({ businessName });
			if (businessNamepresent)
				return res
					.status(400)
					.send({ status: false, message: "businessName already present" });
		}
		if (GST) {
			if (!validate.isValid(GST))
				return res.status(400).send({ status: false, message: "Invalid GST" });

			const GSTRegex =
				/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
			if (!GSTRegex.test(GST))
				return res
					.status(400)
					.send({ status: false, message: "Invalid GST Number" });

			const GSTpresent = await Business.findOne({ GST });
			if (GSTpresent)
				return res
					.status(400)
					.send({ status: false, message: "GST already present" });
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

			if (validate.isPincodeValid(pincode))
				return res
					.status(400)
					.send({ status: false, message: "Invalid pincode" });
		}

		const updateBusiness = await Business.findByIdAndUpdate(businessId, data, {
			new: true,
		});
		res.status(200).send({ status: true, data: updateBusiness });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const updateShows = async function (req, res) {
	try {
		const { userId, businessId } = req.params;

		if (!validate.isValidObjectId(businessId))
			return res.status(400).send({
				status: false,
				message: `Invalid businessId: ${businessId}  `,
			});
		const isBusinessPresent = await Business.findOne({
			_id: businessId,
			isDeleted: false,
		}).lean();
		if (!isBusinessPresent)
			return res.status(404).send({
				status: false,
				message: "No business found with the given businessId",
			});
		if (isBusinessPresent.userId.toString() !== userId)
			return res.status(403).send({
				status: false,
				message: "UserId doesnt match with the business's userId",
			});

		const data = req.body;

		if (!validate.isValidInputBody(data))
			return res
				.status(400)
				.send({ status: false, message: "Please provide business data" });

		if (data.insert && data.insert != 1)
			return res
				.status(400)
				.send({ status: false, message: "insert's value can only be 1" });
		if (data.remove && data.remove != 1)
			return res
				.status(400)
				.send({ status: false, message: "remove's value can only be 1" });

		if (data.insert && isBusinessPresent.shows[data.date])
			return res.status(400).send({
				status: false,
				message: `showDetails already present for date: ${data.date}`,
			});
		if (data.remove && !isBusinessPresent.shows[data.date])
			return res.status(400).send({
				status: false,
				message: `showDetails not present for date: ${data.date}`,
			});

		if (data.remove) {
			delete isBusinessPresent.shows[data.date];
		}

		const mandatoryFields = ["date", "showDetails"];
		if (!data.remove) {
			for (field of mandatoryFields) {
				if (!data[field])
					return res
						.status(400)
						.send({ status: false, message: `Please provide ${field}` });
			}
		} else {
			if (!data.date)
				return res
					.status(400)
					.send({ status: false, message: "Please provide date" });
		}

		if (
			!moment(data.date, "DD/MM/YYYY", true).isValid() ||
			!validate.isValid(data.date)
		)
			return res.status(400).send({
				status: false,
				message: `Invalid date format. Try DD/MM/YYYY`,
			});

		if (!data.remove) {
			const showFields = [
				"movieId",
				"timings",
				"screen",
				"availableSeats",
				"ticketPrice",
			];
			for (field of showFields) {
				for (show of data.showDetails) {
					if (!show[field])
						return res.status(400).send({
							status: false,
							message: `Please provide show's ${field}`,
						});
				}
			}

			for (show of data.showDetails) {
				if (!validate.isValidObjectId(show.movieId))
					return res.status(400).send({
						status: false,
						message: `Invalid movieId: ${show.movieId}  `,
					});
				show.movieId = new objectId(show.movieId);

				const findMovie = await Movies.findById(show.movieId);
				if (!findMovie)
					return res.status(404).send({
						status: false,
						message: `No movie found with the movieId: ${show.movieId}`,
					});

				if (!moment(show.timings, "LT", true).isValid())
					return res.status(400).send({
						status: false,
						message: `Invalid time format:${show.timings} for movieId: ${show.movieId}. Try 00:00 PM/AM`,
					});

				let obj1 = {};
				for (key in show.availableSeats) {
					for (i = 1; i <= show.availableSeats[key]; i++) {
						if (typeof show.availableSeats[key] !== "number")
							return res.status(400).send({
								status: false,
								message: `${key} in availableSeats should only contain number`,
							});
						obj1[`${key}${i}`] = "Available";
					}
				}
				show.availableSeats = obj1;
				for (key in show.ticketPrice) {
					if (typeof show.ticketPrice[key] !== "number")
						return res.status(400).send({
							status: false,
							message: `${key} in ticketPrice should only contain number`,
						});
				}
			}
		}

		if (!data.remove) isBusinessPresent.shows[data.date] = data.showDetails;

		const updateShows = await Business.findOneAndUpdate(
			{ _id: businessId, isDeleted: false },
			isBusinessPresent,
			{ new: true }
		);
		return res.status(200).send({ status: true, data: updateShows });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const deleteBusiness = async function (req, res) {
	try {
		const { userId, businessId } = req.params;

		if (!validate.isValidObjectId(businessId))
			return res.status(400).send({
				status: false,
				message: `Invalid businessId: ${businessId}  `,
			});
		const isBusinessPresent = await Business.findOne({
			_id: businessId,
			isDeleted: false,
		});
		if (!isBusinessPresent)
			return res.status(404).send({
				status: false,
				message: "No business found with the given businessId",
			});
		if (isBusinessPresent.userId.toString() !== userId)
			return res.status(403).send({
				status: false,
				message: "UserId doesnt match with the business's userId",
			});

		const deleteBusiness = await Business.findByIdAndUpdate(
			businessId,
			{ isDeleted: true, deletedAt: new Date() },
			{ new: true }
		);
		return res
			.status(204)
			.send({ status: true, message: "Business deleted successfully" });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

module.exports = {
	createBusiness,
	getBusiness,
	updateBusiness,
	updateShows,
	deleteBusiness,
};
