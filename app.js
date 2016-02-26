var express = require('express'),
    bodyParser = require('body-parser');

/*
 * Base configuration
 */
var port = process.env.PORT || 8080;
var config = require('./config/config');

/*
 * Database settings and connection
 */
var mongoose = require('mongoose');
mongoose.connect(config.mongoDBUrl);

/*
 * Express app configuration
 */
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var api = require('./controllers/questions_api.js');
app.use('/api/questions', api);

app.listen(port);
console.log('magic happens!');
