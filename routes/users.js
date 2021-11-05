//user router
const express = require("express");
const usersRoute = express.Router();
const db = require("../database");
const bcrypt = require("bcryptjs");
// Get all users
usersRoute.get("/", (req, res) => {
  //   res.send("users page");
  //   res.send(data.users);
  db.any("SELECT * FROM users;")
    .then((users) => {
      console.log(users);
      res.render("pages/users", {
        users,
        message: req.query.message,
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
})

//Display form log in
usersRoute.get("/login", (req,res) => {
  res.render("pages/login")
})



//redirect to new user creation page
// Display form for adding a new post

usersRoute.get("/new", (req, res) => {
  res.render("pages/new-user");
});

// Get individual user
usersRoute.get("/:id", (req, res) => {
  const userId = req.params.id;
  //   //   console.log(userId);
  //   if (userId === "new") {
  //     // Display form for adding a new post
  //     res.render("pages/new-user");
  //   } else if (Number.isInteger(Number(userId))) {
  //     // console.log("in else if");
  db.any("SELECT * FROM users WHERE id = $1;", userId)
    .then((users) => {
      // console.log("in users");
      // console.log(users);
      res.render("pages/users", {
        users,
        message: req.query.message,
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
  //   }
});

// Create new user
usersRoute.post("/", (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  // Using bcryptjs
  //   const password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  // TODO: Add hash to user object and then push to user array

  db.none(
    "INSERT INTO users(firstname, lastname, email, password) VALUES ($1, $2,$3,$4);",
    [firstname, lastname, email, password]
  )
    .then(() => {
      res.render("pages/users");
      // TODO: add success message
    })
    .catch((err) => {
      // error inserting into db
      console.log(err);
      res.send(err.message);
    });
});

module.exports = usersRoute;
