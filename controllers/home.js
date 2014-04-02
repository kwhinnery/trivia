var Question = require('../models/Question'),
    Player = require('../models/Player');

function getHomePageData(cb) {
    var leaders, question;

    // Get the current question
    function getQuestion() {
        Question.find({}).select('-answer').exec(function(err, q) {
            question = err ? {question:'Error, no question found.'} : q;
            cb({
                question:question,
                leaders:leaders
            });
        });
    }

    // Grab current leaderboard
    Player.find({}).sort('-points').select('-phone').limit(10).exec(function(err, players) {
        leaders = err ? [] : players;
        getQuestion();
    });
}

// Render home page
exports.index = function(request, response) {
    getHomePageData(function(data) {
        response.render('index', data);
    });
};

// Render a pgae intended for display on an external monitor during the event
exports.display = function(request, response) {
    response.render('display');
};

// Set up quick and dirty polling for leaderboard
exports.poll = function(request, response) {
    getHomePageData(function(data) {
        response.send(data);
    });
};