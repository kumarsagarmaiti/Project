const axios = require("axios");
const Movies = require("../Models/moviesmodel");
const validate = require("../Utils/validator");

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

module.exports = { createMovies, getMovies };
