var Question = require('../models/Question'),
    Player = require('../models/Player');

// Render home page
module.exports = function(request, response) {
    var leaders, question;

    // Get the current question
    function getQuestion() {
        Question.findOne({}, function(err, q) {
            question = err ? {question:'Error, no question found.'} : q;
            response.render('index', {
                question:question,
                leaders:leaders
            });
        });
    }

    // Grab current leaderboard
    Player.find({}).sort('-points').limit(10).exec(function(err, players) {
        leaders = err ? [] : players;
        getQuestion();
    });
};