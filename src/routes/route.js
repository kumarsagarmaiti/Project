const express = require("express");
const router = express.Router();

const userController=require("../controllers/userController")
const bookController=require("../controllers/bookController")

router.get("/test-me", function (req, res) {
	res.send("test api");
});

router.post("/register",userController.createUser)
// router.get("/books",bookController.getbooks)
// router.get("/books/:bookId",bookController.booksbyparam)


module.exports = router;
