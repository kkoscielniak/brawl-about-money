var express = require('express'),
    api = express.Router(),
    random = require('../helpers/random');

var questionModel = require('../models/question');

/*
 * Generates logs when the question is sent as a response
 */
api.use(function(req, res, next) {
    console.log('Questions API: %s %s %s', req.method, req.url, req.path);
    next();
});

/*
 * Returns one question from the questions pool
 */
api.get('/get', function(req, res){
    var count;

    questionModel.count(function(err, c) {
        if (err) {
            res.json({
                message: err
            });
        } else {
            count = c;
            console.log('Current question pool: %d', count);

            if (count > 0) {
                questionModel.find({ 'questionId': random.intExclusive(0, count) } , function(err, question){
                    if (err) {
                        res.send(err);
                    }

                    res.json(question);
                });
            } else {
                res.json({
                    message: 'No questions in current pool!'
                });
            }
        }
    });
});

api.post('/add', function(req, res) {

    console.log(req.body);

    var question = new questionModel();
        question.question = req.body.question;
        question.category = req.body.category;
        question.answers = req.body.answers;

        question.save(function(err){
            if (err) {
                res.json({ message: err });
            }
            res.json({ message: 'Question added to the database' });
        });
})

module.exports = api;
