var server = require('http').createServer();

server.on('request', function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(process.env));
});

server.listen(process.env.PORT||3000);

/*var app = require('gopher'),
    mongoose = require('mongoose');

// Setup mongoose ODM
mongoose.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI);

// Configure app routes
require('./controllers')(app);*/