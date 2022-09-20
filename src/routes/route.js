const express = require("express");
const router = express.Router();

const userController=require("../controllers/userController")

router.get("/test-me", function (req, res) {
	res.send("test api");
});

router.post("/register",userController.createUser)

module.exports = router;
