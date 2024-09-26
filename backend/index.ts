import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import auth from "./src/routes/auth";
import products from "./src/routes/product";
import user from "./src/routes/user";
import admin from "./src/routes/admin";
import connection from "./dbconn";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", auth);
app.use("/api", products);
app.use("/api", user);
app.use("/admin", admin);

connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Connected at port ${PORT}`);
  });
});
