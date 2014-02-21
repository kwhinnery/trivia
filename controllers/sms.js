var twilio = require('twilio'),
    Player = require('../models/Player'),
    Question = require('../models/Question');

// Handle inbound SMS and process commands
module.exports = function(request, response) {
    var twiml = new twilio.TwimlResponse();
    
    var body = request.param('Body').trim(),
        playerPhone = request.param('From'),
        player = null,
        question = null;

    // Emit a response with the given message
    function respond(str) {
        twiml.message(str);
        response.send(twiml);
    }

    // Process the "nick" command
    function nick(input) {
        if (was('help', input)) {
            respond('Set your nickname, as you want it to appear on the leaderboard. Example: "nick Mrs. Awesomepants"');
        } else {
            if (input === '') {
                respond('A nickname is required. Text "nick help" for command help.');
            } else {
                player.nick = input;
                player.save(function(err) {
                    if (err) {
                        respond('There was a problem updating your nickname, or that nickname is already in use. Please try another nickname.');
                    } else {
                        respond('Your nickname has been changed!');
                    }
                });
            }
        }
    }

    // Process the "stop" command
    function stop(input) {
        if (was('help', input)) {
            respond('Unsubscribe from all messages. Example: "stop"');
        } else {
            player.remove(function(err, model) {
                if (err) {
                    respond('There was a problem unsubscribing. Please try again later.');
                } else {
                    respond('You have been unsubscribed.');
                }
            });            
        }
    }

    // Process the "question" command
    function questionCommand(input) {
        if (was('help', input)) {
            respond('Print out the current question. Example: "question"');
        } else {
            Question.findOne({}, function(err, q) {
                question = err ? {question:'Error, no question found.'} : q;
                respond('Current question: '+question.question);
            });
        }
    }

    // Once the current question is found, determine if we have an eligible
    // answer
    function processAnswer(input) {
        if (!question.answered) {
            question.answered = [];
        }

        if (question.answered.indexOf(player.phone) > -1) {
            respond('You have already answered this question!');
        } else {
            var answerLower = question.answer.toLowerCase(),
                inputLower = input.toLowerCase();

            if (answerLower.indexOf(inputLower) > -1) {
                var points = 5 - question.answered.length;
                if (points < 1) {
                    points = 1;
                }

                // Update the question, then the player score
                question.answered.push(player.phone);
                question.save(function(err) {
                    player.points = player.points+points;
                    player.save(function(err2) {
                        respond('Woop woop! You got it! Your score is now: '+player.points);
                    });
                });

            } else {
                respond('Sorry! That answer was incorrect. Guess again...');
            }
        }
    }

    // Process the "answer" command
    function answer(input) {
        if (was('help', input)) {
            respond('Answer the current question - spelling is important, capitalization is not. If you don\'t know the current question, text "question". Example: "answer frodo baggins"');
        } else {
            Question.findOne({}, function(err, q) {
                question = err ? {question:'Error, no question found.'} : q;
                processAnswer(input);
            });
        }
    }

    // Process the "score" command
    function score(input) {
        if (was('help', input)) {
            respond('Print out your current score. Example: "score"');
        } else {
            respond('Your current score is: '+player.points);
        }
    }

    // Helper to see if the command was a given string
    function was(command, input) {
        var lowered = input.toLowerCase();
        return lowered ? lowered.indexOf(command) === 0 : false;
    }

    // Helper to chop off the command string for further processing
    function chop(input) {
        var idx = input.indexOf(' ');
        return idx > 0 ? input.substring(idx).trim() : '';
    }

    // Parse their input command
    function processInput() {
        var input = body||'help';
        var chopped = chop(input);

        if (was('nick', input)) {
            nick(chopped);
        } else if (was('stop', input)) {
            stop(chopped);
        } else if (was('answer', input)) {
            answer(chopped);
        } else if (was('question', input)) {
            questionCommand(chopped);
        } else if (was('score', input)) {
            score(chopped);
        } else {
            respond('Welcome to Twilio Trivia '+player.nick+'! Commands are "answer", "question", "nick", "score", help", and "stop". Text "<command name> help" for usage. View the current question at http://twilio-trivia.herokuapp.com');
        }
    }

    // Create a new player
    function createPlayer() {
        Player.create({
            phone:playerPhone,
            nick:'Mysterious Stranger '+playerPhone.substring(7),
            points:0
        }, function(err, model) {
            if (err) {
                respond('There was an error signing you up, try again later.');
            } else {
                player = model;
                respond('Welcome to Twilio Trivia! You are now signed up. Text "help" for instructions.');
            }
        });
    }

    // Deal with the found player, if it exists
    function playerFound(err, model) {
        if (err) {
            respond('There was an error recording your answer.');
        } else {
            if (model) {
                player = model;
                processInput();
            } else {
                createPlayer();
            }
        }
    }

    // Kick off the db access by finding the player for this phone number
    Player.findOne({
        phone:playerPhone
    }, playerFound);
};