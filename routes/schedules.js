//schedule router
const express = require("express");
const scheduleRoute = express.Router();
const db = require("../database");

// Get all schedules
scheduleRoute.get("/", (req, res) => {
  db.any(
    "SELECT (firstname || ' ' ||lastname)username,day,start_time,end_time FROM schedules LEFT JOIN users on schedules.user_id=users.id ORDER BY username;"
  )
    .then((schedules) => {
      console.log(schedules);
      res.render("pages/schedules", {
        schedules,
        message: req.query.message,
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

scheduleRoute.get("/new", (req, res) => {
  console.log(req.session.userId);

  res.render("pages/new-schedule");
});

//get user schedule
// scheduleRoute.get("/users/:id/schedules", (req, res) => {
//   const uschedule = data.schedules.filter(
//     (schedule) => schedule.user_id == Number(req.params.id)
//   );
//   res.send(uschedule);
// });

// Create new schedule
scheduleRoute.post("/", (req, res) => {
  // add schedule of logged user
  //Todo: validate schedules

  const { selectDay, start_at, end_at } = req.body;
  console.log(req.body);
  const userID = req.session.userId;
  if (userID != null) {
    db.none(
      "INSERT INTO schedules(user_id, day, start_time, end_time) VALUES ($1, $2, $3, $4);",
      [userID, selectDay, start_at, end_at]
    )
      .then(() => {
        res.redirect("/users/userDetails");
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
