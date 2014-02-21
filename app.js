var app = require('gopher'),
    twilio = require('twilio');

// Twilio Webhook Middleware, shared across all Twilio webhooks
var twebhook = twilio.webhook({
    validate:false
});

// Handle SMS interface to the Twivia app
app.post('/sms', twebhook, function(request, response) {
    var twiml = new twilio.TwimlResponse();
    twiml.message('Are you getting pumped for Twilio Trivia! Text back here tomorrow to play :)');
    response.send(twiml);
});

// Tell anyone calling the number to text instead
app.post('/voice', twebhook, function(request, response) {
    var twiml = new twilio.TwimlResponse();
    twiml.say('Please text this number to play Twilleyo Trivia. Good luck!', {
        voice:'alice'
    });
    response.send(twiml);
});