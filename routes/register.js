const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database");
const registerRoute = express.Router();

//Regex
const emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
const passwordRegex = /^[^<>]{6,}$/;

const isValid = (value, regex) => {
  return regex.test(value);
};

const cleanEmail = (email) => {
  return email ? email.toLowerCase().trim() : "";
};

// display register form
registerRoute.get("/", (req, res) => {
  res.render("pages/register", {
    //errors: req.flash("error")
  });
});

// @path    '/register'
// @desc    register a new user
// @access  public
registerRoute.post("/", (req, res) => {
  const { firstname, lastname, email, password, confirmPassword } = req.body;
  const cleanedEmail = cleanEmail(email);

  // 1. validate! - yup and joi are decent validation packages

  if (!email || !password || !confirmPassword)
    req.flash("error", "Please enter all fields");
  if (!isValid(cleanedEmail, emailRegex)) req.flash("error", "Email not valid");
  if (!isValid(password, passwordRegex))
    req.flash("error", "Password must be 6 characters or more");
  if (password !== confirmPassword) req.flash("error", "Passwords don't match");
  //if (req.session.flash.error.length > 0) return res.redirect("/users/register")

  // 2. check if email already exists

  db.oneOrNone("SELECT email FROM users WHERE email = $1;", [cleanedEmail])
    .then((user) => {
      if (user) return res.send("User already exists");

      // 3. if all valid and email doesn't already exist, hash password and insert into db

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      console.log(req.body);
      db.none(
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4);",
        [firstname, lastname, cleanedEmail, hash]
      )
        .then(() => {
          req.flash("success", "User successfully created, please login.");
          req.flash("success", "Good job!");
          res.redirect("/users/login");
          // TODO: add success message
        })
        .catch((err) => {
          // error inserting into db
          console.log(err);
          res.send(err.message);
        });
    })
    .catch((err) => {
      // error checking whether the email exists
      console.log(err);
      res.send(err.message);
    });
});
module.exports = registerRoute;
