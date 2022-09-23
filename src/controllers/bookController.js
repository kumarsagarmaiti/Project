const Book = require("../models/bookModel");
const Review = require("../models/reviewModel");
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
			return res.status(400).send({
				status: false,
				message: "Date should be in YYYY-MM-DD format",
			});

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

<<<<<<< HEAD
//--------------------update/put book-------------------//

const updateBooks = async function (req, res) {
	try {
	  let bookId = req.params.bookId;
	  
	  let books = await Book.findById(bookId);
	  if (!books) {
		return res.status(404).send("book doesn't exists");
	  }
	
	  let bookData = req.body;
	  const { title, excerpt, ISBN, releasedate } = bookData;
	  if(title){
		let isTitlePresent=await Book.find({title:title})
		if(Object.keys(isTitlePresent).length !== 0) return res.status(400).send({status:false,message:"Title already present"})
	  }
	  if(ISBN){
		let isISBNPresent=await Book.find({ISBN:ISBN})
		if(Object.keys(isISBNPresent).length !== 0) return res.status(400).send({status:false,message:"ISBN is already present"})
	  }
  
	  let updateBook = await Book.findOneAndUpdate(
		{ _id: bookId }, { title: title, excerpt: excerpt, ISBN: ISBN, releasedate: new Date() },{new: true });
	  res.status(201).send({ status: true, data: updateBook });
	} catch (err) {
	  res.status(500).send({ msg: err.message });
	}
  };
//...................................getbooks........................................................

const getbooks = async function (req, res) {
=======
const getBooks = async function (req, res) {
>>>>>>> ee4cd0f583625360cc99fd5d651f88eca3d81624
	try {
		for (keys of Object.keys(req.query)) {
			if (req.query[keys].length === 0)
				return res
					.status(400)
					.send({ status: false, msg: `Please provide ${keys}` });
		}

		const queryArray = ["userId", "category", "subcategory"];
		for (key in req.query) {
			if (!queryArray.includes(key))
				return res.status(400).send({
					status: false,
					msg: `Query parameters can only be among these: ${queryArray.join(
						", "
					)}`,
				});
		}

		let { userId, category, subcategory } = req.query;

		let obj = { isDeleted: false };

		if (userId) {
			if (!ObjectId.isValid(userId) || userId.trim().length === 0)
				return res.send({ status: false, message: "Invalid userId" });
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
		if (findbook.length === 0) {
			return res.status(404).send({ status: false, message: "No books found" });
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

const booksByParam = async function (req, res) {
	try {
		let bookId = req.params.bookId;
		if (!bookId) {
			return res
				.status(400)
				.send({ status: false, message: "bookId is mandatory" });
		}

		if (!ObjectId.isValid(bookId)) {
			return res
				.status(400)
				.send({ status: false, msg: "Please enter correct bookId" });
		}

		let findBook = await Book.findOne({ _id: bookId, isDeleted: false })
			.select({ ISBN: 0, __v: 0 })
			.lean();
		if (!findBook) {
			return res.status(404).send({ status: false, message: "Book not found" });
		}
		const reviewsData = await Review.find({ bookId });
		findBook.reviewsData = reviewsData;

		return res
			.status(200)
			.send({ status: true, message: "Success", data: findBook });
	} catch (err) {
		return res
			.status(500)
			.send({ status: false, message: "Error", error: err.message });
	}
};

const deleteBook = async function (req, res) {
	try {
		let bookId = req.params.bookId;

		let markdelete = await Book.findByIdAndUpdate(
			bookId,
			{ isDeleted: true, deletedAt: new Date() },
			{ new: true }
		);
		res.status(200).send({ status: true, message: "Book successfully deleted" });
	} catch (err) {
		res
			.status(500)
			.send({ status: false, message: "Error", error: err.message });
	}
};

<<<<<<< HEAD
module.exports = { createBook, getbooks, booksbyparam, deletebook,updateBooks };
=======
module.exports = { createBook, getBooks, booksByParam, deleteBook };
>>>>>>> ee4cd0f583625360cc99fd5d651f88eca3d81624
