require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const bcrypt = require("bcryptjs");
const db = require("./database");
const morgan = require("morgan");
//app define before router
const app = express();
const homeroute = require("./routes/home");
const usersRoute = require("./routes/users");
const scheduleRoute = require("./routes/schedules");
const registerRoute = require("./routes/register");
const logoutRouter = require("./routes/logout");
const PORT = process.env.PORT || 3000;

// JSON and form parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));

// session config
app.use(
  session({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    name: "mrcoffee_sid",
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(flash());
// ROUTES
app.use("/users", usersRoute);
app.use("/schedules", scheduleRoute);
app.use("/", registerRoute);
app.use("/logout", logoutRouter);
app.use("/all", homeroute);

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
