const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const userAuth = require("../middleware/auth");

const {
	createUser,
	getUsers,
	createOrder,
	getOrder,
} = require("../controllers/albanero-test");

router.post("/createUser", createUser);
router.get("/allUsers", getUsers);
router.post("/createOrder", createOrder);
router.get("/allOrders/:userId", getOrder); 
//User API
router.post("/register", userController.createUser);
router.post("/login", userController.userLogin);

//Book API
router.post(
	"/books",
	userAuth.authenticate,
	userAuth.authorizationFromBody,
	bookController.createBook
);
router.get("/books", userAuth.authenticate, bookController.getBooks);
router.get(
	"/:bookId/books",
	userAuth.authenticate,

	bookController.booksByParam
);
router.put(
	"/books",
	userAuth.authenticate,
	// userAuth.authorizationFromParam,
	bookController.updateBooks
);
router.delete(
	"/books/:bookId",
	userAuth.authenticate,
	// userAuth.authorizationFromParam,
	bookController.deleteBook
);

//Review API
router.post("/books/:bookId/review", reviewController.createReview);
router.put("/books/:bookId/review/:reviewId", reviewController.updateReview);
router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReview);

module.exports = router;
