const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const users = require('./routes/users');
// var pg = require('pg');

const app = express();

// // Connect to Postgres
// var pg = require('pg');
// var connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5433/sampledb';
// var client = new pg.Client(connectionString);


// client.connect(function (err) {
//   if (err) throw err;

//   console.log("PosgreSQL connection is OK");
//   // execute a query on our database
//   // client.query('SELECT $1::text as name', ['brianc'], function (err, result) {
//   //   if (err) throw err;

//   //   // just print the result to the console
//   //   console.log(result.rows[0]); // outputs: { name: 'brianc' }

//   //   // disconnect the client
//   //   client.end(function (err) {
//   //     if (err) throw err;
//   //   });
//   // });
// });


// Connect to Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', function(){
    console.log('Connected to database ' + config.database);
});

// On connection error
mongoose.connection.on('error', function(err){
    console.log('Database error: ' + err);
});

const port = process.env.PORT || 8080;

// Cors Middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.get('/', function(req, res){
    res.send('Invalid Endpoint');
});

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, function() {
    console.log('Server started on port ' + port);
});
