var express = require('express');
var app = express();

var port = process.env.PORT || 8080;
var config = require('./config/config');

var mongoose = require('mongoose');
mongoose.connect(config.mongoDBUrl);

var api = require('./controllers/questions_api.js');
app.use('/api/questions', api);

app.listen(port);
console.log('magic happens!');
