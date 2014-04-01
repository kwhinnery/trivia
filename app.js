var app = require('gopher'),
    mongoose = require('mongoose');

// Setup mongoose ODM
mongoose.connect(process.env.MONGOLAB_URL);

// Configure app routes
require('./controllers')(app);