const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    Name: String,
    Phone: String,
    Add: String,
    Note: Number,
    Cart: [{
        id: String,
        Name: String,
        Size: Number,
        Qty: Number,
        Price: Number
    }],
    TotalPrice:Number,
    Status: Number
})

module.exports = mongoose.model('Order', orderSchema)