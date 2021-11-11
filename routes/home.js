//home route
const express = require("express");
const route = express.Router();
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

// route.get("/login", redirectToHome, (req, res) => {
//   console.log(req.session);
//   console.log(req.flash("success"));
//   console.log(req.session.flash);
//   res.render("pages/register");
// });

route.get("/getJson", (req, res, next) => {
  console.log("in request");
  console.log(req.query);
  let userID;
  if (req.query != null) {
    userID = req.query.selectpicker;
  } else {
    next("/");
  }

  if (req.query != null && Number(userID) > 0) {
    // console.log(userID);
    //filter values

    db.task("get-filtervalues", async (t) => {
      const usersAll = await t.any("select * from users;");
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
      return { usersAll, users, schedules };
    })
      .then(({ usersAll, users, schedules }) => {
        // console.log("in then");
        // console.log(users);
        res.render("pages/home", {
          usersAll,
          users,
          schedules,
          message: req.query.message,
        });
      })
      .catch((error) => {
        // error
        res.send(err.message);
      });
  } else if (Number(userID) === 0) {
    console.log("in 0 router");
    // res.next
    // next();
    res.redirect("/home/all");
  } else {
    res.send(req.query);
  }
});

// Welcome
route.get("/all", (req, res) => {
  console.log("in Home all");
  if (req.session.userId == null) {
    res.redirect("/");
  }
  const userID = req.session.userId;
  console.log(userID);
  console.log(req.session);
  db.task("get-everything", async (t) => {
    const usersAll = await t.any("select * from users;");
    const users = await t.any("select * from users;");
    const schedules = await t.any(
      "SELECT (firstname || ' ' ||lastname)username,Case day " +
        "When 1 then 'Monday' " +
        "When 2 then 'Tuesday' " +
        "When 3 then 'Wednesday' " +
        "When 4 then 'Thursday' " +
        "When 5 then 'Friday' " +
        "When 6 then 'Saturday' " +
        "When 7 then 'Sunday'" +
        "else 'Days' " +
        "end as day,start_time,end_time FROM schedules LEFT JOIN users on schedules.user_id=users.id ORDER BY username;"
    );
    return { usersAll, users, schedules };
  })
    .then(({ usersAll, users, schedules }) => {
      // console.log("in then");
      // console.log(users);
      res.render("pages/home", {
        usersAll,
        users,
        schedules,
        message: req.query.message,
      });
    })
    .catch((error) => {
      // error
      res.send(err.message);
    });
});
// login a user
route.post("/login", redirectToHome, (req, res) => {
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
      res.redirect("/home/all");

      // User ID can be accessed on any route via req.session.userId
    })
    .catch((err) => {
      // error checking db for existing email
      console.log(err);
      res.send(err.message);
    });
});
module.exports = route;
