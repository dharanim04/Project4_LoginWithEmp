const express = require('express')
const bcrypt = require('bcryptjs')
const morgan = require('morgan')
const db = require('./database')
const app = express() // invoke express in order to create an instance

const PORT = process.env.PORT || 3000

const days = ['Monday','Tuesday','Wednesday','Thursday', 'Friday', 'Saturday' , 'Sunday']

// JSON and form parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use(morgan('dev'))

// Set view engine
app.set('view engine', 'ejs')

// Set static folder
app.use(express.static('public'))

// ROUTES
// Welcome 
app.get('/', (req, res) => {
  res.render('pages/home')
})

// Get all users
app.get('/users', (req, res) => {
  db.any('SELECT * FROM users;')
  .then((users) => {
    console.log(users)
    
    res.render('pages/users', {
      name:users.firstname + users.lastname,
      users
    })

  })
  .catch((error) => {
    console.log(error)
    res.redirect('/error?message=' + error.message)
  })
 
})

// Get all schedules
app.get('/schedules', (req, res) => {
  db.any("SELECT *, TO_CHAR(start_at, 'HH12:MI AM') AS start_at,  TO_CHAR(end_at, 'HH12:MI AM') AS end_at FROM schedules;")
  .then((schedules) => {
    console.log(schedules)
    //console.log(users)
    res.render('pages/schedules', {
      days,
      schedules
    })
    
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/error?message=' + error.message)
  })

})

//Get all data in userschedule
app.get('/userschedules', (req, res) => {
  db.any("SELECT *, TO_CHAR(start_time, 'HH12:MI AM') AS start_time,  TO_CHAR(end_time, 'HH12:MI AM') AS end_time FROM userschedules;")
  .then((userschedules) => {
    console.log(userschedules)
    res.render('pages/userschedules', {
      days,
      userschedules
    })
    
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/error?message=' + error.message)
  })

})

// Get new user
app.get('/users/new', (req, res) => {
  res.render('pages/new-user')
})

//Get new schedule
app.get('/schedules/new', (req, res) => {
  res.render('pages/new-schedule')
})

//Get new user schedule
app.get('/userschedule/new', (req, res) => {
  res.render('pages/new-userschedule')
})


//get user register
app.get('/users/register', (req, res) => {
  res.render('pages/register')
})

// Get individual user
app.get('/users/:id', (req, res) => {
  db.any('SELECT * FROM users WHERE id = $1', [Number(req.params.id)+1])
  //db.any('SELECT * FROM users;')
  .then((users) => {
    console.log(users)
    res.render('pages/user',{
      id : (users.length)-1,
      users
    })
    
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/error?message=' + error.message)
  })
  
})

//get username invidual
app.get('/userschedules/:id', (req,res) => {
  db.any("SELECT *, TO_CHAR(start_time, 'HH12:MI AM') AS start_time,  TO_CHAR(end_time, 'HH12:MI AM') AS end_time  FROM userschedules WHERE id=$1",[Number(req.params.id)])
  .then((userschedules) => {
    console.log(userschedules)
    res.render('pages/userschedule', {
      
      id:Number(req.params.id),
      days,
      userschedules
    })
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/error?message=' + error.message)
  })
  
      
})


//Get user's schedules
app.get('/schedules/:id', (req,res) => {
  db.any("SELECT *, TO_CHAR(start_at, 'HH12:MI AM') AS start_at,  TO_CHAR(end_at, 'HH12:MI AM') AS end_at  FROM schedules WHERE user_id=$1",[Number(req.params.id)])
  .then((schedules) => {
    console.log(schedules)
    res.render('pages/schedule', {
      
      id:Number(req.params.id),
      days,
      schedules
    })
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/error?message=' + error.message)
  })
  
      
})

// Create new schedules
app.post('/schedules', (req, res) => {
  const {user_id, day, start_at, end_at} = req.body

  db.none('INSERT INTO schedules (user_id, day, start_at, end_at) VALUES ($1, $2, $3, $4);', [user_id, day, start_at, end_at])
  .then(() => {
    res.redirect('/schedules?message=Post+successfully+added')
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/error?message=' + error.message)
  })
})

app.post('/userschedules', (req, res) => {
  const {username, day, start_time, end_time} = req.body

  db.none('INSERT INTO userschedules (username, day, start_time, end_time) VALUES ($1, $2, $3, $4);', [username, day, start_time, end_time])
  .then(() => {
    res.redirect('/userschedules?message=Post+successfully+added')
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/error?message=' + error.message)
  })
})
// Create new user
app.post('/users', (req, res) => {
const {firstname,lastname,email,password} = req.body
// Using bcryptjs
const salt = bcrypt.genSaltSync(10)
const hash = bcrypt.hashSync(password, salt)
req.body.password = hash
db.none('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4);', [firstname, lastname, email, hash])
  .then(() => {
    res.redirect('/users?message=Post+successfully+added')
  })
  .catch((error) => {
    console.log(error)
    res.redirect('/error?message=' + error.message)
  })
  
})


app.get('*', (req, res) => {
  res.render('pages/error', {
    message: req.query.message || 'This page cannot be found'
  })
})

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`)
})