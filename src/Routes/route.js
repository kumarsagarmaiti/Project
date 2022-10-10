const express = require("express");
const router = express.Router();

const user=require("../Controllers/userController")

router.post("/register",user.createUser)

module.exports=router