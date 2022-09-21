const Book = require("../models/bookModel");
const ObjectId = require("mongoose").Types.ObjectId;

const isValidString = function (data) {
	if (typeof data !== "string" || data.trim().length === 0) return false;
	return true;
};

const createBook = async function (req, res) {
	try {
		const data = req.body;

		if (Object.keys(data).length === 0)
			return res
				.status(400)
				.send({ status: false, message: "Please Provide Data" });

		const requiredFields = [
			"title",
			"excerpt",
			"userId",
			"ISBN",
			"category",
			"subcategory",
			"releasedAt",
		];

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

		const ISBNregex =
			/^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$/;
		if (!ISBNregex.test(data.ISBN))
			return res.status(400).send({ status: false, message: "Invalid ISBN" });

		if (data.reviews) {
			if (typeof data.reviews !== "number")
				return res.status(400).send({
					status: false,
					message: "Reviews type invalid, should be in number.",
				});
		}

		const releasedAtRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
		if (!releasedAtRegex.test(data.releasedAt))
			return res
				.status(400)
				.send({ status: false, message: "Invalid Release Date" });

		if (!ObjectId.isValid(data.userId))
			return res
				.status(400)
				.send({ status: false, message: "Invalid ObjectId:UserId" });

		const uniqueFields = ["title", "ISBN"];
		for (field of uniqueFields) {
			const empObj = {};
			empObj[field] = data[field];
			const checkUnique = await Book.findOne(empObj);
			if (checkUnique)
				return res.status(400).send({
					status: false,
					message: `${field} already present. Please provide an unique ${field}`,
				});
		}

		const newBook = await Book.create(data);
		res.status(201).send({ status: true, message: "Success", data: newBook });
	} catch (error) {
		res.status(500).send({ status: false, message: error.message });
	}
};

const getbooks = async function (req, res) {
	try {
		let obj = { isDeleted: false };

		let userId = req.query.userId;
		let category = req.query.category;
		let subcategory = req.query.subcategory;

		if (userId) {
			obj.userId = userId;
		}
		if (category) {
			obj.category = category;
		}
		if (subcategory) {
			obj.subcategory = subcategory;
		}

		let findbook = await Book.find(obj)
			.select({
				_id: 1,
				title: 1,
				excerpt: 1,
				userId: 1,
				category: 1,
				reviews: 1,
				releasedAt: 1,
			})
			.sort({ title: 1 });
		if (findbook.length == 0) {
			return res.status(404).send({ status: false, message: "book not found" });
		}

		return res
			.status(200)
			.send({ status: true, message: "Success", data: findbook });
	} catch (err) {
		return res
			.status(500)
			.send({ status: false, message: "Error", error: err.message });
	}
};

const booksbyparam = async function (req, res) {
	try {
		let bookId = req.param.bookId;

		if (!bookId) {
			return res
				.status(400)
				.send({ status: false, message: "bookId is mendatory" });
		}

		let findbookId = await Book.findById(bookId);
		if (!findbookId) {
			return res.status(404).send({ status: false, message: "book not found" });
		}

		return res
			.status(200)
			.send({ status: true, message: "Success", data: findbookId });
	} catch (err) {
		return res
			.status(500)
			.send({ status: false, message: "Error", error: err.message });
	}
};

module.exports = { createBook, getbooks, booksbyparam };
