const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//import routes
const scrapRoute = require("./src/routes/scraper");
const productRoute = require("./src/routes/product");

//Config App
require("dotenv").config();
const app = express();

//connect to mongoDB
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("database connected !!"))
  .catch((err) => console.log(err));

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api", scrapRoute);
app.use("/api/crawlo", productRoute);

//start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app is running on port ${port}`));
