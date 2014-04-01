var app = require('gopher'),
    mongoose = require('mongoose');

// Setup mongoose ODM
mongoose.connect(process.env.MONGOHQ_URL);

// Configure app routes
require('./controllers')(app);