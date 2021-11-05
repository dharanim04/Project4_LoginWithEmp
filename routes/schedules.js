//schedule router
const express = require("express");
const scheduleRoute = express.Router();
const db = require("../database");

// Get all schedules
scheduleRoute.get("/", (req, res) => {
  db.any(
    "SELECT (firstname || ' ' ||lastname)username,day,start_time,end_time FROM schedules LEFT JOIN users on schedules.user_id=users.id ORDER BY username;"
  ).then((schedules) => {
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

//get user schedule
// scheduleRoute.get("/users/:id/schedules", (req, res) => {
//   const uschedule = data.schedules.filter(
//     (schedule) => schedule.user_id == Number(req.params.id)
//   );
//   res.send(uschedule);
// });

// Create new schedule
scheduleRoute.post("/schedules", (req, res) => {
  // Add post to all posts
  data.schedules.push(req.body);
  res.send(req.body);
});
module.exports = scheduleRoute;
