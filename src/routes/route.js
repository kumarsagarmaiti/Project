const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const reviewController = require("../controllers/reviewController");
const userAuth=require("../middleware/auth")


//User API
router.post("/register", userController.createUser);
router.post("/login", userController.userLogin);
<<<<<<< HEAD
router.post("/books",userAuth.authorization, bookController.createBook);
router.get("/books", bookController.getbooks);
router.get("/books/:bookId", bookController.booksbyparam);
router.delete("/books/:bookId",userAuth.authorization1, bookController.deletebook);
router.put("/books/:bookId",bookController.updateBooks)
=======

//Book API
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
// router.put(
// 	"/books/:bookId",
// 	userAuth.authorizationFromParam,
// 	bookController.updateBooks
// );
router.delete(
	"/books/:bookId",
	userAuth.authenticate,
	userAuth.authorizationFromParam,
	bookController.deleteBook
);

//Review API
router.post("/books/:bookId/review", reviewController.createReview);
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

>>>>>>> ee4cd0f583625360cc99fd5d651f88eca3d81624
module.exports = router;
