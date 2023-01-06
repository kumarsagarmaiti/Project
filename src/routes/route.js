const express = require("express");
const router = express.Router();

const URLController = require("../controllers/urlController");

router.get("/test", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.send("Working");
});

router.post("/url/shorten", URLController.shortenURL);

router.get("/:urlCode", URLController.redirecturl);

router.all("/*", (req, res) => res.status(400).send("Invalid URL"));

module.exports = router;
