const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./Routes/route");
const app = express();

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(multer().any());

mongoose
	.connect(
		"mongodb+srv://kumarsagar_functionup:CjDCkJbsxcpkMf5N@cluster0.fnt89sj.mongodb.net/kumar_bms",
		{ useNewUrlParser: true }
	)

	.then(() => console.log("✅ MongoDb is connected"))
	.catch((err) => console.log("⚠️ ", err));

app.use("/", route);

app.listen(3000, () => {
	console.log(`Express app connected to port 3000`);
});
