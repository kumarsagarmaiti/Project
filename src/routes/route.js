const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bookController = require("../controllers/bookController");
const userAuth = require("../middleware/auth");

router.get("/test-me", function (req, res) {
	res.send("test api");
});

router.post("/register", userController.createUser);
router.post("/login", userController.userLogin);
router.post("/books", userAuth.authorization, bookController.createBook);
router.get("/books", userAuth.authenticate, bookController.getbooks);
router.get(
	"/books/:bookId",
	userAuth.authenticate,
	bookController.booksbyparam
);
router.delete(
	"/books/:bookId",
	userAuth.authenticate,
	userAuth.authorization1,
	bookController.deletebook
);

module.exports = router;
