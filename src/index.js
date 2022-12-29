const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./route/route");

app.use(express.json());

mongoose
	.connect(
		"mongodb+srv://kumarsagar_functionup:CjDCkJbsxcpkMf5N@cluster0.fnt89sj.mongodb.net/cointab_assignment",
		{ useNewUrlParser: true }
	)
	.then(() => console.log("mongodb connected"))
	.catch((err) => console.log(err));

app.use("/", router);

app.listen(3000, () => console.log("Server listening"));
