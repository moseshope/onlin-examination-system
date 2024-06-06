const mongoose = require('mongoose');

const ProblemsSchema = new mongoose.Schema({
    prob_no: Number,
    prob_content: String,
    avail_answers: Array,
    cor_answer: Number,
    cor_description: String,
    category: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problems', ProblemsSchema);
