var mongoose = require('mongoose');

// Model object for an incident report
var schema = new mongoose.Schema({
    question:String,
    answer:String,
    answered:[]
});

// Create Mongoose model and export
var Question = mongoose.model('Question', schema);
module.exports = Question;