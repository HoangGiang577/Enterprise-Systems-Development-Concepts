const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Name: String,
    Image: String,
    Price: Number,
    Discount: Number,
    Parent: [{
        type: mongoose.ObjectId,
        ref: 'Category'
    }],
    Sales: Number,
    Size: [Number],
    Status: Number,
    Slug: String,
});

module.exports = mongoose.model('Product', productSchema);