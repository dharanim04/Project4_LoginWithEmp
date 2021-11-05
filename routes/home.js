//home route
const express = require("express");
const route = express.Router();
const db = require("../database");

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
        "SELECT (firstname || ' ' ||lastname)username,day,start_time,end_time FROM schedules LEFT JOIN users on schedules.user_id=users.id where schedules.user_id=$1 ORDER BY username;",
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
    res.redirect("/");
  } else {
    res.send(req.query);
  }
});
// Welcome
route.get("/", (req, res) => {
  db.task("get-everything", async (t) => {
    const usersAll = await t.any("select * from users;");
    const users = await t.any("select * from users;");
    const schedules = await t.any(
      "SELECT (firstname || ' ' ||lastname)username,day,start_time,end_time FROM schedules LEFT JOIN users on schedules.user_id=users.id ORDER BY username;"
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

module.exports = route;
