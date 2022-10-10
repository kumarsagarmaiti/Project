const express = require("express");
const multer = require('multer')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./routes/route");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(multer().any())

mongoose.connect("mongodb+srv://project5group10:9y46YnehOwJOJ4al@cluster0.xxbyiwq.mongodb.net/test", { useNewUrlParser: true, })

  .then((result) => console.log("✅ , MongoDb is connected"))
  .catch((err) => console.log('⚠️ ',err));


app.use("/", route);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});