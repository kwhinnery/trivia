// Setup mongoose ODM
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOHQ_URL);
var Player = require('./models/Player');

var client = require('twilio')();

Player.find().exec(function(err, players) {
    players.forEach(function(player) {
        client.sendMessage({
            to:player.phone,
            from:'(608) 729-0012',
            body:'It\'s almost time for the final showdown! 10 questions, live at the Doubletree party, for DOUBLE POINTS. It\'s still anyone\'s game! Must be present to win the N64, SNES, or PC game prizes. Find the guy in the red track jacket to play at 8pm sharp.' 
        }, function(err, message) {
            if (err) {
                console.log(err);
            }
        });
    });
});

