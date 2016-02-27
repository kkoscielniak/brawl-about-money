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
var server = app.listen(port);

/*
 * Socket.io configuration
 */
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
    console.log('a user connected.');
});

/*
 * APIs routings
 */
var questionsApi = require('./controllers/questions_api');
app.use('/api/questions', questionsApi);

/*
 * Front-ends routing
 */
app.use(express.static('public'));
var router = require('./controllers/router');
app.use('/', router);


console.log('magic happens!');
