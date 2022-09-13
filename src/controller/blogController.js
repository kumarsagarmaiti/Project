const blogModel = require("../models/blogModel");

// Function for creating a blog
const createBlog = async function (req, res) {
	try {
		// Incoming modifiedBody object from middleware in req.modifiedBody which we are storing in requestBody
		const requestBody = req.modifiedBody;
		const newBlog = await blogModel.create(requestBody);
		res.status(201).send({ status: true, data: newBlog });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

// Function for getting blogs by query params
const getBlogs = async function (req, res) {
	try {
		// Incoming modifiedQuery object from middleware in req.modifiedQuery is stored in a new object filterObj. We are also setting isDeleted false and isPublished true for getting those blogs
		const filterObj = req.modifiedQuery;
		filterObj.isDeleted = false;
		filterObj.isPublished = true;

		// Finding blogs and populating it
		const allBlogs = await blogModel.find(filterObj).populate("authorId");
		if (allBlogs.length === 0) {
			return res.status(404).send({ status: false, msg: "Resource Not Found" });
		}
		res.status(200).send({
			status: true,
			msg: `${allBlogs.length} blog(s) found`,
			data: allBlogs,
		});
	} catch (error) {
		return res.status(500).send({ status: false, msg: error.message });
	}
};

// Function for updating blogs
const updateBlog = async function (req, res) {
	try {
		// Getting blogId from path params
		const blogId = req.params.blogId;
		// Incoming modifiedBody object from middleware in req.modifiedBody which we are storing in updateData
		const updateData = req.modifiedBody;
		//Creating a dynamic object for storing key and value pairs incoming from body
		let obj = {};

		const ifPublished = await blogModel.findById(blogId);
		if (ifPublished.isPublished === false) {
			obj.isPublished = true;
			obj.publishedAt = new Date();
		}
		// "$addToSet" adds only those elements that are not already present
		obj["$addToSet"] = {};

		if (updateData.title) obj.title = updateData.title;
		if (updateData.body) obj.body = updateData.body;
		if (updateData.category) obj.category = updateData.category;
		if (updateData.tags) {
			obj["$addToSet"]["tags"] = [...updateData.tags];
		} else {
			res.status(400).send({ status: false, msg: "tags must be present" });
		}
		if (updateData.subcategory)
			obj["$addToSet"]["subcategory"] = { $each: [...updateData.subcategory] };

		// Providing the obj as the updation we want in findByIdAndUpdate
		const updatedBlog = await blogModel
			.findByIdAndUpdate(blogId, obj, {
				new: true,
			})
			.populate("authorId");
		res
			.status(200)
			.send({ status: true, msg: "Successfully updated", data: updatedBlog });
	} catch (err) {
		res.status(500).send({ status: false, msg: err.message });
	}
};

const deleteBlogById = async function (req, res) {
	try {
		const blogId = req.params.blogId;
		let blog = await blogModel.findById(blogId);

		// Finding the blogs by Id and not deleted
		if (!blog || blog["isDeleted"] == true) {
			res.status(404).send({ status: false, msg: "No blog found" });
			return;
		}

		const deletedBlog = await blogModel.findOneAndUpdate(
			{ _id: blogId, isDeleted: false },
			{ isDeleted: true, deletedAt: new Date() }
		);

		// Sending empty response body with successful status code
		res.status(200).send();
	} catch (error) {
		return res.status(500).send({ status: false, msg: error });
	}
};

// Function for deleting blogs by query params
const deleteFromQuery = async function (req, res) {
	try {
		// Incoming modifiedQuery object from middleware in req.modifiedQuery is stored in a new object data. We are also setting isDeleted false and isPublished false for getting those blogs
		let data = req.modifiedQuery;
		
		if (Object.keys(req.modifiedQuery).length == 0)
		return res
		.status(400)
		.send({ status: false, msg: "Please provide a filter" });
		
		data.isDeleted = false;
		
		// If authorId is present in query params we are checking if the authorId is matching with the one present in the token
		if (data.authorId) {
			if (data.authorId !== req["x-api-key"].authorId)
				return res.send({ status: false, msg: "User not authorised" });
		}
		// If authorId is not present in query params we are setting a new key in data object called authorId and setting the authorId from token, so the user can only delete his own blogs
		if (!data.authorId) data.authorId = req["x-api-key"].authorId;

		// Updating isDeleted to true and adding the date and time of deletion by the query params
		let update = await blogModel.updateMany(
			data,
			{ $set: { isDeleted: true, deletedAt: new Date() } },
			{ new: true }
		);

		// If no blogs found then 404
		if (update.modifiedCount == 0) {
			return res.status(404).send({ status: false, msg: "Blog not found" });
		}
		res.status(200).send({
			status: true,
			msg: `Successfully deleted ${update.modifiedCount} blog(s)`,
		});
	} catch (error) {
		res.status(500).send({ status: false, msg: error.message });
	}
};

module.exports = {
	createBlog,
	getBlogs,
	updateBlog,
	deleteBlogById,
	deleteFromQuery,
};
