var mongoose = require('mongoose');

// Create player model
var playerSchema = new mongoose.Schema({
    phone: { 
        type:String, 
        required:true, 
        index: { unique:true } 
    },
    nick: { 
        type:String, 
        required:true, 
        index: { unique:true } 
    },
    points: Number
});

var Player = mongoose.model('Player', playerSchema);
module.exports = Player;