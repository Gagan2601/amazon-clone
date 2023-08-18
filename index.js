const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const products = require('./routes/product');
const user = require('./routes/user');
const PORT = process.env.PORT || 5000;
const app = express();
const DB = "mongodb+srv://gagan:gagan123@cluster0.703ikio.mongodb.net/?retryWrites=true&w=majority"

app.use(express.json());
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth',auth);
app.use('/api',products);
app.use('/api',user);

app.listen(PORT, () => {
    console.log(`connected at port ${PORT}`);
  });