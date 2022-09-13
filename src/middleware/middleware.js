const validation = require("../validators/validator");

// This validation is used for creating blogs only. This checks whether the mandatory fields are present in the body or not and if absent sends a msg to provide the field
const createBlogValidation = async function (req, res, next) {
	try {
		// let { title, body, authorId, category } = req.body;
		let requiredFields = ["title", "body", "authorId", "category"];
		for (field of requiredFields) {
			if (!req.body[field])
				return res
					.status(400)
					.send({ status: false, msg: `Please provide ${field}` });
		}
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}

	next();
};

// This validation is used for creating and updating blog. For creating blog this comes after the createBlogValidation function. Below function checks the field present in the body has proper value type or not, with the help of validation functions present in the validator file
const BlogValidation = async function (req, res, next) {
	try {
		if (!validation.isValidRequestBody(req.body)) {
			return res
				.status(400)
				.send({ status: false, msg: "Please provide blog's details" });
		}
		const requestBody = req.body;
		if (!requestBody.category) {
		return	res
				.status(400)
				.send({ status: false, msg: "Please provide category" });
		}
		// Validation for the mentioned
		let fields = ["title", "body","category"];
		for (field of fields) {
			if (!validation.isValidString(requestBody[field]))
				return res.status(400).send({ status: false, msg: `Invalid ${field}` });
		}

		// Validation of tags
		if (requestBody.tags) {
			// Checking the tags from req.body is a valid and non-empty string
			if (validation.isValidString(requestBody.tags)) {
				// This makes the tags into an array if the input is string
				arrOfTags = validation.makeArray(requestBody.tags);

				// This creates a new unique array of tags removing any duplicate values from the input
				let uniqueArrOfTags = [...new Set(arrOfTags)];

				// If the unique array is empty it will send an error: Invalid tags
				if (uniqueArrOfTags.length == 0)
					return res.status(400).send({ status: false, msg: "Invalid tags" });
				requestBody.tags = [...uniqueArrOfTags];
			} else if (validation.isValidArray(requestBody.tags)) {
				// If the input of array is in an array this will flatten it into a single array
				arrOfTags = validation.flattenArray(requestBody.tags);

				// If the input array is empty it will send an error: Invalid tags
				if (arrOfTags.length === 0)
					return res.status(400).send({ status: false, msg: "Invalid tags" });

				// This creates a new unique array of tags removing any duplicate values from the input
				let uniqueArrOfTags = [...new Set(arrOfTags)];

				// We are setting the tags array to the key of requestBody object
				requestBody.tags = [...uniqueArrOfTags];
			} else {
				return res.status(400).send({ status: false, msg: "Invalid tags" });
			}
		}

		// Validation of subcategory
		if (requestBody.subcategory) {
			// Checking the subcategory from req.body is a valid and non-empty string
			if (validation.isValidString(requestBody.subcategory)) {
				// This makes the subcategory into an array if the input is string
				let arrOfSubcategory = validation.makeArray(requestBody.subcategory);

				// This creates a new unique array of subcategory removing any duplicate values from the input
				let uniqueArrOfSubcategory = [...new Set(arrOfSubcategory)];

				// If the unique array is empty it will send an error: Invalid subcategory
				if (uniqueArrOfSubcategory.length == 0)
					return res
						.status(400)
						.send({ status: false, msg: "Invalid subcategory" });
				requestBody.subcategory = [...uniqueArrOfSubcategory];
			} else if (validation.isValidArray(requestBody.subcategory)) {
				// If the input of array is in an array this will flatten it into a single array
				let arrOfSubcategory = validation.flattenArray(requestBody.subcategory);

				// If the input array is empty it will send an error: Invalid subcategory
				if (arrOfSubcategory.length === 0)
					return res
						.status(400)
						.send({ status: false, msg: "Invalid subcategory" });

				// This creates a new unique array of subcategory removing any duplicate values from the input
				let uniqueArrOfSubcategory = [...new Set(arrOfSubcategory)];

				// We are setting the subcategory array to the key of requestBody object
				requestBody.subcategory = [...uniqueArrOfSubcategory];
			} else {
				return res
					.status(400)
					.send({ status: false, msg: "Invalid subcategory" });
			}
		}

		//If isPublished is set true in the req.body then we change the set a key publishedAt and provide the date of creating the blog
		if (requestBody.isPublished === true) requestBody.publishedAt = new Date();

		// We create a new key in the request object called modifiedBody and then use it later on to get the data passed on from this blogValidation function
		req.modifiedBody = requestBody;
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
	next();
};

// This validation is used for fetching and deleting blogs by query params.
const BlogValidationFromQuery = async function (req, res, next) {
	try {
		// Destructuring from the req.query
		let { authorId, category, tags, subcategory, unpublished } = req.query;

		// Creating an array of keys we expect to get from the req.query
		const queryArray = [
			"authorId",
			"category",
			"tags",
			"subcategory",
			"unpublished",
		];

		// For keys present in req.query we are checking if the queryArray includes that key or not. If there is any other key besides the elements of the array then we throw an error
		for (key in req.query) {
			if (!queryArray.includes(key))
				return res.status(400).send({
					status: false,
					msg: `Query parameters can only be among these: ${queryArray.join(
						", "
					)}`,
				});
		}

		// For keys present in req.query we check the length of its value and if its 0 then we throw an error saying please provide a value
		for (keys of Object.keys(req.query)) {
			if (req.query[keys].length === 0)
				return res
					.status(400)
					.send({ status: false, msg: `Please provide ${keys}` });
		}

		// Creating a dynamic object which will be updated with key and value we are getting from req.query
		const dynamicObj = {};

		// Checks whether the authorId is a valid ObjectId or not
		if (authorId) {
			if (!validation.isValidObjectId(authorId)) {
				return res
					.status(400)
					.send({ status: false, msg: "authorId is invalid" });
			}
			dynamicObj.authorId = authorId;
		}

		// Checks whether the category is a valid string or not
		if (category) {
			if (!validation.isValidString(category)) {
				return res
					.status(400)
					.send({ status: false, msg: "category is invalid" });
			}
			dynamicObj.category = category;
		}

		// Checks whether the tags is/are a valid string or not
		if (tags) {
			if (validation.isValidString(tags)) {
				// For more than one tags we are creating an array of tags and converting them to lowercase according to our database
				let arrOfTags = validation.makeArray(tags);
				if (arrOfTags.length == 0) {
					return res.status(400).send({ status: false, msg: "Invalid tags" });
				}
				// Creating a key in the dynamicObj and a value {in:[...tags]} to check for any blogs containing the provided tags
				dynamicObj.tags = { $in: [...arrOfTags] };
			}
		}

		// Checks whether the subcategory is/are a valid string or not
		if (subcategory) {
			if (validation.isValidString(subcategory)) {
				// For more than one subcategory we are creating an array of subcategory and converting them to lowercase according to our database
				let arrOfSubcategory = validation.makeArray(subcategory);
				if (arrOfSubcategory.length == 0) {
					return res
						.status(400)
						.send({ status: false, msg: "Invalid subcategory" });
				}
				// Creating a key in the dynamicObj and a value {in:[...arrOfSubcategory]} to check for any blogs containing the provided subcategory
				dynamicObj.subcategory = { $in: [...arrOfSubcategory] };
			}
		}

		// Checks whether unpublished is a valid string or not and converting to Boolean
		if (unpublished) {
			unpublished = unpublished.trim();
			if (!validation.isValidString(unpublished)) {
				return res
					.status(400)
					.send({ status: false, msg: "unpublished is invalid" });
			}
			if (unpublished == "false") {
				unpublished = true;
			} else if (unpublished == "true") {
				unpublished = false;
			} else {
				return res.status(400).send({
					status: false,
					msg: "Please provide either true or false for unpublished",
				});
			}
			dynamicObj.isPublished = unpublished;
		}
		// We create a new key in the request object called modifiedQuery and then use it later on to get the data passed on from this blogValidationFromQuery function
		req.modifiedQuery = dynamicObj;

		next();
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
};

module.exports = {
	BlogValidationFromQuery,
	createBlogValidation,
	BlogValidation,
};
