const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const userAuth = require("../middleware/auth");

router.post("/register", userController.createUser);
router.post("/login", userController.userLogin);
router.post(
	"/books",
	userAuth.authenticate,
	userAuth.authorizationFromBody,
	bookController.createBook
);
router.get("/books", userAuth.authenticate, bookController.getBooks);
router.get(
	"/books/:bookId",
	userAuth.authenticate,
	bookController.booksByParam
);
router.put(
	"/books/:bookId",
	userAuth.authorizationFromParam,
	bookController.updateBooks
);
router.delete(
	"/books/:bookId",
	userAuth.authenticate,
	userAuth.authorizationFromParam,
	bookController.deleteBook
);
router.post("/books/:bookId/review", reviewController.createReview);

module.exports = router;
