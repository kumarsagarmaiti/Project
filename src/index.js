const express = require("express");
const app = express();
const mongoose = require("mongoose");
const route = require("./routes/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
	.connect(
		"mongodb+srv://kumarsagar_functionup:CjDCkJbsxcpkMf5N@cluster0.fnt89sj.mongodb.net/tailwind_assignment",
		{ useNewUrlParser: true }
	)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

app.use("/", route);

app.listen(3000, () => console.log("Connected to port 3000"));
