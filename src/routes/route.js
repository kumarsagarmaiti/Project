const express = require("express");
const router = express.Router();

const blogController = require("../controller/blogController");
const authorController = require("../controller/authorController");
const BlogValidation = require("../middleware/middleware");
const authUser = require("../middleware/auth");

router.use("/blogs", authUser.userAuthentication); // User authentication having path /blogs. Protected paths

router.post("/authors", authorController.createAuthor);
router.post("/login", authorController.authorLogin);
router.post(
	"/blogs",
	authUser.userAuthorisation, // User authorisation
	BlogValidation.createBlogValidation, // Middleware for checking required parameters in req.body
	BlogValidation.BlogValidation, // Validation for data from req.body
	blogController.createBlog // Creating a new blog
);
router.get(
	"/blogs",
	BlogValidation.BlogValidationFromQuery, // Validation for data from req.query
	blogController.getBlogs // Fetching blogs
);
router.put(
	"/blogs/:blogId",
	authUser.userAuthorisation, // User authorisation
	BlogValidation.BlogValidation, //Validation for data from req.body
	blogController.updateBlog // Updating blogs
);
router.delete(
	"/blogs/:blogId",
	authUser.userAuthorisation, // User authorisation
	blogController.deleteBlogById // Deleting blogs by Id from path params
);
router.delete(
	"/blogs",
	authUser.userAuthorisation, // User authorisation
	BlogValidation.BlogValidationFromQuery, // Validation for data from req.query
	blogController.deleteFromQuery // Deleting blogs by query params
);

module.exports = router;
