const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route = require("./routes/route");

app.use(bodyParser.json());

mongoose
	.connect(
		"mongodb+srv://kumarsagar_functionup:CjDCkJbsxcpkMf5N@cluster0.fnt89sj.mongodb.net/url_shortener",
		{ useNewUrlParser: true }
	)
	.then(() => console.log("MongoDB is connected"))
	.catch((err) => console.log(err));

app.use("/", route);

app.listen(3001, () => console.log("Express app running on port" + " "+3001));
