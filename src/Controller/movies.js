const axios = require("axios");
const Movies = require("../Models/moviesmodel");
const Business = require("../Models/businessmodel");
const validate = require("../Utils/validator");
const moment = require("moment");

const createMovies = async function (req, res) {
	try {
		let { title } = req.body;
		if (!title || !validate.isValid(title))
			return res.status(400).send({ status: false, message: "Invalid title" });

		const findMovie = await Movies.findOne({ Title: title });
		if (findMovie)
			return res.status(200).send({ status: true, data: findMovie });
		let options = {
			method: "get",
			url: `https://www.omdbapi.com/?t=${title}&apikey=8d637eb4`,
		};
		const result = await axios(options);
		const data = result.data;
		if (data.Response === "False")
			return res.status(404).send({ status: false, message: data.Error });
		data.Genre = data.Genre.split(", ");
		data.Actors = data.Actors.split(", ");
		if (data.imdbRating !== "N/A") data.imdbRating = Number(data.imdbRating);
		const createMovie = await Movies.create(data);
		res.send(createMovie);
	} catch (error) {
		res.send(error.message);
	}
};

const getMovies = async function (req, res) {
	try {
		const data = req.query;

		if (data.length === 0) {
			const findMovies = await Movies.find().select({
				Title: 1,
				Year: 1,
				Actor: 1,
				Genre: 1,
				imdbRating: 1,
				Country: 1,
				Language: 1,
				Plot: 1,
				Runtime: 1,
			});
			return res.status(200).send({ status: true, data: findMovies });
		}

		if (data.Actor) data.Actor = { $in: data.Actor.split(", ") };
		if (data.Genre) data.Genre = { $in: data.Genre.split(", ") };
		if (data.Rating) {
			data.imdbRating = { $gte: Number(data.Rating) };
			delete data.Rating;
		}

		const findMovies = await Movies.find(data).select({
			Title: 1,
			Year: 1,
			Actor: 1,
			Genre: 1,
			imdbRating: 1,
			Country: 1,
			Language: 1,
			Plot: 1,
			Runtime: 1,
		});
		return res.status(200).send({ status: true, data: findMovies });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const getHalls = async function (req, res) {
	try {
		if (!validate.isValidInputBody(req.body))
			return res.status(400).send({
				status: false,
				message: "Please provide movieId, date and location",
			});

		const { movieId, date, location } = req.body;

		const mandatoryFields = ["movieId", "date", "location"];
		for (field of mandatoryFields) {
			if (!req.body[field])
				return res
					.status(400)
					.send({ status: false, message: `Please provide ${field}` });
		}

		const findBusiness = await Business.find({
			"address.city	": location,
			isDeleted: false,
		})
			.select({ address: 1, _id: 1, shows: 1, businessName: 1 })
			.lean();
		if (findBusiness.length === 0)
			return res
				.status(404)
				.send({ status: false, message: "No theater near you." });

		const relative = moment(date, "DD/MM/YYYY").fromNow();
		if (relative == "Invalid date") {
			return res.status(400).send({ status: false, message: "Invalid date" });
		} else if (
			!(relative.split(" ")[0] == "in") &&
			relative.split(" ")[1] != "hours"
		)
			return res.status(400).send({ status: false, message: "Older Date" });

		for (let business of findBusiness) {
			for (key in business.shows) {
				const relative = moment(key, "DD/MM/YYYY").fromNow();
				if (relative.split(" ")[0] == "in") continue;
				if (relative.split(" ")[1] != "hours") {
					delete business.shows[key];
					const updateBusiness = await Business.findByIdAndUpdate(
						business._id,
						business
					);
				}
			}
		}

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
				message:
					"No theater showing the movie with the movieId: " +
					movieId +
					" on " +
					date,
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

		let flag = false;
		const availableSeats = [];
		if (findBusiness.shows[date]) {
			for (show of findBusiness.shows[date]) {
				if (show.movieId.toString() == movieId && show.timings == time) {
					flag = true;
					for (key in show.availableSeats) {
						if (show.availableSeats[key] == "Available")
							availableSeats.push(key);
					}
				}
			}
		}
		if (!flag)
			return res.status(404).send({
				status: false,
				message: "Movie not screening for the given date and time",
			});

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

module.exports = { createMovies, getMovies, getHalls, getAvailableSeats };
