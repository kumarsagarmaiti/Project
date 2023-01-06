const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route = require("./routes/route");
const cors = require("cors");

const corsOptions = {
	origin: "http://localhost:3000",
};
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

mongoose
	.connect(
		"mongodb+srv://kumarsagar_functionup:CjDCkJbsxcpkMf5N@cluster0.fnt89sj.mongodb.net/url_shortener1",
		{ useNewUrlParser: true }
	)
	.then(() => console.log("MongoDB is connected"))
	.catch((err) => console.log(err));

app.use("/", route);

app.listen(3001, () => console.log("Express app running on port" + 3001));
