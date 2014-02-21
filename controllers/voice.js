var twilio = require('twilio');

// Voice URL just tells folks to text instead
module.exports = function(request, response) {
    var twiml = new twilio.TwimlResponse();
    twiml.say('Please text this number to play Twilleyo Trivia. Good luck!', {
        voice:'alice'
    });
    response.send(twiml);
};