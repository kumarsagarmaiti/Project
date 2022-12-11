const express = require("express");
const router = express.Router();

const {
	register,
	loginUser,
	getStudent,
	editStudents,
	deleteStudents,
} = require("../controller/controllers");
const { authentication, authorization } = require("../middleware/auth");

router.use("/user/:userId", authentication, authorization);

router.post("/register", register);
router.post("/login", loginUser);
router.get("/user/:userId/student", getStudent);
router.post("/user/:userId/student", editStudents);
router.delete("/user/:userId/student/:studentId", deleteStudents);

module.exports = router;
