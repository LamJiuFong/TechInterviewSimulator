// model/questionModel.js
const mongoose = require('mongoose');

// Define the question schema
const questionSchema = new mongoose.Schema({
    questionTitle: { type: String, required: true },
    questionDescription: String,
    questionCategory: String,
    questionComplexity: String
});

module.exports = mongoose.model('Question', questionSchema);
