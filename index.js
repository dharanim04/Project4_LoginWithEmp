require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./database");
const morgan = require("morgan");
//app define before router
const app = express();
const homeroute = require("./routes/home");
const usersRoute = require("./routes/users");
const scheduleRoute = require("./routes/schedules");
const PORT = process.env.PORT || 3000;

// JSON and form parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));

// ROUTES
app.use("/users", usersRoute);
app.use("/schedules", scheduleRoute);
// app.use("/getJson", homeroute);
app.use("/", homeroute);

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
