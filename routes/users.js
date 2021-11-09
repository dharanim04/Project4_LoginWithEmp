//user router
const express = require("express");
const usersRoute = express.Router();
const db = require("../database");
const bcrypt = require("bcryptjs");
const { redirectToHome } = require("../middleware/redirect");

const { emailRegex, passwordRegex } = require("../middleware/validations");

const isValid = (value, regex) => {
  return regex.test(value);
};
const cleanEmail = (email) => {
  return email ? email.toLowerCase().trim() : "";
};
// Get all users
// usersRoute.get("/", (req, res) => {
//   //   res.send("users page");
//   //   res.send(data.users);
//   db.any("SELECT * FROM users;")
//     .then((users) => {
//       console.log(users);
//       res.render("pages/users", {
//         users,
//         message: req.query.message,
//       });
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });
// });

// @path    '/users/login'
// @desc    login a user
// @access  public
//Display form log in
usersRoute.get("/login", redirectToHome, (req, res) => {
  console.log(req.session);
  console.log(req.flash("success"));
  console.log(req.session.flash);
  res.render("pages/login");
});

// Get individual user
usersRoute.get("/userDetails", (req, res) => {
  console.log("in user details");
  const userID = req.session.userId;
  console.log(userID);
  if (Number(userID) > 0) {
    // console.log(userID);
    //filter values

    db.task("get-filtervalues", async (t) => {
      const users = await t.any("select * from users where id=$1;", [userID]);
      const schedules = await t.any(
        "SELECT (firstname || ' ' ||lastname)username, Case day " +
          "When 1 then 'Monday' " +
          "When 2 then 'Tuesday' " +
          "When 3 then 'Wednesday' " +
          "When 4 then 'Thursday' " +
          "When 5 then 'Friday' " +
          "When 6 then 'Saturday' " +
          "When 7 then 'Sunday'" +
          "else 'Days' " +
          "end as day,start_time,end_time FROM schedules LEFT JOIN users on schedules.user_id=users.id where schedules.user_id=$1 ORDER BY username;",
        [userID]
      );
      return { users, schedules };
    })
      .then(({ users, schedules }) => {
        // console.log("in then");
        // console.log(users);
        res.render("pages/usersSchedules", {
          users,
          schedules,
          message: req.query.message,
        });
      })
      .catch((error) => {
        // error
        res.send(err.message);
      });
  } else {
    res.send(req.query);
  }
});

// login a user
usersRoute.post("/login", redirectToHome, (req, res) => {
  const { email, password } = req.body;
  const cleanedEmail = cleanEmail(email);

  // 1. validate
  if (!email || !password)
    return res.send("Please enter both email and password");
  if (!isValid(cleanedEmail, emailRegex)) return res.send("Email is not valid");
  if (!isValid(password, passwordRegex))
    return res.send("Password is not valid");

  // 2. does user exist?
  db.oneOrNone("SELECT * FROM users WHERE email = $1;", [cleanedEmail])
    .then((user) => {
      if (!user) return res.send("Credentials are not correct");

      // 3. if so, is password correct?
      const checkPassword = bcrypt.compareSync(password, user.password);
      if (!checkPassword) return res.send("Credentials are not correct");

      // 4. user is valid!!! do something to track them
      // >>>>>>>>>>>>>>>>>>>
      req.session.userId = user.id;
      console.log(req.session);

      // display user information with schedule
      res.redirect("/users/userDetails");

      // User ID can be accessed on any route via req.session.userId
    })
    .catch((err) => {
      // error checking db for existing email
      console.log(err);
      res.send(err.message);
    });
});

// Create new user
// usersRoute.post("/", (req, res) => {
//   const { firstname, lastname, email, password } = req.body;
//   // Using bcryptjs
//   //   const password = req.body.password;
//   const salt = bcrypt.genSaltSync(10);
//   const hash = bcrypt.hashSync(password, salt);

//   // TODO: Add hash to user object and then push to user array

//   db.none(
//     "INSERT INTO users(firstname, lastname, email, password) VALUES ($1, $2,$3,$4);",
//     [firstname, lastname, email, password]
//   )
//     .then(() => {
//       res.render("pages/users");
//       // TODO: add success message
//     })
//     .catch((err) => {
//       // error inserting into db
//       console.log(err);
//       res.send(err.message);
//     });
// });

module.exports = usersRoute;
