const axios = require("axios");
const Movies = require("../Models/moviesmodel");

const createMovies = async function (req, res) {
	try {
		let { title } = req.body;
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
		const createMovie = await Movies.create(data);
		res.send(createMovie);
	} catch (error) {
		res.send(error.message);
	}
};
module.exports = { createMovies };
