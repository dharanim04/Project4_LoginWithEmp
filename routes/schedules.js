//schedule router
const express = require("express");
const scheduleRoute = express.Router();
const db = require("../database");

// Get all schedules
scheduleRoute.get("/new", (req, res) => {
  console.log("in schedules new");
  console.log(req.session.userId);
  const userID = req.session.userId;
  if (userID == null) {
    res.redirect("/");
  }
  db.any(
    "SELECT (firstname || ' ' ||lastname)username, Case day " +
      "When 1 then 'Monday' " +
      "When 2 then 'Tuesday' " +
      "When 3 then 'Wednesday' " +
      "When 4 then 'Thursday' " +
      "When 5 then 'Friday' " +
      "When 6 then 'Saturday' " +
      "When 7 then 'Sunday'" +
      "else 'Days' " +
      "end as day,start_time,end_time,schedules.id as sid FROM schedules LEFT JOIN users on schedules.user_id=users.id where schedules.user_id=$1 ORDER BY username;",
    [userID]
  )
    .then((schedules) => {
      // console.log(schedules);
      res.render("pages/new-schedule", {
        schedules,
        message: req.query.message,
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

// scheduleRoute.get("/new", (req, res) => {
//   console.log(req.session.userId);

//   res.render("pages/new-schedule");
// });
scheduleRoute.get("/delete/:id", (req, res) => {
  console.log("in delete operation");
  const userID = req.session.userId;

  console.log("parama id:" + req.params.id);
  const sid = req.params.id;
  if (sid != null) {
    db.none("DELETE FROM schedules WHERE ID=$1;", [sid])
      .then(() => {
        res.redirect("/schedules/new");
        // TODO: add success message
      })
      .catch((err) => {
        // error inserting into db
        console.log(err);
        res.send(err.message);
      });
  } else {
    req.flash("session expired");
    console.log(req.session.flash);
  }
});
// Create new schedule
scheduleRoute.post("/", (req, res) => {
  // add schedule of logged user
  //Todo: validate schedules
  console.log("in post schedule");
  const { selectDay, start_time, end_time } = req.body;
  console.log(req.body);
  const userID = req.session.userId;
  if (userID != null) {
    db.none(
      "INSERT INTO schedules(user_id, day, start_time, end_time) VALUES ($1, $2, $3, $4);",
      [userID, selectDay, start_time, end_time]
    )
      .then(() => {
        res.redirect("/schedules/new");
        // TODO: add success message
      })
      .catch((err) => {
        // error inserting into db
        console.log(err);
        res.send(err.message);
      });
  } else {
    req.flash("session expired");
    console.log(req.session.flash);
  }
});

module.exports = scheduleRoute;
