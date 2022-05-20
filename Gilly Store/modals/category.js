const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    Name: String,
    Slug: String,
    Status: Number
});

module.exports = mongoose.model('Category', categorySchema);