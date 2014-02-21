var twilio = require('twilio'),
    express = require('express');

// Configure app routes
module.exports = function(app) {
    // Twilio webhooks
    var hook = twilio.webhook(); // twilio webhook middleware
    app.post('/sms', hook, require('./sms'));
    app.post('/voice', hook, require('./voice'));

    // Admin Route
    var auth = express.basicAuth(function(user, pass) {
        var un = process.env.TRIVIA_USERNAME,
            pw = process.env.TRIVIA_PASSWORD;

        return user === un && pass === pw;
    });

    // Manage current question
    var question = require('./question');
    app.get('/question', auth, question.index)
    app.post('/question', auth, question.create);

    // Game Status (Home Page)
    app.get('/', require('./home'));
};