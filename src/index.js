const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const route = require("./routes/route");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose
	.connect(
		"mongodb+srv://kumarsagar_functionup:CjDCkJbsxcpkMf5N@cluster0.fnt89sj.mongodb.net/property_tracker",
		{ useNewUrlParser: true }
	)
	.then(() => {
		console.log("MongoDB is connected");
	})
	.catch((error) => {
		console.log(error);
	});

app.use("/", route);

app.listen(3000, () => {
	console.log("Express app running on server:" + 3000);
});
