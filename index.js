require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const products = require('./routes/product');
const user = require('./routes/user');
const admin = require('./routes/admin');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 5000;
const app = express();
const DB = process.env.DB_ATLAS;

app.use(cors()); 
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Successful");
    app.listen(PORT, () => {
      console.log(`connected at port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("Connection Error:", e);
    process.exit(1);
  });

app.use('/auth',auth);
app.use('/api',products);
app.use('/api',user);
app.use('/admin', admin);