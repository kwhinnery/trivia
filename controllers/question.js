var Question = require('../models/Question');

exports.index = function(request, response) {
    response.render('question/index');
};

exports.create = function(request, response) {
    var question = request.param('question'),
        answer = request.param('answer');

    // Right now there's only one question at a time
    Question.findOne({}, function(err, model) {
        if (err) {
            response.send(500, err);
        } else {
            if (model) {
                model.question = question;
                model.answer = answer;
                model.answered = [];
                model.save(function(err) {
                    if (err) {
                        response.send(500, 'Error occurred updating question');
                    } else {
                        response.redirect('/question');
                    }
                });
            } else {
                Question.create({
                    question:question,
                    answer:answer
                }, function(err, model) {
                    if (err) {
                        response.send(500, 'Error creating question');
                    } else {
                        response.redirect('/question');
                    }
                });
            }
        }
    });
};